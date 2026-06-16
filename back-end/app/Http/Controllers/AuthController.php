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
        $user = User::create([
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => 'customer',
            'status' => 'active',
        ]);

        Customers::create([
            'user_id' => $user->id,
            'preferences' => null,
            'allergies' => null,
            'preferred_staff_id' => null,
            'status' => 'active',
        ]);

        return response()->json([
            'data' => $user->load(['customer', 'staff']),
            'message' => 'Register successfully!'
        ], 201);
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

        if ($user->status !== 'active') {
            return response()->json([
                'message' => 'This account is not active.'
            ], 403);
        }

        $user->load(['customer', 'staff']);

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
            'message' => 'Logged out successfully.'
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user()->load(['customer', 'staff']);

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    public function updateProfile(UpdateProfile $request)
    {
        $user = $request->user();

        DB::transaction(function () use ($request, $user) {
            $user->update([
                'name' => $request->name,
                'phone' => $request->phone,
                'dob' => $request->dob,
            ]);

            if ($user->role === 'customer') {
                Customers::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'preferred_staff_id' => $request->preferred_staff_id,
                        'preferences' => $request->preferences,
                        'allergies' => $request->allergies,
                    ]
                );
            }
        });

        return response()->json([
            'message' => 'Profile updated successfully!'
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

        if (isset($user->must_change_password) && !$user->must_change_password) {
            if (!Hash::check($request->current_password, $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => ['The current password is incorrect.'],
                ]);
            }
        } elseif (!isset($user->must_change_password)) {
            if (!Hash::check($request->current_password, $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => ['The current password is incorrect.'],
                ]);
            }
        }

        $updateData = [
            'password' => Hash::make($request->password),
        ];

        if (array_key_exists('must_change_password', $user->getAttributes())) {
            $updateData['must_change_password'] = false;
        }

        $user->update($updateData);

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

            if ($user->customer) {
                $user->customer()->delete();
            }

            if ($user->staff) {
                $user->staff()->delete();
            }

            $user->forceDelete();
        });

        return response()->json([
            'message' => 'Account removed permanently!'
        ]);
    }
}