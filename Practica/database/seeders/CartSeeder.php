<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CartSeeder extends Seeder
{
    public function run()
    {
        $this->command->info('Creando 500 carritos...');
        
        DB::disableQueryLog();
        
        $users = User::all();
        $cartUsers = $users->random(min(500, $users->count()));
        $carts = [];
        
        foreach ($cartUsers as $user) {
            $carts[] = [
                'user_id' => $user->id,
                'session_id' => null,
                'status' => $this->randomElement(['activo', 'convertido', 'abandonado']),
                'created_at' => now()->subDays(rand(0, 30)),
                'updated_at' => now(),
            ];
        }
        
        foreach (array_chunk($carts, 500) as $chunk) {
            Cart::insert($chunk);
        }
        
        $this->command->info(count($carts) . ' carritos creados.');
    }
    
    private function randomElement($array)
    {
        return $array[array_rand($array)];
    }
}