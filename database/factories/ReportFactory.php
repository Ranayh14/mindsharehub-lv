<?php

namespace Database\Factories;

use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReportFactory extends Factory
{
    protected $model = Report::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'reported_user_id' => User::factory(),
            'content' => $this->faker->text,
            'status' => $this->faker->randomElement(['pending', 'solved', 'rejected']),
            'type' => $this->faker->randomElement(['post', 'comment', 'user']),
        ];
    }
}

