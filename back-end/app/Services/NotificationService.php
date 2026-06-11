<?php

namespace App\Services;

use App\Models\Notifications;
use App\Models\Invoices;
use App\Models\Products;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    public function sendAppointmentReminders()
    {
        $now = Carbon::now();

        $invoices = Invoices::where('status', 'confirmed')->get();

        foreach ($invoices as $invoice) {

            $appointmentTime = Carbon::parse(
                $invoice->appointment_date . ' ' . $invoice->start_time
            );

            $diffHours = $now->diffInHours($appointmentTime, false);
            if ($diffHours == 24 || $diffHours == 2) {
                Notifications::create([
                    'user_id' => $invoice->customer_id,
                    'title' => 'Appointment Reminder',
                    'message' => "Bạn có lịch hẹn sau {$diffHours} giờ",
                    'type' => 'appointment_reminder'
                ]);
            }
        }
    }

    public function checkLowInventory()
    {
        $products = Products::all();
        foreach ($products as $product) {
            if ($product->current_quantity <= $product->minimum_stock) {
                Notifications::create([
                    'user_id' => 1,
                    'title' => 'Low Stock Alert',
                    'message' => $product->name . ' is running low',
                    'type' => 'low_inventory'
                ]);
            }
        }
    }

    public function checkPendingInvoices()
    {
        $invoices = Invoices::where('status', 'pending')->get();
        foreach ($invoices as $invoice) {
            Notifications::create([
                'user_id' => $invoice->customer_id,
                'title' => 'Payment Pending',
                'message' => 'Bạn chưa thanh toán hóa đơn',
                'type' => 'invoice_pending'
            ]);
        }
    }
    public function testNotification()
    {
        try {
            Log::info('Scheduler is running: ' . now());
            Notifications::create([
                'user_id' => 1,
                'title' => 'Test Notification',
                'message' => 'Scheduler hoạt động',
                'type' => 'appointment_reminder'
            ]);
            Log::info('Notification created');
        } catch (\Exception $e) {
            Log::error($e->getMessage());
        }
    }
}
