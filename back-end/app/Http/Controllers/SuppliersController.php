<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Models\Suppliers;
use Illuminate\Http\Request;

class SuppliersController extends Controller
{
    /**
     * Danh sách nhà cung cấp
     */
    public function index(Request $request)
    {
        $query = Suppliers::query();

        if ($request->filled('search')) {
            $search = $request->search;

            $query->where('name', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        }

        return response()->json(
            $query->latest()->paginate(10)
        );
    }
    /**
     * Thêm nhà cung cấp
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|unique:suppliers,email',
        ]);

        $supplier = Suppliers::create($validated);

        return response()->json([
            'message' => 'Supplier created successfully',
            'data' => $supplier
        ], 201);
    }

    /**
     * Chi tiết nhà cung cấp
     */
    public function show(string $id)
    {
        $supplier = Suppliers::findOrFail($id);

        return response()->json($supplier);
    }

    /**
     * Cập nhật nhà cung cấp
     */
    public function update(Request $request, string $id)
    {
        $supplier = Suppliers::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'email' => 'sometimes|email|unique:suppliers,email,' . $supplier->id,
        ]);

        $supplier->update($validated);

        return response()->json([
            'message' => 'Supplier updated successfully',
            'data' => $supplier
        ]);
    }

    /**
     * Xóa nhà cung cấp
     */
    public function destroy(string $id)
    {
        $supplier = Suppliers::findOrFail($id);

        $supplier->delete();

        return response()->json([
            'message' => 'Supplier deleted successfully'
        ]);
    }
}
