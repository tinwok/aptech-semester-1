<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Illuminate\Http\Request;

class ProductsController extends Controller
{
    /**
     * Danh sách sản phẩm
     */
    public function index(Request $request)
    {
        $query = Products::with('inventoryTransactions.supplier');
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $products = $query->latest()->paginate(10);
        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /**
     * Thêm sản phẩm
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'current_quantity' => 'required|integer|min:0',
            'import_price' => 'required|numeric|min:0',
            'retail_price' => 'required|numeric|min:0',
            'unit' => 'required|string|max:50|in:ml,g,pcs,bottle,box,pair',
            'status' => 'in:available,unavailable',
        ]);

        $product = Products::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => $product
        ], 201);
    }

    /**
     * Chi tiết sản phẩm
     */
    public function show(Products $product)
    {
        $product->load('inventoryTransactions.supplier');
        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }

    /**
     * Cập nhật sản phẩm
     */
    public function update(Request $request, Products  $product)
    {


        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'supplier_id' => 'sometimes|exists:suppliers,id',
            'current_quantity' => 'sometimes|integer|min:0',
            'import_price' => 'sometimes|numeric|min:0',
            'retail_price' => 'sometimes|numeric|min:0',
            'unit' => 'sometimes|string|max:50|in:ml,g,pcs,bottle,box,pair',
            'status' => 'sometimes|in:available,unavailable',
        ]);

        $product->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => $product
        ]);
    }

    /**
     * Xóa sản phẩm
     */
    public function destroy(string $id)
    {
        $product = Products::findOrFail($id);

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    }
}
