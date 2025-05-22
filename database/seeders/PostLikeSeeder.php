<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PostLike;

class PostLikeSeeder extends Seeder
{
    public function run()
    {
        PostLike::factory(20)->create();
    }
}
