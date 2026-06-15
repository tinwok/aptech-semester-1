<?php

namespace Database\Seeders;

use App\Models\Staffs;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StaffSeeder extends Seeder
{
    public function run(): void
    {
        $staffs = [
            ['name' => 'Nguyen Van An', 'email' => 'an.staff@zenstyle.com', 'phone' => '0901234501', 'position' => 'stylist', 'shift' => '08:00 - 17:00', 'salary' => 12000000, 'status' => 'active'],
            ['name' => 'Tran Thi Binh', 'email' => 'binh.staff@zenstyle.com', 'phone' => '0901234502', 'position' => 'stylist', 'shift' => '09:00 - 18:00', 'salary' => 13000000, 'status' => 'active'],
            ['name' => 'Le Minh Chau', 'email' => 'chau.staff@zenstyle.com', 'phone' => '0901234503', 'position' => 'baber', 'shift' => '08:00 - 17:00', 'salary' => 11000000, 'status' => 'active'],
            ['name' => 'Pham Quoc Dung', 'email' => 'dung.staff@zenstyle.com', 'phone' => '0901234504', 'position' => 'baber', 'shift' => '10:00 - 19:00', 'salary' => 11500000, 'status' => 'active'],
            ['name' => 'Vo Thi Lan', 'email' => 'lan.staff@zenstyle.com', 'phone' => '0901234506', 'position' => 'receptionist', 'shift' => '08:00 - 17:00', 'salary' => 9000000, 'status' => 'active'],
        ];

        foreach ($staffs as $data) {
            $user = User::updateOrCreate(
                ['phone' => $data['phone']],
                [
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'password' => Hash::make('12345678'),
                    'dob' => fake()->date('Y-m-d', '2000-01-01'),
                    'role' => 'staff',
                    'status' => 'active',
                ]
            );

            Staffs::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'position' => $data['position'],
                    'shift' => $data['shift'],
                    'salary' => $data['salary'],
                    'status' => $data['status'],
                ]
            );
        }
    }
}