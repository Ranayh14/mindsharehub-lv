<?php

namespace Database\Factories;

use App\Models\CommentReport;
use App\Models\User;
use App\Models\Comment;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentReportFactory extends Factory
{
    protected $model = CommentReport::class;

    public function definition()
    {
        return [
            'comment_id' => Comment::factory(),
            'user_id' => User::factory(),
            'reason' => $this->faker->word,
            'description' => $this->faker->text,
            'status' => 'Menunggu',
        ];
    }
}
