<?php

namespace Database\Seeders;

use App\Models\Customers;
use App\Models\Staffs;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $customers = [
            [
                'name' => 'Tran Minh Duc',
                'email' => 'duc.customer@zenstyle.com',
                'phone' => '0911111112',
                'preferences' => 'Hair Coloring',
                'allergies' => 'Hair dye',
            ],
            [
                'name' => 'Le Thi Mai',
                'email' => 'mai.customer@zenstyle.com',
                'phone' => '0911111113',
                'preferences' => 'Nail Service',
                'allergies' => null,
            ],
            [
                'name' => 'Pham Gia Bao',
                'email' => 'bao.customer@zenstyle.com',
                'phone' => '0911111114',
                'preferences' => 'Haircut',
                'allergies' => null,
            ],
            [
                'name' => 'Vo Ngoc Anh',
                'email' => 'anh.customer@zenstyle.com',
                'phone' => '0911111115',
                'preferences' => 'Facial Care',
                'allergies' => 'Alcohol',
            ],
            [
                'name' => 'Dang Hoang Nam',
                'email' => 'nam.customer@zenstyle.com',
                'phone' => '0911111116',
                'preferences' => 'Hair Spa',
                'allergies' => null,
            ],
        ];

        $staffIds = Staffs::where('status', 'active')->pluck('id')->toArray();

        foreach ($customers as $data) {
            $user = User::updateOrCreate(
                ['phone' => $data['phone']],
                [
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'password' => Hash::make('12345678'),
                    'dob' => fake()->date('Y-m-d', '2005-01-01'),
                    'role' => 'customer',
                    'status' => 'active',
                ]
            );

            Customers::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'preferred_staff_id' => count($staffIds)
                        ? fake()->randomElement($staffIds)
                        : null,
                    'preferences' => $data['preferences'],
                    'allergies' => $data['allergies'],
                    'status' => 'active',
                ]
            );
        }
    }
}