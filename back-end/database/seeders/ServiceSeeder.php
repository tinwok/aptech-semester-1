<?php

namespace Database\Seeders;

use App\Models\Services;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'title' => 'Men Haircut',
                'description' => 'Professional haircut for men.',
                'duration_minutes' => 30,
                'price' => 100000,
                'status' => 'active',
                'note' => 'Most popular service',
                'image_url' => null,
            ],
            [
                'title' => 'Women Haircut',
                'description' => 'Professional haircut for women.',
                'duration_minutes' => 45,
                'price' => 180000,
                'status' => 'active',
                'note' => null,
                'image_url' => null,
            ],
            [
                'title' => 'Hair Wash',
                'description' => 'Relaxing hair wash and scalp massage.',
                'duration_minutes' => 20,
                'price' => 50000,
                'status' => 'active',
                'note' => null,
                'image_url' => null,
            ],
            [
                'title' => 'Hair Coloring',
                'description' => 'Full hair coloring service.',
                'duration_minutes' => 120,
                'price' => 600000,
                'status' => 'active',
                'note' => 'Color price may vary by hair length.',
                'image_url' => null,
            ],
            [
                'title' => 'Hair Highlight',
                'description' => 'Fashion highlight coloring.',
                'duration_minutes' => 150,
                'price' => 800000,
                'status' => 'active',
                'note' => null,
                'image_url' => null,
            ],
            [
                'title' => 'Hair Perm',
                'description' => 'Create natural curls and waves.',
                'duration_minutes' => 180,
                'price' => 900000,
                'status' => 'active',
                'note' => null,
                'image_url' => null,
            ],
            [
                'title' => 'Hair Straightening',
                'description' => 'Permanent hair straightening treatment.',
                'duration_minutes' => 180,
                'price' => 1000000,
                'status' => 'active',
                'note' => null,
                'image_url' => null,
            ],
            [
                'title' => 'Hair Spa',
                'description' => 'Deep nourishment and scalp care.',
                'duration_minutes' => 60,
                'price' => 250000,
                'status' => 'active',
                'note' => 'Recommended once a month.',
                'image_url' => null,
            ],
            [
                'title' => 'Hair Recovery Treatment',
                'description' => 'Repair damaged and dry hair.',
                'duration_minutes' => 90,
                'price' => 450000,
                'status' => 'active',
                'note' => null,
                'image_url' => null,
            ],
            [
                'title' => 'Beard Trim',
                'description' => 'Professional beard shaping and trimming.',
                'duration_minutes' => 20,
                'price' => 70000,
                'status' => 'active',
                'note' => null,
                'image_url' => null,
            ],
        ];

        foreach ($services as $service) {
            Services::updateOrCreate(
                ['title' => $service['title']],
                $service
            );
        }
    }
}
