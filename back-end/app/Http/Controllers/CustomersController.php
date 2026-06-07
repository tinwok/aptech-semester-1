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
    public function getCustommers(Request $request)
    {
        $query =  Customers::with('users');
        if ($request->filled('search')) {
            $search = request('search');
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")->orWhere('phone', 'like', "%{$search}%");
            });
        }


        return response()->json($query->latest()->paginate(10));
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
    public function store(StoreCustomerRequest $request)
    {
        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'dob' => $request->dob,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone' => $request->phone,
                'role' => 'customer'
            ]);

            Customers::create([
                'user_id' => $user->id,
                'preferred_staff_id' => $request->preferred_staff_id,
                'preferences' => $request->preferences,
                'allergies' => $request->allergies,
            ]);
        });
        return response()->json([
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
            $data = $request->validated();
            $userData = $customer->user->update([
                'name' =>  $data['name'],
                'dob' =>  $data['dob'],
                'email' =>  $data['email'],
                'phone' =>  $data['phone']
            ]);
            if ($request->filled('password')) {
                $userData['password'] = Hash::make($request->password);
            }
            $customer->update([
                'preferred_staff_id' => $data['preferred_staff_id'],
                'preferences' => $data['preferences'],
                'allergies' => $data['allergies'],
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
