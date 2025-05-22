<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Memanggil seeder untuk users, contents, posts, comments, dan lainnya
        $this->call([
            UserSeeder::class,
            ContentSeeder::class,
            PostSeeder::class,
            CommentSeeder::class,
            PostLikeSeeder::class,
            CommentLikeSeeder::class,
            ReportSeeder::class,
            NotificationSeeder::class,
            DiarySeeder::class,
            CommentReportSeeder::class,
            AudioNoteSeeder::class,
            AdminUserSeeder::class,
        ]);
    }
}
