<?php

namespace Database\Seeders;

use App\Enums\User\Role;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TenantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Tenant::factory()->has(User::factory()->create(['role' => Role::Admin]))->has(User::factory()->count(2))->create();
    }
}
