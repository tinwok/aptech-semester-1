<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceInventorySeeder extends Seeder
{
    public function run(): void
    {
        $data = [

            // Men Haircut (service_id = 1)
            ['service_id' => 1, 'product_id' => 1, 'quantity_used' => 10],
            ['service_id' => 1, 'product_id' => 4, 'quantity_used' => 5],

            // Women Haircut (service_id = 2)
            ['service_id' => 2, 'product_id' => 1, 'quantity_used' => 15],
            ['service_id' => 2, 'product_id' => 2, 'quantity_used' => 10],

            // Hair Wash (service_id = 3)
            ['service_id' => 3, 'product_id' => 1, 'quantity_used' => 20],
            ['service_id' => 3, 'product_id' => 2, 'quantity_used' => 15],

            // Hair Coloring (service_id = 4)
            ['service_id' => 4, 'product_id' => 1, 'quantity_used' => 20],
            ['service_id' => 4, 'product_id' => 2, 'quantity_used' => 15],
            ['service_id' => 4, 'product_id' => 3, 'quantity_used' => 25],

            // Hair Highlight (service_id = 5)
            ['service_id' => 5, 'product_id' => 1, 'quantity_used' => 20],
            ['service_id' => 5, 'product_id' => 2, 'quantity_used' => 15],
            ['service_id' => 5, 'product_id' => 3, 'quantity_used' => 30],

            // Hair Perm (service_id = 6)
            ['service_id' => 6, 'product_id' => 1, 'quantity_used' => 20],
            ['service_id' => 6, 'product_id' => 2, 'quantity_used' => 20],
            ['service_id' => 6, 'product_id' => 3, 'quantity_used' => 30],

            // Hair Straightening (service_id = 7)
            ['service_id' => 7, 'product_id' => 1, 'quantity_used' => 20],
            ['service_id' => 7, 'product_id' => 2, 'quantity_used' => 20],
            ['service_id' => 7, 'product_id' => 3, 'quantity_used' => 35],

            // Hair Spa (service_id = 8)
            ['service_id' => 8, 'product_id' => 1, 'quantity_used' => 15],
            ['service_id' => 8, 'product_id' => 3, 'quantity_used' => 25],

            // Hair Recovery Treatment (service_id = 9)
            ['service_id' => 9, 'product_id' => 1, 'quantity_used' => 20],
            ['service_id' => 9, 'product_id' => 2, 'quantity_used' => 15],
            ['service_id' => 9, 'product_id' => 3, 'quantity_used' => 35],

            // Beard Trim (service_id = 10)
            ['service_id' => 10, 'product_id' => 4, 'quantity_used' => 3],
        ];

        DB::table('service_inventories')->insert($data);
    }
}
