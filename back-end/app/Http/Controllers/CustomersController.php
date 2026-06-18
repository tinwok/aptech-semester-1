<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\Customers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CustomersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Customers::with('user');

        if ($request->filled('search')) {
            $search = $request->search;

            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $customers = $query->latest()->paginate(10);

        return response()->json($customers);
    }
    /**
     * Show the form for creating a new resource.
     */

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomerRequest $request)
    {
        $customer = DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'dob' => $request->dob,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone' => $request->phone,
                'role' => 'customer'
            ]);

            return  Customers::create([
                'user_id' => $user->id,
                'preferred_staff_id' => $request->preferred_staff_id,
                'preferences' => $request->preferences,
                'allergies' => $request->allergies,
            ]);
        });
        return response()->json([
            'data' =>  $customer,
            'message' => 'Created customer!'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Customers $customer)
    {
        return response()->json($customer->load('user'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customers $customers)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomerRequest $request, Customers $customer)
    {

        DB::transaction(function () use ($request, $customer) {
            // $data = $request->validated();
            $userUpdateData = [
                'name' => $request['name'],
                'dob' => $request['dob'] ?? null,
                'email' => $request['email'],
                'phone' => $request['phone'],
            ];

            if ($request->filled('password')) {
                $userUpdateData['password'] = Hash::make($request->password);
            }

            $customer->user->update($userUpdateData);
            $customer->update([
                'preferred_staff_id' => $request['preferred_staff_id'],
                'preferences' => $request['preferences'],
                'allergies' => $request['allergies'],
            ]);
        });

        return response()->json(['message' => 'Updated successfully!']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customers $customer)
    {
        $customer->update([
            'status' => 'inactive'
        ]);

        return response()->json([
            'message' => 'Customer deactivated successfully'
        ]);
    }
}
