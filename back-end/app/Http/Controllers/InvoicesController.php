<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoicesRequest;
use App\Models\Inventory_transactions;
use App\Models\Invoices;

use App\Models\Services;
use App\Models\Staffs;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoicesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getCustomerAppointments(Request $request)
    {
        $appointment =  Invoices::where('customer_id', $request->user()->customer->id)->with('staff.users', 'invoiceDetails.service')->where('status', 'pending')->with('invoiceDetails')->latest()->get();
        return response()->json($appointment, 200);
    }
    public function getCustomerAppointmentsHistory(Request $request)
    {
        $appointment = Invoices::where('customer_id', $request->user()->customer->id)
            ->where('status', 'completed')
            ->with('invoiceDetails')
            ->latest()
            ->get();

        return response()->json($appointment, 200);
    }
    public function getStaffAppointmentsHistory(Request $request)
    {

        $appointment =  Invoices::where('staff_id', $request->user()->staff->id)->where('status', 'completed')->with('invoiceDetails')->latest()->get();
        return response()->json($appointment, 200);
    }
    public function getCustommerAppointmentsHistory(Request $request)
    {

        $appointment =  Invoices::where('staff_id', $request->user()->customer->id)->where('status', 'completed')->with('invoiceDetails')->latest()->get();
        return response()->json($appointment, 200);
    }
    public function getAvailableTimeOfStaff(Request $request)
    {
        // kiem tra xem co chon nhan vien khong
        if ($request->staff_id) {
            $appointments = Invoices::where(
                'staff_id',
                $request->staff_id
            )
                ->whereDate(
                    'appointment_date',
                    $request->appointment_date
                )
                ->get();
        } else {
            $appointments = Invoices::whereDate('appointment_date', $request->appointment_date)
                ->get();
        }
        $totalDuration = Services::whereIn(
            'id',
            collect($request->services)->pluck('service_id')
        )->sum('duration_minutes');
        $start = Carbon::parse('08:00');
        $end   = Carbon::parse('20:00');
        $availableSlots = [];

        while ($start < $end) {

            $slotStart = $start->format('H:i:s');
            $slotEnd = Carbon::parse($slotStart)
                ->addMinutes((int) $totalDuration)
                ->format('H:i:s');
            if (Carbon::parse($slotEnd)->gt($end)) {
                break;
            }
            $isBooked = $appointments->contains(
                function ($appointment) use ($slotStart, $slotEnd) {
                    return $slotStart < $appointment->end_time
                        && $slotEnd > $appointment->start_time;
                }
            );

            $availableSlots[] = [
                'time' => $slotStart,
                'available' => !$isBooked
            ];

            $start->addMinutes(20);
        }
        return response()->json([
            'staff_id' => $request->staff_id,
            'slots' => $availableSlots
        ]);
    }
    //cho admin
    public function index()
    {
        $appointment = Invoices::with('staff', 'customer', 'invoiceDetails.service')->latest()->paginate(10);
        return response()->json($appointment, 200);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(StoreInvoiceRequest $request)
    {

        $validated = $request->validated();


        $totalDuration = Services::whereIn(
            'id',
            collect($validated['services'])->pluck('service_id')
        )->sum('duration_minutes');

        $endTime = Carbon::parse($validated['start_time'])
            ->addMinutes((int) $totalDuration)
            ->format('H:i:s');
        if (empty($validated['staff_id'])) {
            $randomStaff = $this->findAvailableStaff($validated['appointment_date'], $validated['start_time'], $endTime);
            if (!$randomStaff) {
                return response()->json([
                    'message' => 'No staff available'
                ], 422);
            }
            $validated['staff_id'] = $randomStaff->id;
        }
        $isBooked = Invoices::where('staff_id', $validated['staff_id'])
            ->where('appointment_date', $validated['appointment_date'])
            ->where(function ($query) use ($validated, $endTime) {
                $query->where('start_time', '<', $endTime)
                    ->where('end_time', '>', $validated['start_time']);
            })
            ->exists();
        if ($isBooked) {
            return response()->json(['message' => 'This staff is already booked during this time slot.'], 422);
        }

        DB::transaction(function () use ($validated, $endTime) {

            $invoice = Invoices::create([
                'customer_id' => $validated['customer_id'],
                'staff_id' => $validated['staff_id'],
                'appointment_date' => $validated['appointment_date'],
                'start_time' => $validated['start_time'],
                'end_time' => $endTime,
                'note' => $validated['note'] ?? null,
                'status' => 'pending',
                'payment_id' => null,
            ]);
            foreach ($validated['services'] as $item) {
                $discount = $item['discount'] ?? 0;
                $service = Services::findOrFail($item['service_id']);
                $invoice->invoiceDetails()->create([
                    'service_id' => $service->id,
                    'discount' => $item['discount'] ?? 0,
                    'unit_price' => $service->price,
                    'subtotal' => $service->price * (1 - $discount / 100)
                ]);
            }
        });

        return response()->json([
            'message' => 'Appointment created successfully',
        ], 201);
    }

    private function findAvailableStaff(
        string $appointmentDate,
        string $startTime,
        string $endTime
    ) {
        $staffs = Staffs::where('status', 'active')->get();
        foreach ($staffs as $staff) {
            $isBooked = Invoices::where('staff_id', $staff->id)
                ->where('appointment_date', $appointmentDate)
                ->where(function ($query) use ($startTime, $endTime) {
                    $query->where('start_time', '<', $endTime)
                        ->where('end_time', '>', $startTime);
                })
                ->exists();
            if (!$isBooked) {
                return $staff;
            }
        }
        return null;
    }
    /**
     * Hàm này quản lí kho khi bán được dịch vụ
     */
    public function complete(Invoices $invoice)
    {
        DB::transaction(function () use ($invoice) {
            $invoice->update([
                'status' => 'completed'
            ]);
            $invoice->load(
                'invoiceDetails.service.serviceInventories'
            );
            foreach ($invoice->invoiceDetails as $detail) {
                foreach ($detail->service->serviceInventories as $serviceProduct) {
                    $product = $serviceProduct->product;
                    $usedQuantity = $serviceProduct->quantity_used;
                    $product->decrement(
                        'current_quantity',
                        $usedQuantity
                    );
                    Inventory_transactions::create([
                        'product_id' => $product->id,
                        'invoice_id' => $invoice->id,
                        'type' => 'export',
                        'quantity' => $usedQuantity,
                        'note' => 'Used for service completion'
                    ]);
                }
            }
        });

        return response()->json([
            'message' => 'Completed'
        ]);
    }
    public function show(Invoices $appointment)
    {
        $appointment->load([
            'staff',
            'customer',
            'invoiceDetails.service'
        ]);

        return response()->json($appointment);
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Invoices $invoices)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInvoicesRequest $request, Invoices $invoice)
    {
        $validated = $request->validated();
        $totalDuration = Services::whereIn(
            'id',
            collect($validated[$request->services])->pluck('service_id')
        )->sum('duration_minutes');
        $endTime = Carbon::parse($validated['start_time'])
            ->addMinutes($totalDuration)
            ->format('H:i:s');
        $isBooked = Invoices::where('staff_id', $validated['staff_id'])
            ->whereDate('appointment_date', $validated['appointment_date'])
            ->where('id', '!=', $invoice->id)
            ->where(function ($q) use ($validated,   $endTime) {
                $q->where('start_time', '<',   $endTime)
                    ->where('end_time', '>', $validated['start_time']);
            })
            ->exists();
        if ($isBooked) {
            return response()->json(['message' => 'This staff is already booked during this time slot.'], 422);
        }
        if (empty($validated['staff_id'])) {
            $randomStaff = $this->findAvailableStaff($validated['appointment_date'], $validated['start_time'], $endTime);
            if (!$randomStaff) {
                return response()->json([
                    'message' => 'No staff available'
                ], 422);
            }
            $validated['staff_id'] = $randomStaff->id;
        }
        DB::transaction(function () use ($validated, $invoice,  $endTime) {

            $invoice->update([
                'customer_id' => $validated['customer_id'],
                'staff_id' => $validated['staff_id'],
                'appointment_date' => $validated['appointment_date'],
                'start_time' => $validated['start_time'],
                'end_time' =>  $endTime,
                'note' => $validated['note'] ?? null,
                'status' => 'pending'
            ]);
            foreach ($validated['services'] as $item) {
                $service = Services::findOrFail($item['service_id']);
                $invoice->invoiceDetails()->where('service_id', $item['service_id'])->update([
                    'service_id' => $service->id,
                    'discount' => $item['discount'] ?? 0,
                    'unit_price' => $service->price,
                    'subtotal' => $service->price * (1 - ($item['discount'] ?? 0) / 100)
                ]);
            }
        });
        return response()->json([
            'message' => 'Appointment updated successfully',
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoices $invoice)
    {
        $invoice->delete();
        return response()->json([
            'message' => 'Deleted successfuly!'
        ]);
    }
}
