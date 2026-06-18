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
use App\Models\Customers;
use App\Models\Staffs;
use Illuminate\Support\Facades\Route;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::get('services/{service}', [ServicesController::class, 'show']);
Route::apiResource('/products', ProductsController::class);

Route::post('inventory/import', [InventoryTransactionController::class, 'importStock']);
Route::post('inventory/wastage', [InventoryTransactionController::class, 'wastage']);

Route::apiResource('/suppliers', SuppliersController::class);

Route::get('staffs', [StaffsController::class, 'index']);
Route::apiResource('services', ServicesController::class);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/me/profile', [AuthController::class, 'updateProfile']);
    Route::post('/me/change-password', [AuthController::class, 'changePassword']);
    Route::post('/me/logout', [AuthController::class, 'logout']);
    Route::delete('me/delete', [AuthController::class, 'destroy']);

    Route::get('/notifications', [NotificationsController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationsController::class, 'unreadCount']);
    Route::put('/notifications/{notification}/read', [NotificationsController::class, 'markAsRead']);
    Route::put('/notifications/read-all', [NotificationsController::class, 'markAllRead']);
    Route::delete('/notifications/{notification}', [NotificationsController::class, 'destroy']);

    Route::middleware('role:staff')->group(function () {
        Route::get('/staff/appointments', [InvoicesController::class, 'getStaffAppointments']);
        Route::get('/staff/appointments/history', [InvoicesController::class, 'getAppointmentsHistory']);
    });

    Route::middleware('role:customer')->group(function () {
        Route::get('/me/appointments', [InvoicesController::class, 'getCustomerAppointments']);
        Route::get('/me/appointments/history', [InvoicesController::class, 'getAppointmentsHistory']);

        Route::get('/me/invoices', [InvoicesController::class, 'getMyPaidInvoices']);
        Route::get('/me/invoices/{invoice}', [InvoicesController::class, 'getMyPaidInvoiceDetail']);

        Route::get('/appointments/{appointment}', [InvoicesController::class, 'show']);
        Route::put('/appointments/{invoice}', [InvoicesController::class, 'update']);
        Route::delete('/appointments/{appointment}', [InvoicesController::class, 'destroy']);
        Route::post('/appointments/{appointment}/pay', [InvoicesController::class, 'pay']);

        Route::post('/available-times', [InvoicesController::class, 'getAvailableTimeOfStaff']);
        Route::post('/book', [InvoicesController::class, 'store']);
        Route::post('/appointments/book', [InvoicesController::class, 'store']);

        Route::apiResource('feedbacks', FeedBackController::class);
    });
});

Route::prefix('dashboard')->group(function () {
    Route::get('/stats/salereport', [StatsController::class, 'salesReport']);
    Route::get('/stats/inventoryReport', [StatsController::class, 'inventoryReport']);
    Route::get('/stats/report', [StatsController::class, 'salesReport']);

    Route::get('/customer-preferences', function () {
        $staffs = Staffs::with('users')->get()->keyBy('id');

        $customers = Customers::with('user')
            ->latest()
            ->get()
            ->map(function ($customer) use ($staffs) {
                $preferredStaff = $customer->preferred_staff_id
                    ? $staffs->get($customer->preferred_staff_id)
                    : null;

                return [
                    'id' => $customer->id,
                    'status' => $customer->status,
                    'preferences' => $customer->preferences,
                    'allergies' => $customer->allergies,
                    'preferred_staff_id' => $customer->preferred_staff_id,
                    'preferred_staff_name' => $preferredStaff?->users?->name,
                    'user' => $customer->user,
                ];
            });

        return response()->json($customers);
    });

    Route::apiResource('/feedbacks', FeedBackController::class);
    Route::apiResource('/customers', CustomersController::class);
    Route::apiResource('/staffs', StaffsController::class);
    Route::apiResource('users', UserController::class);
    Route::patch('users/{id}/restore', [UserController::class, 'restore']);

    Route::apiResource('services', ServicesController::class);

    Route::apiResource('/appointments', InvoicesController::class);
    Route::post('appointments/{id}/complete', [InvoicesController::class, 'complete']);

    Route::apiResource('/notification', NotificationsController::class);

    Route::get('/notifications', [NotificationsController::class, 'adminIndex']);
    Route::get('/notifications/{notification}', [NotificationsController::class, 'adminShow']);
    Route::delete('/notifications/{notification}', [NotificationsController::class, 'adminDelete']);
});