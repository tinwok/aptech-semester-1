<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Customers;
use App\Models\Staffs;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $customers = [
            ['name' => 'Tran Minh Duc', 'email' => 'duc@gmail.com', 'phone' => '0911111112', 'preferences' => 'Hair Coloring', 'allergies' => 'Hair dye'],
            ['name' => 'Le Thi Mai', 'email' => 'mai@gmail.com', 'phone' => '0911111113', 'preferences' => 'Nail Service', 'allergies' => null],
            ['name' => 'Pham Gia Bao', 'email' => 'bao@gmail.com', 'phone' => '0911111114', 'preferences' => 'Haircut', 'allergies' => null],
            ['name' => 'Vo Ngoc Anh', 'email' => 'anh@gmail.com', 'phone' => '0911111115', 'preferences' => 'Facial Care', 'allergies' => 'Alcohol'],
            ['name' => 'Dang Hoang Nam', 'email' => 'nam@gmail.com', 'phone' => '0911111116', 'preferences' => 'Hair Spa', 'allergies' => null],
            ['name' => 'Bui Quoc Khanh', 'email' => 'khanh@gmail.com', 'phone' => '0911111117', 'preferences' => 'Haircut', 'allergies' => null],
            ['name' => 'Nguyen Thu Ha', 'email' => 'ha@gmail.com', 'phone' => '0911111118', 'preferences' => 'Hair Coloring', 'allergies' => 'Ammonia'],
            ['name' => 'Le Minh Quan', 'email' => 'quan@gmail.com', 'phone' => '0911111119', 'preferences' => 'Hair Wash', 'allergies' => null],
            ['name' => 'Tran Bao Chau', 'email' => 'chau@gmail.com', 'phone' => '0911111120', 'preferences' => 'Nail Service', 'allergies' => null],
        ];

        foreach ($customers as $data) {

            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'phone' => $data['phone'],
                    'password' => Hash::make('12345678'),
                    'dob' => fake()->date('Y-m-d', '2005-01-01'),
                    'role' => 'customer',
                    'status' => 'active',
                ]
            );

            Customers::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'preferred_staff_id' => Staffs::inRandomOrder()->value('id'),
                    'preferences' => $data['preferences'],
                    'allergies' => $data['allergies'],
                ]
            );
        }
    }
}
