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
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'role' => 'customer',
                'must_change_password' => false,
            ]);

            Customers::create([
                'user_id' => $user->id,
                'preferred_staff_id' => null,
                'preferences' => null,
                'allergies' => null,
            ]);
        });

        return response()->json([
            'data' => $user,
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
        $user->load('customer');

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
        $user = $request->user()->load('customer');

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

            Customers::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'preferred_staff_id' => $request->preferred_staff_id,
                    'preferences' => $request->preferences,
                    'allergies' => $request->allergies,
                ]
            );
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

        if (!$user->must_change_password) {
            if (!Hash::check($request->current_password, $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => ['The current password is incorrect.'],
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

            if ($user->customer) {
                $user->customer()->delete();
            }

            $user->forceDelete();
        });

        return response()->json([
            'message' => 'Account removed permanently!'
        ]);
    }
}