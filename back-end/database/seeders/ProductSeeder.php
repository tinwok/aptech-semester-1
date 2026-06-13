<?php

namespace Database\Seeders;

use App\Models\Products;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            ['name' => 'Shampoo Argan Oil',   'current_quantity' => 50, 'import_price' => 80000,  'retail_price' => 150000, 'unit' => 'bottle', 'status' => 'available'],
            ['name' => 'Conditioner Keratin', 'current_quantity' => 50, 'import_price' => 90000,  'retail_price' => 170000, 'unit' => 'bottle', 'status' => 'available'],
            ['name' => 'Hair Mask Treatment', 'current_quantity' => 30, 'import_price' => 120000, 'retail_price' => 220000, 'unit' => 'bottle', 'status' => 'available'],
            ['name' => 'Hair Wax Pomade',     'current_quantity' => 40, 'import_price' => 60000,  'retail_price' => 120000, 'unit' => 'box',    'status' => 'available'],
            ['name' => 'Hair Spray Hold',     'current_quantity' => 35, 'import_price' => 70000,  'retail_price' => 130000, 'unit' => 'bottle', 'status' => 'available'],
            ['name' => 'Face Wash Cleanser',  'current_quantity' => 40, 'import_price' => 85000,  'retail_price' => 160000, 'unit' => 'bottle', 'status' => 'available'],
            ['name' => 'Toner Rose Water',    'current_quantity' => 35, 'import_price' => 95000,  'retail_price' => 180000, 'unit' => 'bottle', 'status' => 'available'],
            ['name' => 'Moisturizer SPF 30',  'current_quantity' => 30, 'import_price' => 110000, 'retail_price' => 200000, 'unit' => 'bottle', 'status' => 'available'],
            ['name' => 'Face Mask Collagen',  'current_quantity' => 50, 'import_price' => 50000,  'retail_price' => 95000,  'unit' => 'box',    'status' => 'available'],
            ['name' => 'Eye Cream Retinol',   'current_quantity' => 25, 'import_price' => 130000, 'retail_price' => 250000, 'unit' => 'bottle', 'status' => 'available'],
        ];

        foreach ($products as $product) {
            Products::create($product);
        }
    }
}
