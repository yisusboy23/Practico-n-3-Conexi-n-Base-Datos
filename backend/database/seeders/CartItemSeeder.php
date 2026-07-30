<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CartItemSeeder extends Seeder
{
    public function run()
    {
        $this->command->info('Creando items de carrito...');
        
        DB::disableQueryLog();
        
        $cartIds = Cart::pluck('id')->toArray();
        $productIds = Product::pluck('id')->toArray();
        $cartItems = [];
        $itemCount = 0;
        $maxItems = 80000;
        
        foreach ($cartIds as $cartId) {
            if ($itemCount >= $maxItems) break;
            
            $numItems = rand(1, 5);
            $usedProducts = [];
            
            for ($i = 0; $i < $numItems; $i++) {
                do {
                    $productId = $productIds[array_rand($productIds)];
                } while (in_array($productId, $usedProducts));
                $usedProducts[] = $productId;
                
                $product = Product::find($productId);
                $quantity = rand(1, 3);
                
                $cartItems[] = [
                    'cart_id' => $cartId,
                    'product_id' => $productId,
                    'quantity' => $quantity,
                    'unit_price' => $product ? $product->price : rand(10, 1000),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
                
                $itemCount++;
            }
        }
        
        foreach (array_chunk($cartItems, 5000) as $chunk) {
            CartItem::insert($chunk);
        }
        
        $this->command->info($itemCount . ' items de carrito creados.');
    }
}
