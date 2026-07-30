<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderItemSeeder extends Seeder
{
    public function run()
    {
        $this->command->info('Creando items de pedido...');
        
        DB::disableQueryLog();
        
        $orderIds = Order::pluck('id')->toArray();
        $productIds = Product::pluck('id')->toArray();
        $orderItems = [];
        $itemCount = 0;
        $maxItems = 150000;
        
        foreach ($orderIds as $orderId) {
            if ($itemCount >= $maxItems) break;
            
            $numItems = rand(1, 8);
            $orderSubtotal = 0;
            
            for ($i = 0; $i < $numItems; $i++) {
                $productId = $productIds[array_rand($productIds)];
                $product = Product::find($productId);
                $quantity = rand(1, 5);
                $unitPrice = $product ? $product->price : rand(10, 1000);
                $subtotal = $quantity * $unitPrice;
                $orderSubtotal += $subtotal;
                
                $orderItems[] = [
                    'order_id' => $orderId,
                    'product_id' => $productId,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'subtotal' => $subtotal,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                
                $itemCount++;
            }
            
            // Actualizar subtotal del pedido
            Order::where('id', $orderId)->update(['subtotal' => $orderSubtotal]);
        }
        
        foreach (array_chunk($orderItems, 5000) as $chunk) {
            OrderItem::insert($chunk);
        }
        
        $this->command->info($itemCount . ' items de pedido creados.');
    }
}