<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Diary;

class DiarySeeder extends Seeder
{
    public function run()
    {
        Diary::factory(10)->create(); // Generate 10 diary records
    }
}
