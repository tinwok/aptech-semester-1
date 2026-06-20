<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            ServiceSeeder::class,
            ProductSeeder::class,
            AdminUserSeeder::class,
            StaffSeeder::class,
            CustomerSeeder::class,
            ServiceSeeder::class,
            AppointmentSeeder::class,
            NotificationSeeder::class,
            SupplierSeeder::class,
            ServiceSeeder::class,
            ProductSeeder::class,
            SupplierSeeder::class,
            InventoryTransactionSeeder::class,
            ServiceInventorySeeder::class,
        ]);
    }
}
