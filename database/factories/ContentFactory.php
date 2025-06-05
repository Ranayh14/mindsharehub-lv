<?php

namespace Database\Factories;

use App\Models\Content;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContentFactory extends Factory
{
    protected $model = Content::class;

    public function definition()
    {
        return [
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'title' => $this->faker->sentence,
            'content' => $this->faker->paragraphs(3, true),
            'image_path' => null,
            'is_published' => $this->faker->boolean(90), // 90% chance of being published
            'send_notification' => $this->faker->boolean(80), // 80% chance of sending notification
        ];
    }
}

