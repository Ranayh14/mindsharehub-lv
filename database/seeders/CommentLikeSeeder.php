<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CommentLike;

class CommentLikeSeeder extends Seeder
{
    public function run()
    {
        CommentLike::factory(20)->create(); // Generate 20 comment likes
    }
}
