<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Brand;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $this->command->info('Creando 500,000 productos...');
        
        DB::disableQueryLog();
        
        // Obtener categorías y marcas existentes
        $allCategories = Category::all();
        $brands = Brand::all();
        
        if ($allCategories->isEmpty() || $brands->isEmpty()) {
            $this->command->error('Primero ejecuta CategorySeeder y BrandSeeder');
            return;
        }
        
        $chunkSize = 1000;
        $totalProducts = 500000;
        $bar = $this->command->getOutput()->createProgressBar($totalProducts / $chunkSize);
        
        for ($i = 0; $i < $totalProducts; $i += $chunkSize) {
            $products = Product::factory(min($chunkSize, $totalProducts - $i))->make();
            
            $products->each(function ($product) use ($allCategories, $brands) {
                $product->category_id = $allCategories->random()->id;
                $product->brand_id = $brands->random()->id;
            });
            
            Product::insert($products->toArray());
            $bar->advance();
        }
        
        $bar->finish();
        $this->command->newLine();
        $this->command->info('Productos creados exitosamente.');
    }
}