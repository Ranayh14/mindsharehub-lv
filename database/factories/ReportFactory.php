<?php

namespace Database\Factories;

use App\Models\Report;
use App\Models\User;
use App\Models\Post;
use App\Models\Comment;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReportFactory extends Factory
{
    protected $model = Report::class;

    public function definition()
    {
        // Randomly choose between post or comment report
        $isPostReport = $this->faker->boolean();

        return [
            'post_id' => $isPostReport ? Post::factory() : null,
            'comment_id' => !$isPostReport ? Comment::factory() : null,
            'reported_by' => User::factory(),
            'reason' => $this->faker->randomElement([
                'spam',
                'harassment',
                'offensive',
                'other'
            ]),
            'description' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement([
                'pending',
                'approved',
                'rejected'
            ])
        ];
    }

    // State untuk report post
    public function forPost()
    {
        return $this->state(function (array $attributes) {
            return [
                'post_id' => Post::factory(),
                'comment_id' => null
            ];
        });
    }

    // State untuk report comment
    public function forComment()
    {
        return $this->state(function (array $attributes) {
            return [
                'post_id' => null,
                'comment_id' => Comment::factory()
            ];
        });
    }

    // State untuk status pending
    public function pending()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'pending'
            ];
        });
    }

    // State untuk status approved
    public function approved()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'approved'
            ];
        });
    }

    // State untuk status rejected
    public function rejected()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'rejected'
            ];
        });
    }
}

