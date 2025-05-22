<?php

namespace Database\Factories;

use App\Models\Report;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReportFactory extends Factory
{
    protected $model = Report::class;

    public function definition()
    {
        return [
            'post_id' => Post::factory(),
            'reported_by' => User::factory(),
            'reason' => $this->faker->word,
            'description' => $this->faker->text,
            'status' => 'aktif',
        ];
    }
}

