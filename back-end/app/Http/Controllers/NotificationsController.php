<?php

namespace App\Http\Controllers;

use App\Models\Notifications;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationsController extends Controller
{
    /**
     * Danh sách notification của user login
     */
    public function index()
    {
        $notifications = Notifications::where('user_id', Auth::id())
            ->latest();

        return response()->json($notifications);
    }

    /**
     * Tạo notification (system/admin)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'required|string',
            'url' => 'nullable|string'
        ]);

        $notification = Notifications::create([
            'user_id' => $validated['user_id'],
            'title' => $validated['title'],
            'message' => $validated['message'],
            'type' => $validated['type'],
            'url' => $validated['url'] ?? null,
            'is_read' => false,
        ]);

        return response()->json([
            'message' => 'Notification created',
            'data' => $notification
        ], 201);
    }

    /**
     * Xem chi tiết notification
     */
    public function show(Notifications $notification)
    {
        return response()->json($notification);
    }

    /**
     * Đánh dấu đã đọc (MARK AS READ)
     */
    public function update(Request $request, Notifications $notification)
    {
        $notification->update([
            'is_read' => true
        ]);

        return response()->json([
            'message' => 'Marked as read',
            'data' => $notification
        ]);
    }
    // chưa đọc qua
    public function unreadCount()
    {
        $count = Notifications::where(
            'user_id',
            Auth::id()
        )
            ->where('is_read', false)
            ->count();

        return response()->json([
            'count' => $count
        ]);
    }
    /**
     * Xóa notification
     */
    public function destroy(Notifications $notification)
    {
        $notification->delete();

        return response()->json([
            'message' => 'Notification deleted'
        ]);
    }

    /**
     */
    public function markAllRead()
    {
        Notifications::where('user_id', Auth::id())
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'message' => 'All notifications marked as read'
        ]);
    }
    public function markAsRead(Notifications $notification)
    {
        if ($notification->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $notification->update([
            'is_read' => true
        ]);

        return response()->json([
            'message' => 'Notification marked as read'
        ]);
    }

    // Route cho admin
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
            'message' => 'Notification deleted'
        ]);
    }
}
