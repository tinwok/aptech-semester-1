<?php

namespace App\Services;

use App\Models\Invoices;
use App\Models\Notifications;
use Carbon\Carbon;

class NotificationService
{
    public function sendAppointmentReminders(): void
    {
        $now = now();

        $this->sendReminderForWindow(
            now: $now,
            targetTime: $now->copy()->addHours(24),
            type: 'appointment_reminder_24h',
            title: 'Appointment Reminder',
            label: '24 hours'
        );

        $this->sendReminderForWindow(
            now: $now,
            targetTime: $now->copy()->addHours(2),
            type: 'appointment_reminder_2h',
            title: 'Appointment Reminder',
            label: '2 hours'
        );
    }

    private function sendReminderForWindow(
        Carbon $now,
        Carbon $targetTime,
        string $type,
        string $title,
        string $label
    ): void {
        $windowStart = $targetTime->copy()->subMinute();
        $windowEnd = $targetTime->copy()->addMinute();

        $appointments = Invoices::query()
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($query) use ($windowStart, $windowEnd) {
                $query->whereRaw(
                    "TIMESTAMP(appointment_date, start_time) BETWEEN ? AND ?",
                    [
                        $windowStart->format('Y-m-d H:i:s'),
                        $windowEnd->format('Y-m-d H:i:s'),
                    ]
                );
            })
            ->with([
                'customer.user',
                'staff.users',
            ])
            ->get();

        foreach ($appointments as $appointment) {
            $appointmentDateTime = Carbon::parse(
                $appointment->appointment_date . ' ' . $appointment->start_time
            );

            $staffName = $appointment->staff?->users?->name ?? 'staff member';
            $customerName = $appointment->customer?->user?->name ?? 'Customer';

            $timeText = $appointmentDateTime->format('Y-m-d \a\t H:i');

            $this->createReminderNotification(
                userId: $appointment->customer?->user?->id,
                appointmentId: $appointment->id,
                type: $type,
                title: $title,
                message: 'Your appointment with ' . $staffName . ' will start in ' . $label . ', on ' . $timeText . '.',
                url: '/user/appointments',
                sendAt: $now
            );

            $this->createReminderNotification(
                userId: $appointment->staff?->users?->id,
                appointmentId: $appointment->id,
                type: $type,
                title: $title,
                message: 'Your appointment with ' . $customerName . ' will start in ' . $label . ', on ' . $timeText . '.',
                url: '/staff/appointments',
                sendAt: $now
            );
        }
    }

    private function createReminderNotification(
        ?int $userId,
        int $appointmentId,
        string $type,
        string $title,
        string $message,
        string $url,
        Carbon $sendAt
    ): void {
        if (!$userId) {
            return;
        }

        $alreadySent = Notifications::query()
            ->where('user_id', $userId)
            ->where('reference_id', $appointmentId)
            ->where('reference_type', Invoices::class)
            ->where('type', $type)
            ->exists();

        if ($alreadySent) {
            return;
        }

        Notifications::create([
            'user_id' => $userId,
            'reference_id' => $appointmentId,
            'reference_type' => Invoices::class,
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'url' => $url,
            'is_read' => false,
            'send_at' => $sendAt,
        ]);
    }

    public function checkLowInventory(): void
    {
        //
    }
}