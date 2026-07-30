<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    public function run()
    {
        $this->command->info('Creando 300 pedidos...');
        
        DB::disableQueryLog();
        
        $users = User::all();
        $orderUsers = $users->random(min(300, $users->count()));
        $orders = [];
        
        foreach ($orderUsers as $user) {
            $userAddresses = Address::where('user_id', $user->id)->pluck('id')->toArray();
            if (empty($userAddresses)) continue;
            
            $addressId = $userAddresses[array_rand($userAddresses)];
            $subtotal = rand(50, 1000);
            $tax = $subtotal * 0.18;
            $shippingCost = rand(5, 30);
            $total = $subtotal + $tax + $shippingCost;
            
            $orders[] = [
                'user_id' => $user->id,
                'address_id' => $addressId,
                'order_number' => 'ORD-' . $this->uniqueOrderNumber(),
                'status' => $this->randomElement(['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado']),
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping_cost' => $shippingCost,
                'total' => $total,
                'created_at' => $this->randomDateBetween('-3 months', 'now'),
                'updated_at' => now(),
            ];
        }
        
        foreach (array_chunk($orders, 500) as $chunk) {
            Order::insert($chunk);
        }
        
        $this->command->info(count($orders) . ' pedidos creados.');
    }
    
    private function randomElement($array)
    {
        return $array[array_rand($array)];
    }
    
    private $orderNumberCounter = 0;
    private function uniqueOrderNumber()
    {
        $this->orderNumberCounter++;
        return str_pad($this->orderNumberCounter, 8, '0', STR_PAD_LEFT);
    }
    
    private function randomDateBetween($start, $end)
    {
        $start = strtotime($start);
        $end = strtotime($end);
        $timestamp = mt_rand($start, $end);
        return date('Y-m-d H:i:s', $timestamp);
    }
}