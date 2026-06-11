<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthLoginRequest;
use App\Http\Requests\AuthRegisterRequest;
use App\Http\Requests\UpdateProfile;
use App\Models\Customers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(AuthRegisterRequest $request)
    {
        $user = null;

        DB::transaction(function () use ($request, &$user) {
            $user = User::create([
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make('12345678'),
                'role' => 'customer',
                'must_change_password' => true,
            ]);

            Customers::create([
                'user_id' => $user->id,
                'preferred_staff_id' => null,
                'preferences' => null,
                'allergies' => null,
                'status' => 'active',
            ]);
        });

        return response()->json([
            'data' => $user,
            'message' => 'Register successfully!'
        ]);
    }

    public function login(AuthLoginRequest $request)
    {
        $credentials = $request->validated();

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid account!'
            ], 401);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đăng xuất thành công'
        ], 200);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Không tồn tại người dùng'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    public function updateProfile(UpdateProfile $request)
    {
        $user = $request->user();

        if ($user->must_change_password) {
            return response()->json([
                'message' => 'Bạn cần đổi mật khẩu trước khi cập nhật hồ sơ.',
                'must_change_password' => true,
            ], 403);
        }

        DB::transaction(function () use ($request, $user) {
            $user->update([
                'name' => $request->name,
                'phone' => $request->phone,
                'dob' => $request->dob,
            ]);

            Customers::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'preferred_staff_id' => $request->preferred_staff_id,
                    'preferences' => $request->preferences,
                    'allergies' => $request->allergies,
                    'status' => 'active',
                ]
            );
        });

        return response()->json([
            'message' => 'Updated profile successfully!'
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'nullable|string|min:8',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        if (!$user->must_change_password) {
            if (!Hash::check($request->current_password, $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => ['Mật khẩu hiện tại không đúng.'],
                ]);
            }
        }

        $user->update([
            'password' => Hash::make($request->password),
            'must_change_password' => false,
        ]);

        return response()->json([
            'message' => 'Password changed successfully!'
        ]);
    }

    public function destroy(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        DB::transaction(function () use ($user) {
            $user->tokens()->delete();
            $user->customer()?->delete();
            $user->delete();
        });

        return response()->json([
            'message' => 'Deleted successfully!'
        ]);
    }
}