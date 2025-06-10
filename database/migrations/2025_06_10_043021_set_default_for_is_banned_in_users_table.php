<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('users')
            ->whereNull('is_banned')
            ->update(['is_banned' => false]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Jika Anda ingin mengembalikan ke NULL saat rollback (tidak disarankan untuk kolom boolean)
        // DB::table('users')
        //     ->where('is_banned', false)
        //     ->update(['is_banned' => null]);
    }
};
