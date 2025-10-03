<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'name' => fake()->sentence(),
            'description' => fake()->realText(),
            'status' => fake()->randomElement(['pending', 'in_progress', 'completed']),
            'image_path' => fake()->imageUrl(),
            'start_date' => fake()->dateTimeBetween('-1 year', 'now'),
            'due_date' => fake()->dateTimeBetween('now', '+1 year'),
            'client_name' => fake()->name(),
            'client_address' => fake()->address(),
            'client_phone' => fake()->phoneNumber(),
            'client_email' => fake()->safeEmail(),
            'created_by' => 1,
            'updated_by' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
