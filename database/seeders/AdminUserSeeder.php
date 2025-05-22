<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        User::updateOrCreate(
            ['email' => config('admin.email')],
            [
                'username' => 'admin',
                'password'     => bcrypt(config('admin.password')),
                'roles'    => 'admin',
            ]
        );
    }
}
