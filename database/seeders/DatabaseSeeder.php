<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'id' => 1,
            'name' => 'ahmed',
            'email' => 'ahmed@example.com', // tu peux changer si tu veux
            'password' => 'wail',
            'email_verified_at' => now(),
            "role"=> "admin",
        ]);
    }
}
