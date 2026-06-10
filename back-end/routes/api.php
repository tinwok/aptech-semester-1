<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomersController;
use App\Http\Controllers\InvoicesController;
use App\Http\Controllers\ServicesController;
use App\Http\Controllers\StaffsController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

//không cần đăng nhập
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::get('services', [ServicesController::class, 'index']);
Route::get('services/{service}', [ServicesController::class, 'show']);




// cần phải đăng nhập và gửi gửi request kèm token mới sử dụng được route này
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/me/profile', [AuthController::class, 'updateProfile']);
    //  /me/profile sửa thêm trong cùng 1 route chỉ cần gọi post
    Route::post('/me/logout', [AuthController::class, 'logout']);
    Route::delete('me/delete', [AuthController::class, 'destroy']);
    Route::middleware('role:staff')->group(function () {
        Route::get('/me/appointments', [InvoicesController::class, 'getStaffAppointments']);
        Route::get('/me/appointments/history', [InvoicesController::class, 'getAppointmentsHistory']);
    });
    Route::middleware('role:customer')->group(function () {
        Route::get('/me/appointments', [InvoicesController::class, 'getCustomerAppointments']);
        Route::get('/me/appointments/history', [InvoicesController::class, 'getAppointmentsHistory']);
        Route::get('/appointments/{appointment}', [InvoicesController::class, 'show']);
        Route::get('/booking', [InvoicesController::class, 'getAvailableTimeOfStaff']);
        Route::get('/book', [InvoicesController::class, 'store']);
        Route::put('/appointments/{invoice}', [InvoicesController::class, 'update']);
        Route::post('/appointments/book', [InvoicesController::class, 'store']);
    });
});

// Can phai la admin
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('dashboard/admin')->group(function () {
    Route::apiResource('/customers', CustomersController::class);
    Route::apiResource('/staffs', StaffsController::class);
    Route::apiResource('users', UserController::class);
    Route::patch('users/{id}/restore', [UserController::class, 'restore']);
    Route::apiResource('services', ServicesController::class);
    Route::apiResource('/appointments', InvoicesController::class);
});
