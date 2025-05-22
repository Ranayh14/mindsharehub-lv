<?php

namespace Database\Factories;

use App\Models\AudioNote;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AudioNoteFactory extends Factory
{
    protected $model = AudioNote::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'file_name' => $this->faker->word . '.mp3',
        ];
    }
}
