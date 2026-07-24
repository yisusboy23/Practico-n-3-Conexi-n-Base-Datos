<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    public function run()
    {
        $this->command->info('Creando 1,000 usuarios...');
        
        DB::disableQueryLog();
        
        $faker = Faker::create();
        $totalUsers = 1000;  // Mínimo para pruebas
        $chunkSize = 200;
        $bar = $this->command->getOutput()->createProgressBar($totalUsers / $chunkSize);
        
        for ($i = 0; $i < $totalUsers; $i += $chunkSize) {
            $users = [];
            $limit = min($chunkSize, $totalUsers - $i);
            
            for ($j = 0; $j < $limit; $j++) {
                $users[] = [
                    'name' => $faker->name,
                    'email' => $faker->unique()->safeEmail,
                    'password' => Hash::make('password'),
                    'role' => $faker->randomElement(['cliente', 'admin']),
                    'email_verified_at' => $faker->optional(0.8)->dateTimeBetween('-1 year', 'now'),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            
            User::insert($users);
            $bar->advance();
        }
        
        $bar->finish();
        $this->command->newLine();
        $this->command->info('1,000 usuarios creados exitosamente.');
    }
}