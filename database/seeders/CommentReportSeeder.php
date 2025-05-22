<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CommentReport;

class CommentReportSeeder extends Seeder
{
    public function run()
    {
        CommentReport::factory(10)->create(); // Generate 10 comment reports
    }
}
