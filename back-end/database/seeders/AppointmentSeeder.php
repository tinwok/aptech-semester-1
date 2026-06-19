<?php

namespace Database\Seeders;

use App\Models\Customers;
use App\Models\Invoice_details;
use App\Models\Invoices;
use App\Models\Payments;
use App\Models\Services;
use App\Models\Staffs;
use Illuminate\Database\Seeder;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        Invoice_details::query()->delete();
        Invoices::query()->delete();
        Payments::query()->delete();

        $customers = Customers::with('user')->where('status', 'active')->get();
        $staffs = Staffs::with('users')->where('status', 'active')->get();
        $services = Services::where('status', 'active')->get();

        if ($customers->isEmpty() || $staffs->isEmpty() || $services->isEmpty()) {
            return;
        }

        foreach ($customers as $index => $customer) {
            $staff = $staffs[$index % $staffs->count()];

            $upcomingPayment = Payments::create([
                'total_amount' => 0,
                'payment_method' => 'cash',
                'payment_status' => 'pending',
            ]);

            $upcoming = Invoices::create([
                'customer_id' => $customer->id,
                'staff_id' => $staff->id,
                
                'appointment_date' => now()->addDays($index + 1)->toDateString(),
                'start_time' => '09:00:00',
                'end_time' => '10:00:00',
                'status' => $index % 2 === 0 ? 'confirmed' : 'pending',
                'note' => 'Customer prefers careful consultation before service.',
            ]);

            $upcomingTotal = $this->attachServices($upcoming, $services->take(2));

            $upcomingPayment->update([
                'total_amount' => $upcomingTotal,
            ]);

            $historyPayment = Payments::create([
                'total_amount' => 0,
                'payment_method' => 'cash',
                'payment_status' => 'paid',
            ]);

            $history = Invoices::create([
                'customer_id' => $customer->id,
                'staff_id' => $staff->id,
                
                'appointment_date' => now()->subDays($index + 3)->toDateString(),
                'start_time' => '14:00:00',
                'end_time' => '15:30:00',
                'status' => 'completed',
                'note' => 'Service completed successfully.',
            ]);

            $historyTotal = $this->attachServices($history, $services->skip(2)->take(2));

            $historyPayment->update([
                'total_amount' => $historyTotal,
            ]);
        }
    }

    private function attachServices(Invoices $invoice, $services): float
    {
        $total = 0;

        foreach ($services as $service) {
            $discount = 0;
            $unitPrice = $service->price ?? 0;
            $subtotal = $unitPrice * (1 - $discount / 100);

            Invoice_details::create([
                'invoice_id' => $invoice->id,
                'service_id' => $service->id,
                'unit_price' => $unitPrice,
                'discount' => $discount,
                'subtotal' => $subtotal,
            ]);

            $total += $subtotal;
        }

        return $total;
    }
}