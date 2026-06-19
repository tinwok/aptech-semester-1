<?php

namespace App\Services;

use App\Models\Invoices;
use App\Models\Notifications;
use App\Models\Products;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    public function sendWelcomeNotification(User $user): void
    {
        $this->createNotificationOnce([
            'user_id' => $user->id,
            'title' => 'Welcome to ZenStyle',
            'message' => 'Your account has been created successfully. You can now book services and manage your appointments.',
            'url' => '/user',
            'type' => 'invoice_pending',
            'send_at' => now(),
            'is_read' => false,
        ]);
    }

    public function sendAppointmentBookedNotification(Invoices $invoice): void
    {
        $invoice->loadMissing(['customer.user', 'staff.users']);

        $customerUser = $invoice->customer?->user;
        $staffUser = $invoice->staff?->users;

        $customerName = $this->getUserDisplayName($customerUser, 'customer');
        $staffName = $this->getUserDisplayName($staffUser, 'your stylist');

        if ($customerUser) {
            $this->createNotificationOnce([
                'user_id' => $customerUser->id,
                'reference_id' => $invoice->id,
                'reference_type' => Invoices::class,
                'title' => 'Appointment Booked',
                'message' => "Your appointment with {$staffName} has been booked successfully.",
                'url' => '/user/appointments',
                'type' => 'appointment_reminder',
                'send_at' => now(),
                'is_read' => false,
            ]);
        }

        if ($staffUser) {
            $this->createNotificationOnce([
                'user_id' => $staffUser->id,
                'reference_id' => $invoice->id,
                'reference_type' => Invoices::class,
                'title' => 'New Appointment Assigned',
                'message' => "A new appointment with {$customerName} has been assigned to you.",
                'url' => '/staff/appointments',
                'type' => 'staff_schedule',
                'send_at' => now(),
                'is_read' => false,
            ]);
        }
    }

    public function sendAppointmentCancelledNotification(Invoices $invoice): void
    {
        $invoice->loadMissing(['customer.user', 'staff.users']);

        $customerUser = $invoice->customer?->user;
        $staffUser = $invoice->staff?->users;

        $customerName = $this->getUserDisplayName($customerUser, 'customer');
        $staffName = $this->getUserDisplayName($staffUser, 'your stylist');

        if ($customerUser) {
            $this->createNotificationOnce([
                'user_id' => $customerUser->id,
                'reference_id' => $invoice->id,
                'reference_type' => Invoices::class,
                'title' => 'Appointment Cancelled',
                'message' => "Your appointment with {$staffName} has been cancelled.",
                'url' => '/user/appointments',
                'type' => 'appointment_reminder',
                'send_at' => now(),
                'is_read' => false,
            ]);
        }

        if ($staffUser) {
            $this->createNotificationOnce([
                'user_id' => $staffUser->id,
                'reference_id' => $invoice->id,
                'reference_type' => Invoices::class,
                'title' => 'Appointment Cancelled',
                'message' => "An appointment with {$customerName} has been cancelled.",
                'url' => '/staff/appointments',
                'type' => 'staff_schedule',
                'send_at' => now(),
                'is_read' => false,
            ]);
        }
    }

    public function sendAppointmentReminders()
    {
        $now = Carbon::now();

        $invoices = Invoices::with(['customer.user', 'staff.users'])
            ->whereIn('status', ['pending', 'confirmed', 'rescheduled'])
            ->get();

        foreach ($invoices as $invoice) {
            $appointmentTime = Carbon::parse(
                $invoice->appointment_date . ' ' . $invoice->start_time
            );

            $diffMinutes = $now->diffInMinutes($appointmentTime, false);

            if ($diffMinutes === 1440) {
                $this->createAppointmentReminder($invoice, 24);
            }

            if ($diffMinutes === 120) {
                $this->createAppointmentReminder($invoice, 2);
            }
        }
    }

    private function createAppointmentReminder(Invoices $invoice, int $hoursBefore): void
    {
        $invoice->loadMissing(['customer.user', 'staff.users']);

        $customerUser = $invoice->customer?->user;
        $staffUser = $invoice->staff?->users;

        $customerName = $this->getUserDisplayName($customerUser, 'customer');
        $staffName = $this->getUserDisplayName($staffUser, 'your stylist');

        if ($customerUser) {
            $this->createNotificationOnce([
                'user_id' => $customerUser->id,
                'reference_id' => $invoice->id,
                'reference_type' => Invoices::class,
                'title' => 'Appointment Reminder',
                'message' => "Your appointment with {$staffName} is in {$hoursBefore} hours.",
                'url' => '/user/appointments',
                'type' => 'appointment_reminder',
                'send_at' => now(),
                'is_read' => false,
            ]);
        }

        if ($staffUser) {
            $this->createNotificationOnce([
                'user_id' => $staffUser->id,
                'reference_id' => $invoice->id,
                'reference_type' => Invoices::class,
                'title' => 'Staff Appointment Reminder',
                'message' => "Your appointment with {$customerName} is in {$hoursBefore} hours.",
                'url' => '/staff/appointments',
                'type' => 'staff_schedule',
                'send_at' => now(),
                'is_read' => false,
            ]);
        }
    }

    public function checkLowInventory()
    {
        $products = Products::all();

        foreach ($products as $product) {
            if ($product->current_quantity <= $product->minimum_stock) {
                $this->createNotificationOnce([
                    'user_id' => 1,
                    'title' => 'Low Stock Alert',
                    'message' => $product->name . ' is running low',
                    'url' => '/dashboard/inventory',
                    'type' => 'low_inventory',
                    'send_at' => now(),
                    'is_read' => false,
                ]);
            }
        }
    }

    public function checkPendingInvoices()
    {
        $invoices = Invoices::with(['customer.user', 'staff.users'])
            ->where('status', 'pending')
            ->get();

        foreach ($invoices as $invoice) {
            $customerUser = $invoice->customer?->user;
            $staffUser = $invoice->staff?->users;
            $staffName = $this->getUserDisplayName($staffUser, 'your stylist');

            if (!$customerUser) {
                continue;
            }

            $this->createNotificationOnce([
                'user_id' => $customerUser->id,
                'reference_id' => $invoice->id,
                'reference_type' => Invoices::class,
                'title' => 'Payment Pending',
                'message' => "Your invoice for the appointment with {$staffName} is still pending.",
                'url' => '/user/appointments',
                'type' => 'invoice_pending',
                'send_at' => now(),
                'is_read' => false,
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
                'message' => 'Scheduler is working',
                'type' => 'appointment_reminder',
                'send_at' => now(),
                'is_read' => false,
            ]);

            Log::info('Notification created');
        } catch (\Exception $e) {
            Log::error($e->getMessage());
        }
    }

    private function getUserDisplayName(?User $user, string $fallback): string
    {
        return $user?->name
            ?: $user?->phone
            ?: $user?->email
            ?: $fallback;
    }

    private function createNotificationOnce(array $data): void
    {
        $exists = Notifications::where('user_id', $data['user_id'])
            ->where('title', $data['title'])
            ->where('message', $data['message'])
            ->when(isset($data['reference_id']), function ($query) use ($data) {
                $query->where('reference_id', $data['reference_id']);
            })
            ->exists();

        if (!$exists) {
            Notifications::create($data);
        }
    }
}