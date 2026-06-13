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
            ['title' => 'Classic Style',       'description' => 'Classic style haircuting',           'duration_minutes' => 45, 'price' => 150000, 'status' => 'active'],
            ['title' => 'Layer Style',         'description' => 'Layer style haircuting',              'duration_minutes' => 60, 'price' => 150000, 'status' => 'active'],
            ['title' => 'Undercut Style',      'description' => 'Undercut style haircuting',           'duration_minutes' => 60, 'price' => 150000, 'status' => 'active'],
            ['title' => 'Hair Coloring',       'description' => 'Color the hair within modern style',  'duration_minutes' => 90, 'price' => 200000, 'status' => 'active'],
            ['title' => 'Massage Skin Face',   'description' => 'Ressurecting the skin of your face', 'duration_minutes' => 60, 'price' => 200000, 'status' => 'active'],
            ['title' => 'White Skin Face',     'description' => 'Make your face bright and shining',   'duration_minutes' => 60, 'price' => 250000, 'status' => 'active'],
            ['title' => 'Moisture Skin Face',  'description' => 'Make your face firmed and plumped',   'duration_minutes' => 60, 'price' => 250000, 'status' => 'active'],
            ['title' => 'Nails',               'description' => 'Take care and nail',                  'duration_minutes' => 45, 'price' => 100000, 'status' => 'active'],
            ['title' => 'Earwax',              'description' => 'Clean and defend your ears',          'duration_minutes' => 45, 'price' => 100000, 'status' => 'active'],
            ['title' => 'Relaxation Hairwash', 'description' => 'Enjoy and relax a clean hair',       'duration_minutes' => 45, 'price' => 150000, 'status' => 'active'],
        ];

        foreach ($services as $service) {
            Services::create($service);
        }
    }
}
