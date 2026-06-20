<?php

namespace App\Http\Controllers;

use App\Models\Inventory_transactions;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryTransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getInventoryHistory(Request $request)
    {
        $data = Inventory_transactions::query()
            ->with(['supplier', 'product', 'invoice'])

            ->when($request->type, function ($q) use ($request) {
                $q->where('type', $request->type);
            })

            ->when($request->product_name, function ($q) use ($request) {
                $q->whereHas('products', function ($sub) use ($request) {
                    $sub->where('name', 'like', '%' . $request->product_name . '%');
                });
            })

            ->latest()
            ->paginate(10);

        return response()->json($data);
    }
    public function productHistory(String  $Id)
    {
        Products::findOrFail($Id);
        $history = Inventory_transactions::with([
            'supplier',
            'product',
            'invoice'
        ])
            ->where('product_id', $Id)
            ->latest()->paginate(10);

        return response()->json($history);
    }
    public function wastage(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'note' => 'required|string|max:255'
        ]);
        $product = Products::findOrFail(
            $validated['product_id']
        );
        if ($product->current_quantity < $validated['quantity']) {
            return response()->json([
                'message' => 'Insufficient stock'
            ], 422);
        }
        DB::transaction(function () use (
            $product,
            $validated
        ) {
            // Trừ tồn kho
            $product->decrement(
                'current_quantity',
                $validated['quantity']
            );
            // Ghi lịch sử hao hụt
            Inventory_transactions::create([
                'product_id' => $product->id,
                'type' => 'wastage',
                'quantity' => $validated['quantity'],
                'note' => $validated['note']
            ]);
        });
        return response()->json([
            'message' => 'Wastage recorded successfully'
        ]);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function importStock(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'note' => 'nullable|string'
        ]);

        DB::transaction(function () use ($validated) {
            $product = Products::findOrFail($validated['product_id']);
            $product->increment('current_quantity', $validated['quantity']);
            Inventory_transactions::create([
                'product_id' => $product->id,
                'supplier_id' => $validated['supplier_id'],
                'type' => 'import',
                'quantity' => $validated['quantity'],
                'note' => $validated['note'] ?? 'Import stock'
            ]);
        });
        return response()->json([
            'message' => 'Import stock successfully'
        ], 201);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Inventory_transactions $inventory_transactions)
    {
        //
    }
}
