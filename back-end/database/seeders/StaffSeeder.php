<?php

namespace Database\Seeders;

use App\Models\User;

use App\Models\Staffs;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StaffSeeder extends Seeder
{
    public function run(): void
    {
        $staffs = [
            [
                'name' => 'Nguyen Van An',
                'email' => 'an@gmail.com',
                'phone' => '0901234501',
                'position' => 'stylist',
                'shift' => '08:00 - 17:00',
                'salary' => 12000000,
                'status' => 'active',
            ],
            [
                'name' => 'Tran Thi Binh',
                'email' => 'binh@gmail.com',
                'phone' => '0901234502',
                'position' => 'stylist',
                'shift' => '09:00 - 18:00',
                'salary' => 13000000,
                'status' => 'active',
            ],
            [
                'name' => 'Le Minh Chau',
                'email' => 'chau@gmail.com',
                'phone' => '0901234503',
                'position' => 'baber',
                'shift' => '08:00 - 17:00',
                'salary' => 11000000,
                'status' => 'active',
            ],
            [
                'name' => 'Pham Quoc Dung',
                'email' => 'dung@gmail.com',
                'phone' => '0901234504',
                'position' => 'baber',
                'shift' => '10:00 - 19:00',
                'salary' => 11500000,
                'status' => 'active',
            ],
            [
                'name' => 'Hoang Gia Huy',
                'email' => 'huy@gmail.com',
                'phone' => '0901234505',
                'position' => 'manager',
                'shift' => '08:00 - 17:00',
                'salary' => 25000000,
                'status' => 'active',
            ],
            [
                'name' => 'Vo Thi Lan',
                'email' => 'lan@gmail.com',
                'phone' => '0901234506',
                'position' => 'receptionist',
                'shift' => '08:00 - 17:00',
                'salary' => 9000000,
                'status' => 'active',
            ],
            [
                'name' => 'Dang Minh Khoa',
                'email' => 'khoa@gmail.com',
                'phone' => '0901234507',
                'position' => 'stylist',
                'shift' => '09:00 - 18:00',
                'salary' => 12500000,
                'status' => 'inactive',
            ],
            [
                'name' => 'Bui Thanh Nam',
                'email' => 'nam@gmail.com',
                'phone' => '0901234508',
                'position' => 'baber',
                'shift' => '08:00 - 17:00',
                'salary' => 11000000,
                'status' => 'active',
            ],
            [
                'name' => 'Nguyen Thu Trang',
                'email' => 'trang@gmail.com',
                'phone' => '0901234509',
                'position' => 'receptionist',
                'shift' => '13:00 - 21:00',
                'salary' => 8500000,
                'status' => 'active',
            ],
            [
                'name' => 'Le Hoang Phuc',
                'email' => 'phuc@gmail.com',
                'phone' => '0901234510',
                'position' => 'stylist',
                'shift' => '10:00 - 19:00',
                'salary' => 14000000,
                'status' => 'blocked',
            ],
        ];

        foreach ($staffs as $staffData) {

            $user = User::create([
                'name' => $staffData['name'],
                'email' => $staffData['email'],
                'phone' => $staffData['phone'],
                'password' => Hash::make('12345678'),
                'dob' => fake()->date('Y-m-d', '2000-01-01'),
                'role' => 'staff',
            ]);

            Staffs::create([
                'user_id' => $user->id,
                'position' => $staffData['position'],
                'shift' => $staffData['shift'],
                'salary' => $staffData['salary'],
                'status' => $staffData['status'],

            ]);
        }
    }
}
