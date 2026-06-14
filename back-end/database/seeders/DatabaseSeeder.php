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
        ]);
        $this->call([
            StaffSeeder::class,
            CustomerSeeder::class,
            ServiceSeeder::class,
        ]);
    }
}
