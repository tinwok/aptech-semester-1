<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStaff;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateStaffRequest;
use App\Models\Staffs;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StaffsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //show staff đang hoạt động cho khách thấy
        $query = Staffs::with([
            'users',
            'customers'
        ]);
        // tìm theo ten va email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('users', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%");
            });
        }
        if ($request->filled('min_salary')) {
            $query->where(
                'salary',
                '>=',
                $request->min_salary
            );
        }
        if ($request->filled('max_salary')) {
            $query->where(
                'salary',
                '<=',
                $request->max_salary
            );
        }
        $staffs =  $query->where('status', 'active')->paginate(10);
        return response()->json($staffs);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    //    chỉ có admin mới tạo được nick cho staff
    public function store(StoreStaff $request)
    {
        DB::transaction(function () use ($request) {

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'dob' => $request->dob,
                'phone' => $request->phone,
                'password' => Hash::make($request->password),
                'role' => 'staff'
            ]);

            Staffs::create([
                'user_id' => $user->id,
                'position' => $request->position,
                'shift' => $request->shift,
                'salary' => $request->salary,
                'status' => $request->status
            ]);
        });
        return response()->json([
            'message' => 'Staff created successfully'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Staffs $staff)
    {
        return response()->json($staff->load(['users', 'customers']));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Staffs $staffs) {}

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStaffRequest $request, Staffs $staff)
    {
        DB::transaction(function () use ($request, $staff) {
            //update user
            $staff->users->update([
                'name' => $request->name,
                'email' => $request->email,
                'dob' => $request->dob,
                'phone' => $request->phone,
                'role' => 'staff'
            ]);
            if ($request->filled('password')) {
                $staff->users->update(['password' => Hash::make($request->password)]);
            }
            // user staff
            $staff->update([
                'position' => $request->position,
                'shift' => $request->shift,
                'salary' => $request->salary,
                'status' => $request->status
            ]);
        });
        return response()->json([
            'message' => 'Staff updated successfully'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Staffs $staff)
    {
        return response()->json($staff->update([
            'status' => 'inactive'
        ]));
    }
}
