<?php

namespace App\Http\Controllers;

use App\Models\Notifications;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationsController extends Controller
{
    public function index()
    {
        $notifications = Notifications::where('user_id', Auth::id())
            ->latest()
            ->get();

        return response()->json($notifications);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|in:appointment_reminder,staff_schedule,low_inventory,invoice_pending,shift_upcoming',
            'url' => 'nullable|string',
            'reference_id' => 'nullable|integer',
            'reference_type' => 'nullable|string',
            'send_at' => 'nullable|date',
        ]);

        $notification = Notifications::create([
            'user_id' => $validated['user_id'],
            'reference_id' => $validated['reference_id'] ?? null,
            'reference_type' => $validated['reference_type'] ?? null,
            'title' => $validated['title'],
            'message' => $validated['message'],
            'type' => $validated['type'],
            'url' => $validated['url'] ?? null,
            'send_at' => $validated['send_at'] ?? now(),
            'is_read' => false,
        ]);

        return response()->json([
            'message' => 'Notification created',
            'data' => $notification,
        ], 201);
    }

    public function show(Notifications $notification)
    {
        if ($notification->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        return response()->json($notification);
    }

    public function update(Request $request, Notifications $notification)
    {
        if ($notification->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $notification->update([
            'is_read' => true,
        ]);

        return response()->json([
            'message' => 'Marked as read',
            'data' => $notification,
        ]);
    }

    public function unreadCount()
    {
        $count = Notifications::where('user_id', Auth::id())
            ->where('is_read', false)
            ->count();

        return response()->json([
            'count' => $count,
        ]);
    }

    public function destroy(Notifications $notification)
    {
        if ($notification->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $notification->delete();

        return response()->json([
            'message' => 'Notification deleted',
        ]);
    }

    public function markAllRead()
    {
        Notifications::where('user_id', Auth::id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'message' => 'All notifications marked as read',
        ]);
    }

    public function markAsRead(Notifications $notification)
    {
        if ($notification->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $notification->update([
            'is_read' => true,
        ]);

        return response()->json([
            'message' => 'Notification marked as read',
        ]);
    }

    public function adminIndex()
    {
        $notifications = Notifications::with('user')
            ->latest()
            ->paginate(20);

        return response()->json($notifications);
    }

    public function adminShow(Notifications $notification)
    {
        return response()->json(
            $notification->load('user')
        );
    }

    public function adminDelete(Notifications $notification)
    {
        $notification->delete();

        return response()->json([
            'message' => 'Notification deleted',
        ]);
    }
}