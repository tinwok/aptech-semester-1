<?php

namespace Database\Seeders;

use App\Models\Suppliers;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $suppliers = [

            [
                'name' => 'Công ty TNHH Mỹ Phẩm Hoa Sen',
                'phone' => '0901234567',
                'email' => 'hoasen@gmail.com',
            ],

            [
                'name' => 'Công ty TNHH Thiết Bị Spa An Nhiên',
                'phone' => '0901234568',
                'email' => 'annhien@gmail.com',
            ],
            [
                'name' => 'Công ty TNHH Beauty Care Việt Nam',
                'phone' => '0901234569',
                'email' => 'beautycare@gmail.com',
            ],

            [
                'name' => 'Công ty TNHH Mỹ Phẩm Sakura',
                'phone' => '0901234570',
                'email' => 'sakura@gmail.com',
            ],

            [
                'name' => 'Công ty TNHH Dược Mỹ Phẩm Thiên Ân',
                'phone' => '0901234571',
                'email' => 'thienan@gmail.com',
            ],

            [
                'name' => 'Công ty TNHH Spa & Beauty Pro',
                'phone' => '0901234572',
                'email' => 'beautypro@gmail.com',
            ],

            [
                'name' => 'Công ty TNHH Mỹ Phẩm Green Life',
                'phone' => '0901234573',
                'email' => 'greenlife@gmail.com',
            ],

            [
                'name' => 'Công ty TNHH Thiết Bị Thẩm Mỹ Hoàng Gia',
                'phone' => '0901234574',
                'email' => 'hoanggia@gmail.com',
            ],

            [
                'name' => 'Công ty TNHH Natural Beauty',
                'phone' => '0901234575',
                'email' => 'naturalbeauty@gmail.com',
            ],

            [
                'name' => 'Công ty TNHH Mỹ Phẩm Luxury Skin',
                'phone' => '0901234576',
                'email' => 'luxuryskin@gmail.com',
            ],

        ];

        foreach ($suppliers as $supplier) {
            Suppliers::create($supplier);
        }
    }
}
