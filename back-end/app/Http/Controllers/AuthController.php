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

class AuthController extends Controller
{
    public function register(AuthRegisterRequest $request)
    {
        $user = User::create([
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make('12345678'),
        ]);
        return response()->json([
            'data' => $user,
            'message' => 'Register succes fully!'
        ]);
    }
    public function login(AuthLoginRequest $request)
    {
        $credentials = $request->validated();
        if (!Auth::attempt($credentials)) {
            return  response()->json(['message' => 'Invalid account!'], 401);
        }
        //trình ide không hiểu đc user
        /** @var \App\Models\User $user */
        // lấy user hiện tại
        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
        // trả về user để render ra
    }
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['success' => true, 'message' => 'Đăng xuất thành công'], 200);
    }
    public function me(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Không tồn tại người dùng'], 401);
        }
        return response()->json(['success' => true, 'data' => $user]);
    }
    public function updateProfile(UpdateProfile $request)
    {
        // dd($request->user());
        $user = $request->user();
        // $user->customer->create($request->validated());
        DB::transaction(function () use ($request, $user) {

            $user->update([
                'dob' => $request->dob
            ]);
            Customers::updateOrCreate(
                ['user_id' => $user->id],
                $request->validated()
            );
        });

        return response()->json(['message' => 'Updated profile successfully!']);
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
