<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
// Hàm này chỉ viết cho admin
class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getUsers()
    {
        $users = User::select('id', 'name', 'email', 'phone', 'dob', 'role', 'created_at', 'updated_at')
            ->latest()
            ->paginate(10);
        return response()->json($users, 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function storeUser(StoreUserRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'dob' => $request->dob,
            'role' => $request->role
        ]);

        return response()->json([
            'message' => 'Create user successfully',
            'data' => $user
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function showUser(User $user)
    {
        return response()->json($user);
    }

    /**
     *
     */
    public function edit(User $user) {}

    /**
     * Update user
     */
    public function updateUser(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();

        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        $user->update($data);

        return response()->json($user, ['message' => 'User deleted successfully']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroyUser(User $user)
    {
        $user->delete();
    }
    public function restore(int $id)
    {
        $user = User::withTrashed()->findOrFail($id);

        $user->restore();

        return response()->json([

            'message' => 'Restored successfully'

        ]);
    }
}
