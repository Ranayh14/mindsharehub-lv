<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('preferences', function (Blueprint $table) {
            $table->id();
            $table->json('settings');
            $table->timestamps();
        });

        Schema::create('preference_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('action');
            $table->json('changes');
            $table->timestamps();
        });

        Schema::create('preference_backups', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->json('settings');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('preference_backups');
        Schema::dropIfExists('preference_audit_logs');
        Schema::dropIfExists('preferences');
    }
}; 