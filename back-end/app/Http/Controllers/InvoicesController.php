<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoicesRequest;
use App\Models\Inventory_transactions;
use App\Models\Invoices;
use App\Models\Notifications;
use App\Models\Payments;
use App\Models\Services;
use App\Models\Staffs;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InvoicesController extends Controller
{
    private function isFutureAppointment($appointment): bool
    {
        $appointmentDateTime = Carbon::parse(
            $appointment->appointment_date . ' ' . $appointment->start_time
        );

        return $appointmentDateTime->gt(now());
    }

    private function upcomingQuery()
    {
        return Invoices::query()
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($query) {
                $query->whereDate('appointment_date', '>', today())
                    ->orWhere(function ($query) {
                        $query->whereDate('appointment_date', today())
                            ->whereTime('start_time', '>', now()->format('H:i:s'));
                    });
            });
    }

    private function createNotification(
        ?int $userId,
        string $title,
        string $message,
        string $type,
        ?string $url = null
    ): void {
        if (!$userId) {
            return;
        }

        Notifications::create([
            'user_id' => $userId,
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'url' => $url,
            'is_read' => false,
        ]);
    }

    private function getAppointmentText(Invoices $invoice): string
    {
        return $invoice->appointment_date . ' at ' . substr($invoice->start_time, 0, 5);
    }

    private function getCustomerName(Invoices $invoice): string
    {
        return $invoice->customer?->user?->name ?? 'Customer';
    }

    private function getStaffName(Invoices $invoice): string
    {
        return $invoice->staff?->users?->name ?? 'staff member';
    }

    private function loadInvoiceDetail(Invoices $invoice): Invoices
    {
        return $invoice->load([
            'customer.user',
            'staff.users',
            'invoiceDetails.service',
            'payment',
            'feedbacks',
        ]);
    }

    public function getCustomerAppointments(Request $request)
    {
        $customer = $request->user()->customer;

        if (!$customer) {
            return response()->json([], 200);
        }

        $appointments = $this->upcomingQuery()
            ->where('customer_id', $customer->id)
            ->with(['staff.users', 'invoiceDetails.service', 'payment'])
            ->orderBy('appointment_date')
            ->orderBy('start_time')
            ->get();

        return response()->json($appointments, 200);
    }

    public function getStaffAppointments(Request $request)
    {
        $staff = $request->user()->staff;

        if (!$staff) {
            return response()->json([], 200);
        }

        $appointments = $this->upcomingQuery()
            ->where('staff_id', $staff->id)
            ->with(['customer.user', 'invoiceDetails.service', 'payment'])
            ->orderBy('appointment_date')
            ->orderBy('start_time')
            ->get();

        return response()->json($appointments, 200);
    }

    public function getAppointmentsHistory(Request $request)
    {
        $user = $request->user();

        $query = Invoices::query()
            ->where('status', 'completed')
            ->with([
                'customer.user',
                'staff.users',
                'invoiceDetails.service',
                'feedbacks',
                'payment',
            ])
            ->latest();

        if ($user->role === 'customer') {
            $customer = $user->customer;

            if (!$customer) {
                return response()->json([], 200);
            }

            $query->where('customer_id', $customer->id);
        }

        if ($user->role === 'staff') {
            $staff = $user->staff;

            if (!$staff) {
                return response()->json([], 200);
            }

            $query->where('staff_id', $staff->id);
        }

        return response()->json($query->get(), 200);
    }

    public function getMyPaidInvoices(Request $request)
    {
        $customer = $request->user()->customer;

        if (!$customer) {
            return response()->json([], 200);
        }

        $invoices = Invoices::query()
            ->where('customer_id', $customer->id)
            ->where('status', 'completed')
            ->whereHas('payment', function ($query) {
                $query->where('payment_status', 'paid');
            })
            ->with([
                'staff.users',
                'customer.user',
                'invoiceDetails.service',
                'payment',
            ])
            ->latest()
            ->get();

        return response()->json($invoices, 200);
    }

    public function getMyPaidInvoiceDetail(Request $request, Invoices $invoice)
    {
        $customer = $request->user()->customer;

        if (!$customer || $invoice->customer_id !== $customer->id) {
            return response()->json([
                'message' => 'Invoice not found.',
            ], 404);
        }

        $invoice = $this->loadInvoiceDetail($invoice);

        if ($invoice->status !== 'completed' || $invoice->payment?->payment_status !== 'paid') {
            return response()->json([
                'message' => 'This invoice is only available after payment.',
            ], 403);
        }

        return response()->json($invoice, 200);
    }

    public function getAvailableTimeOfStaff(Request $request)
    {
        $totalDuration = Services::whereIn(
            'id',
            collect($request->services)->pluck('service_id')
        )->sum('duration_minutes');

        $start = Carbon::parse('08:00');
        $end = Carbon::parse('20:00');

        $availableSlots = [];

        if ($request->staff_id) {
            $appointments = Invoices::where('staff_id', $request->staff_id)
                ->whereDate('appointment_date', $request->appointment_date)
                ->whereIn('status', ['pending', 'confirmed'])
                ->get();
        } else {
            $appointments = Invoices::whereDate(
                'appointment_date',
                $request->appointment_date
            )
                ->whereIn('status', ['pending', 'confirmed'])
                ->get();

            $totalStaffs = Staffs::where('status', 'active')->count();
        }

        while ($start < $end) {
            $slotStart = $start->format('H:i:s');

            $slotEnd = Carbon::parse($slotStart)
                ->addMinutes((int) $totalDuration)
                ->format('H:i:s');

            if (Carbon::parse($slotEnd)->gt($end)) {
                break;
            }

            $slotDateTime = Carbon::parse($request->appointment_date . ' ' . $slotStart);

            if ($slotDateTime->lte(now())) {
                $availableSlots[] = [
                    'time' => $slotStart,
                    'available' => false,
                ];

                $start->addMinutes(20);
                continue;
            }

            if ($request->staff_id) {
                $isBooked = $appointments->contains(
                    function ($appointment) use ($slotStart, $slotEnd) {
                        return $slotStart < $appointment->end_time
                            && $slotEnd > $appointment->start_time;
                    }
                );

                $available = !$isBooked;
            } else {
                $busyStaffs = $appointments
                    ->filter(function ($appointment) use ($slotStart, $slotEnd) {
                        return $slotStart < $appointment->end_time
                            && $slotEnd > $appointment->start_time;
                    })
                    ->pluck('staff_id')
                    ->unique()
                    ->count();

                $available = $busyStaffs < $totalStaffs;
            }

            $availableSlots[] = [
                'time' => $slotStart,
                'available' => $available,
            ];

            $start->addMinutes(20);
        }

        return response()->json([
            'staff_id' => $request->staff_id,
            'slots' => $availableSlots,
        ]);
    }

    public function index()
    {
        $appointments = Invoices::with([
            'staff.users',
            'customer.user',
            'invoiceDetails.service',
            'payment',
        ])
            ->latest()
            ->paginate(10);

        return response()->json($appointments, 200);
    }

    public function create()
    {
        //
    }

    public function store(StoreInvoiceRequest $request)
    {
        $validated = $request->validated();

        $appointmentDateTime = Carbon::parse(
            $validated['appointment_date'] . ' ' . $validated['start_time']
        );

        if ($appointmentDateTime->lte(now())) {
            return response()->json([
                'message' => 'You cannot book an appointment in the past.',
            ], 422);
        }

        $totalDuration = Services::whereIn(
            'id',
            collect($validated['services'])->pluck('service_id')
        )->sum('duration_minutes');

        $endTime = Carbon::parse($validated['start_time'])
            ->addMinutes((int) $totalDuration)
            ->format('H:i:s');

        if (empty($validated['staff_id'])) {
            $randomStaff = $this->findAvailableStaff(
                $validated['appointment_date'],
                $validated['start_time'],
                $endTime
            );

            if (!$randomStaff) {
                return response()->json([
                    'message' => 'No staff available',
                ], 422);
            }

            $validated['staff_id'] = $randomStaff->id;
        }

        $isBooked = Invoices::where('staff_id', $validated['staff_id'])
            ->where('appointment_date', $validated['appointment_date'])
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($query) use ($validated, $endTime) {
                $query->where('start_time', '<', $endTime)
                    ->where('end_time', '>', $validated['start_time']);
            })
            ->exists();

        if ($isBooked) {
            return response()->json([
                'message' => 'This staff is already booked during this time slot.',
            ], 422);
        }

        DB::transaction(function () use ($validated, $endTime) {
            $totalAmount = 0;

            foreach ($validated['services'] as $item) {
                $discount = $item['discount'] ?? 0;
                $service = Services::findOrFail($item['service_id']);
                $totalAmount += $service->price * (1 - $discount / 100);
            }

            $payment = Payments::create([
                'total_amount' => $totalAmount,
                'payment_method' => 'cash',
                'payment_status' => 'pending',
            ]);

            $invoice = Invoices::create([
                'customer_id' => $validated['customer_id'],
                'staff_id' => $validated['staff_id'],
                'payment_id' => $payment->id,
                'appointment_date' => $validated['appointment_date'],
                'start_time' => $validated['start_time'],
                'end_time' => $endTime,
                'note' => $validated['note'] ?? null,
                'status' => 'pending',
            ]);

            foreach ($validated['services'] as $item) {
                $discount = $item['discount'] ?? 0;
                $service = Services::findOrFail($item['service_id']);

                $invoice->invoiceDetails()->create([
                    'service_id' => $service->id,
                    'discount' => $discount,
                    'unit_price' => $service->price,
                    'subtotal' => $service->price * (1 - $discount / 100),
                ]);
            }

            $invoice->load([
                'customer.user',
                'staff.users',
            ]);

            $customerName = $this->getCustomerName($invoice);
            $staffName = $this->getStaffName($invoice);
            $appointmentText = $this->getAppointmentText($invoice);

            $this->createNotification(
                $invoice->customer?->user?->id,
                'Appointment Booked',
                'Your appointment with ' . $staffName . ' has been booked for ' . $appointmentText . '.',
                'booking',
                '/user/appointments'
            );

            $this->createNotification(
                $invoice->staff?->users?->id,
                'New Appointment',
                $customerName . ' booked an appointment with you for ' . $appointmentText . '.',
                'booking',
                '/staff/appointments'
            );
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
                ->whereIn('status', ['pending', 'confirmed'])
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

    public function complete(string $id)
    {
        $invoice = Invoices::findOrFail($id);

        DB::transaction(function () use ($invoice) {
            $this->completeInvoice($invoice, 'Appointment Completed', 'Service Completed');
        });

        return response()->json([
            'message' => 'Completed',
        ]);
    }

    public function pay(Request $request, Invoices $appointment)
    {
        $customer = $request->user()->customer;

        if (!$customer || $appointment->customer_id !== $customer->id) {
            return response()->json([
                'message' => 'Appointment not found.',
            ], 404);
        }

        if ($appointment->status === 'cancel') {
            return response()->json([
                'message' => 'Canceled appointments cannot be paid.',
            ], 422);
        }

        DB::transaction(function () use ($appointment) {
            $appointment->load(['payment']);

            if ($appointment->payment) {
                $appointment->payment->update([
                    'payment_method' => 'qr',
                    'payment_status' => 'paid',
                ]);
            }

            $this->completeInvoice($appointment, 'Payment Successful', 'Customer Payment Completed');
        });

        return response()->json([
            'message' => 'Payment successful. Appointment completed.',
        ]);
    }

    private function completeInvoice(
        Invoices $invoice,
        string $customerTitle,
        string $staffTitle
    ): void {
        $invoice->update([
            'status' => 'completed',
        ]);

        $invoice->load([
            'customer.user',
            'staff.users',
            'payment',
            'invoiceDetails.service.serviceInventories',
        ]);

        foreach ($invoice->invoiceDetails as $detail) {
            if (!$detail->service || !$detail->service->serviceInventories) {
                continue;
            }

            foreach ($detail->service->serviceInventories as $serviceProduct) {
                $product = $serviceProduct->product;

                if (!$product) {
                    continue;
                }

                $usedQuantity = $serviceProduct->quantity_used;

                $product->decrement('current_quantity', $usedQuantity);

                Inventory_transactions::create([
                    'product_id' => $product->id,
                    'invoice_id' => $invoice->id,
                    'type' => 'export',
                    'quantity' => $usedQuantity,
                    'note' => 'Used for service completion',
                ]);
            }
        }

        $customerName = $this->getCustomerName($invoice);
        $staffName = $this->getStaffName($invoice);
        $appointmentText = $this->getAppointmentText($invoice);

        $this->createNotification(
            $invoice->customer?->user?->id,
            $customerTitle,
            'Your appointment with ' . $staffName . ' on ' . $appointmentText . ' has been completed.',
            'completed',
            '/user/service-history'
        );

        $this->createNotification(
            $invoice->staff?->users?->id,
            $staffTitle,
            'Your appointment with ' . $customerName . ' on ' . $appointmentText . ' has been marked as completed.',
            'completed',
            '/staff/service-history'
        );
    }

    public function show(Invoices $appointment)
    {
        $appointment->load([
            'staff.users',
            'customer.user',
            'invoiceDetails.service',
            'payment',
        ]);

        return response()->json($appointment);
    }

    public function edit(Invoices $invoices)
    {
        //
    }

    public function update(UpdateInvoicesRequest $request, Invoices $invoice)
    {
        $validated = $request->validated();

        $appointmentDateTime = Carbon::parse(
            $validated['appointment_date'] . ' ' . $validated['start_time']
        );

        if ($appointmentDateTime->lte(now())) {
            return response()->json([
                'message' => 'You cannot update an appointment to a past time.',
            ], 422);
        }

        $totalDuration = Services::whereIn(
            'id',
            collect($validated['services'])->pluck('service_id')
        )->sum('duration_minutes');

        $endTime = Carbon::parse($validated['start_time'])
            ->addMinutes($totalDuration)
            ->format('H:i:s');

        $isBooked = Invoices::where('staff_id', $validated['staff_id'])
            ->whereDate('appointment_date', $validated['appointment_date'])
            ->where('id', '!=', $invoice->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($q) use ($validated, $endTime) {
                $q->where('start_time', '<', $endTime)
                    ->where('end_time', '>', $validated['start_time']);
            })
            ->exists();

        if ($isBooked) {
            return response()->json([
                'message' => 'This staff is already booked during this time slot.',
            ], 422);
        }

        if (empty($validated['staff_id'])) {
            $randomStaff = $this->findAvailableStaff(
                $validated['appointment_date'],
                $validated['start_time'],
                $endTime
            );

            if (!$randomStaff) {
                return response()->json([
                    'message' => 'No staff available',
                ], 422);
            }

            $validated['staff_id'] = $randomStaff->id;
        }

        DB::transaction(function () use ($validated, $invoice, $endTime) {
            $invoice->update([
                'customer_id' => $validated['customer_id'],
                'staff_id' => $validated['staff_id'],
                'payment_id' => $validated['payment_id'] ?? $invoice->payment_id,
                'appointment_date' => $validated['appointment_date'],
                'start_time' => $validated['start_time'],
                'end_time' => $endTime,
                'note' => $validated['note'] ?? null,
                'status' => 'pending',
            ]);

            foreach ($validated['services'] as $item) {
                $discount = $item['discount'] ?? 0;
                $service = Services::findOrFail($item['service_id']);

                $invoice->invoiceDetails()
                    ->where('service_id', $item['service_id'])
                    ->update([
                        'service_id' => $service->id,
                        'discount' => $discount,
                        'unit_price' => $service->price,
                        'subtotal' => $service->price * (1 - $discount / 100),
                    ]);
            }
        });

        return response()->json([
            'message' => 'Appointment updated successfully',
        ], 200);
    }

    public function destroy(Invoices $appointment)
    {
        if ($appointment->status === 'completed') {
            return response()->json([
                'message' => 'Completed appointments cannot be canceled.',
            ], 422);
        }

        if ($appointment->status === 'cancel') {
            return response()->json([
                'message' => 'This appointment has already been canceled.',
            ], 422);
        }

        if (!$this->isFutureAppointment($appointment)) {
            return response()->json([
                'message' => 'Past appointments cannot be canceled.',
            ], 422);
        }

        $appointment->update([
            'status' => 'cancel',
        ]);

        $appointment->load([
            'customer.user',
            'staff.users',
        ]);

        $customerName = $this->getCustomerName($appointment);
        $staffName = $this->getStaffName($appointment);
        $appointmentText = $this->getAppointmentText($appointment);

        $this->createNotification(
            $appointment->customer?->user?->id,
            'Appointment Canceled',
            'Your appointment with ' . $staffName . ' on ' . $appointmentText . ' has been canceled.',
            'cancel',
            '/user/appointments'
        );

        $this->createNotification(
            $appointment->staff?->users?->id,
            'Appointment Canceled',
            'Your appointment with ' . $customerName . ' on ' . $appointmentText . ' has been canceled.',
            'cancel',
            '/staff/appointments'
        );

        return response()->json([
            'message' => 'Cancel successfully!',
        ]);
    }
}