<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin2',
            'email' => 'admin2@gmail.com',
            'phone' => '9999999999',
            'password' => Hash::make('12345678'),
            'role' => 'admin'
        ]);
    }
}
