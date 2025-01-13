<?php

namespace Database\Seeders;

use App\Enums\User\Role;
use App\Models\Tenant;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        if (User::where('email', 'test@example.com')->doesntExist()) {
            User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'role' => Role::Admin,
                'tenant_id' => Tenant::where('name', 'Example')->first()?->id ?: Tenant::factory()->create(['name' => 'Example', 'slug' => 'example'])->id,
            ]);
        }

        $this->call([
            TodoSeeder::class,
        ]);
    }
}
