<?php

namespace Database\Seeders;

use App\Models\Invoices;
use App\Models\Notifications;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        Notifications::query()->delete();

        $this->createGeneralCustomerNotifications();
        $this->createAppointmentNotifications();
        $this->createStaffNotifications();
        $this->createAdminNotifications();
    }

    private function createGeneralCustomerNotifications(): void
    {
        $customers = User::where('role', 'customer')->get();

        foreach ($customers as $customer) {
            Notifications::create([
                'user_id' => $customer->id,
                'title' => 'Welcome to ZenStyle',
                'message' => 'Thank you for joining ZenStyle. You can book services, manage appointments, and update your preferences in your portal.',
                'url' => '/user',
                'type' => 'invoice_pending',
                'is_read' => true,
                'send_at' => now()->subDays(5),
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(5),
            ]);

            Notifications::create([
                'user_id' => $customer->id,
                'title' => 'New Service Promotion',
                'message' => 'Explore our recommended beauty services and seasonal offers this week.',
                'url' => '/user/promotions',
                'type' => 'invoice_pending',
                'is_read' => false,
                'send_at' => now()->subHours(6),
                'created_at' => now()->subHours(6),
                'updated_at' => now()->subHours(6),
            ]);
        }
    }

    private function createAppointmentNotifications(): void
    {
        $appointments = Invoices::with(['customer.user', 'staff.users'])
            ->whereIn('status', ['pending', 'confirmed', 'rescheduled'])
            ->get();

        foreach ($appointments as $appointment) {
            $customerUser = $appointment->customer?->user;

            if ($customerUser) {
                Notifications::create([
                    'user_id' => $customerUser->id,
                    'reference_id' => $appointment->id,
                    'reference_type' => Invoices::class,
                    'title' => $appointment->status === 'confirmed'
                        ? 'Appointment Confirmed'
                        : 'Appointment Pending',
                    'message' => 'Your appointment is scheduled on ' . $appointment->appointment_date . ' from ' . $appointment->start_time . ' to ' . $appointment->end_time . '.',
                    'url' => '/user/appointments',
                    'type' => 'appointment_reminder',
                    'is_read' => false,
                    'send_at' => now()->subMinutes(30),
                    'created_at' => now()->subMinutes(30),
                    'updated_at' => now()->subMinutes(30),
                ]);
            }

            $staffUser = $appointment->staff?->users;

            if ($staffUser) {
                Notifications::create([
                    'user_id' => $staffUser->id,
                    'reference_id' => $appointment->id,
                    'reference_type' => Invoices::class,
                    'title' => 'Appointment Assigned',
                    'message' => 'You have been assigned an appointment on ' . $appointment->appointment_date . ' from ' . $appointment->start_time . ' to ' . $appointment->end_time . '.',
                    'url' => '/staff/appointments',
                    'type' => 'staff_schedule',
                    'is_read' => false,
                    'send_at' => now()->subMinutes(20),
                    'created_at' => now()->subMinutes(20),
                    'updated_at' => now()->subMinutes(20),
                ]);
            }
        }
    }

    private function createStaffNotifications(): void
    {
        $staffUsers = User::where('role', 'staff')->get();

        foreach ($staffUsers as $staffUser) {
            Notifications::create([
                'user_id' => $staffUser->id,
                'title' => 'Shift Reminder',
                'message' => 'Please check your assigned appointments and shift schedule for today.',
                'url' => '/staff/appointments',
                'type' => 'shift_upcoming',
                'is_read' => true,
                'send_at' => now()->subHours(2),
                'created_at' => now()->subHours(2),
                'updated_at' => now()->subHours(2),
            ]);
        }
    }

    private function createAdminNotifications(): void
    {
        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            Notifications::create([
                'user_id' => $admin->id,
                'title' => 'Dashboard Update',
                'message' => 'There are new appointments and customer activities to review.',
                'url' => '/dashboard',
                'type' => 'invoice_pending',
                'is_read' => false,
                'send_at' => now()->subHours(1),
                'created_at' => now()->subHours(1),
                'updated_at' => now()->subHours(1),
            ]);
        }
    }
}