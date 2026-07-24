<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductImageSeeder extends Seeder
{
    public function run()
    {
        $this->command->info('Creando imágenes de productos...');
        
        DB::disableQueryLog();
        
        $productIds = Product::pluck('id')->toArray();
        $imageChunk = 5000;
        $totalImages = 0;
        
        for ($i = 0; $i < count($productIds); $i += $imageChunk) {
            $productChunk = array_slice($productIds, $i, $imageChunk);
            $images = [];
            
            foreach ($productChunk as $productId) {
                $numImages = rand(1, 3);
                for ($j = 0; $j < $numImages; $j++) {
                    $images[] = [
                        'product_id' => $productId,
                        'url' => 'https://via.placeholder.com/400x400/' . rand(100000, 999999),
                        'is_primary' => $j === 0,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                    $totalImages++;
                }
            }
            
            if (!empty($images)) {
                ProductImage::insert($images);
            }
        }
        
        $this->command->info("{$totalImages} imágenes de productos creadas.");
    }
}