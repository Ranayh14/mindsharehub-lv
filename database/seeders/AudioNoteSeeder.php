<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AudioNote;

class AudioNoteSeeder extends Seeder
{
    public function run()
    {
        AudioNote::factory(10)->create(); // Generate 10 audio notes
    }
}
