<?php

namespace Database\Seeders;

use App\Models\Todo;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TodoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (Todo::doesntExist()) {
            Todo::factory()->count(50)->for(User::first() ?: User::factory())->create();
            Todo::factory()->count(50)->for(User::factory())->create();
            Todo::factory()->count(50)->for(User::factory())->create();
        }
    }
}
