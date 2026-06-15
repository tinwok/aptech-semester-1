<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomersController;
use App\Http\Controllers\FeedBackController;
use App\Http\Controllers\InventoryTransactionController;
use App\Http\Controllers\InvoicesController;
use App\Http\Controllers\NotificationsController;

use App\Http\Controllers\ProductsController;
use App\Http\Controllers\ServicesController;
use App\Http\Controllers\StaffsController;

use App\Http\Controllers\StatsController;
use App\Http\Controllers\SuppliersController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// không cần đăng nhập
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
// Route::get('services', [ServicesController::class, 'index']);
Route::get('services/{service}', [ServicesController::class, 'show']);
Route::apiResource('/products', ProductsController::class);
// quản lí kho
Route::post('inventory/import', [InventoryTransactionController::class, 'importStock']);
Route::post('inventory/wastage', [InventoryTransactionController::class, 'wastage']);
Route::post('invoice/{id}/complete', [InvoicesController::class, 'complete']);
// Quản lí nhà cung cấp
Route::apiResource('/suppliers', SuppliersController::class);
Route::get('staffs', [StaffsController::class, 'index']);
Route::apiResource('services', ServicesController::class);

// cần phải đăng nhập và gửi gửi request kèm token mới sử dụng được route này
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/me/profile', [AuthController::class, 'updateProfile']);
    //  /me/profile sửa thêm trong cùng 1 route chỉ cần gọi post
    Route::post('/me/change-password', [AuthController::class, 'changePassword']);
    Route::post('/me/logout', [AuthController::class, 'logout']);
    Route::delete('me/delete', [AuthController::class, 'destroy']);
    // notifications
    Route::get(
        '/notifications',
        [NotificationsController::class, 'index']
    );
    Route::get(
        '/notifications/unread-count',
        [NotificationsController::class, 'unreadCount']
    );
    Route::put(
        '/notifications/{notification}/read',
        [NotificationsController::class, 'markAsRead']
    );
    Route::put(
        '/notifications/read-all',
        [NotificationsController::class, 'markAllRead']
    );

    Route::middleware('role:staff')->group(function () {
        Route::get('/staff/appointments', [InvoicesController::class, 'getStaffAppointments']);
        Route::get('/staff/appointments/history', [InvoicesController::class, 'getAppointmentsHistory']);
    });

    Route::middleware('role:customer')->group(function () {
        Route::get('/me/appointments', [InvoicesController::class, 'getCustomerAppointments']);
        Route::get('/me/appointments/history', [InvoicesController::class, 'getAppointmentsHistory']);
        Route::get('/appointments/{appointment}', [InvoicesController::class, 'show']);
        Route::post('/available-times', [InvoicesController::class, 'getAvailableTimeOfStaff']);
        Route::get('/book', [InvoicesController::class, 'store']);
        Route::put('/appointments/{invoice}
        ', [InvoicesController::class, 'update']);
        Route::post('/appointments/book', [InvoicesController::class, 'store']);
        Route::apiResource('feedbacks', FeedBackController::class);
    });
});
// middleware(['auth:sanctum', 'role:admin'])->
// Can phai la admin
Route::prefix('dashboard')->group(function () {
    // Stats
    Route::get('/stats/salereport', [StatsController::class, 'salesReport']);
    Route::get('/stats/inventoryReport', [StatsController::class, 'inventoryReport']);
    Route::get('/stats/report', [StatsController::class, 'salesReport']);

    Route::apiResource('/customers', CustomersController::class);
    Route::apiResource('/staffs', StaffsController::class);
    Route::apiResource('users', UserController::class);
    Route::patch('users/{id}/restore', [UserController::class, 'restore']);
    Route::apiResource('services', ServicesController::class);
    Route::apiResource('/appointments', InvoicesController::class);
    Route::apiResource('/notification', NotificationsController::class);
    // Route notification for admin
    Route::get('/notifications', [NotificationsController::class, 'adminIndex']);
    Route::get('/notifications/{notification}', [NotificationsController::class, 'adminShow']);
    Route::delete('/notifications/{notification}', [NotificationsController::class, 'adminDelete']);
});
