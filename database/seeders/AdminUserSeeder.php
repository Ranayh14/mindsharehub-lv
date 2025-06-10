<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        User::updateOrCreate(
            ['email' => config('admin.email')],
            [
                'username' => 'admin',
                'password'     => Hash::make('12345678'),
                'roles'    => 'admin',
            ]
        );
    }
}
