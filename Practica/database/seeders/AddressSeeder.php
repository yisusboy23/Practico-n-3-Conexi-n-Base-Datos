<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class AddressSeeder extends Seeder
{
    public function run()
    {
        $this->command->info('Creando 1,000 direcciones...');
        
        DB::disableQueryLog();
        
        $faker = Faker::create();
        $userIds = User::pluck('id')->toArray();
        $addresses = [];
        
        foreach ($userIds as $userId) {
            $addresses[] = [
                'user_id' => $userId,
                'recipient_name' => $faker->name,
                'line1' => $faker->streetAddress,
                'city' => $faker->city,
                'state' => $faker->state,
                'postal_code' => $faker->postcode,
                'country' => 'Perú',
                'is_default' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        
        foreach (array_chunk($addresses, 500) as $chunk) {
            Address::insert($chunk);
        }
        
        $this->command->info(count($addresses) . ' direcciones creadas.');
    }
}