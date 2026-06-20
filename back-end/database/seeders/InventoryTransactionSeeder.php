<?php

namespace Database\Seeders;

use App\Models\Inventory_transactions;
use App\Models\Invoices;
use App\Models\Products;
use App\Models\Suppliers;
use Illuminate\Database\Seeder;

class InventoryTransactionSeeder extends Seeder
{
    public function run(): void
    {
        $products = Products::all();
        $suppliers = Suppliers::all(); // hoặc Suppliers nếu model của bạn là số nhiều
        $invoices = Invoices::all();

        if (
            $products->isEmpty() ||
            $suppliers->isEmpty()
        ) {
            return;
        }

        // 15 phiếu nhập kho
        for ($i = 0; $i < 15; $i++) {
            Inventory_transactions::create([
                'product_id' => $products->random()->id,
                'supplier_id' => $suppliers->random()->id,
                'invoice_id' => null,
                'type' => 'import',
                'quantity' => rand(10, 50),
                'note' => 'Nhập hàng từ nhà cung cấp',
            ]);
        }

        // 15 phiếu xuất kho
        for ($i = 0; $i < 15; $i++) {
            Inventory_transactions::create([
                'product_id' => $products->random()->id,
                'supplier_id' => null,
                'invoice_id' => $invoices->isNotEmpty()
                    ? $invoices->random()->id
                    : null,
                'type' => 'export',
                'quantity' => rand(1, 10),
                'note' => 'Xuất hàng cho hóa đơn',
            ]);
        }
    }
}
