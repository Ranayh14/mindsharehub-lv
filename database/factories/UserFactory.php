<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition()
    {
        // Menambahkan incremental counter untuk username yang unik
        static $index = 1;  // Mulai dari angka 1, dan bertambah setiap kali seeding

        return [
            'username' => 'user' . str_pad($index++, 3, '0', STR_PAD_LEFT),  // Format: user001, user002, ...
            'email' => $this->faker->unique()->safeEmail,  // Pastikan email juga unik
            'password' => bcrypt('password'),
            'roles' => 'user',
            'is_banned' => $this->faker->boolean,
            'ban_reason' => $this->faker->text,
            'ban_date' => $this->faker->dateTime,
            'profile_picture' => 'pp1.png',
            'progress_percentage' => $this->faker->numberBetween(0, 100),
        ];
    }
}
