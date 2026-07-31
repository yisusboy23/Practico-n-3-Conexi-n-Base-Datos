<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Brand;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $totalProducts = 500000;
        $chunkSize = 2500; 

        $this->command->info("Iniciando la generación de {$totalProducts} productos contextuales...");

        DB::disableQueryLog();

        // 1. Cargar Categorías y Marcas en memoria
        $categories = Category::select('id', 'name')->get();
        $brands = Brand::select('id', 'name')->get()->keyBy('name');

        if ($categories->isEmpty() || $brands->isEmpty()) {
            $this->command->error('Primero debes ejecutar CategorySeeder y BrandSeeder.');
            return;
        }

        // Pre-calcular marcas por categoría para optimizar el bucle interno
        $categoryContext = [
            'Laptops' => [
                'prefixes' => ['Laptop Gamer', 'Ultrabook Slim', 'Workstation Pro', 'Laptop Vivobook', 'MacBook Air Slim'],
                'min_price' => 450, 'max_price' => 2800,
                'allowed_brands' => ['HP', 'Dell', 'Apple', 'Lenovo', 'Asus', 'Acer', 'MSI']
            ],
            'Monitores' => [
                'prefixes' => ['Monitor UltraWide 34"', 'Monitor Gamer 144Hz 27"', 'Monitor 4K UHD 32"', 'Monitor Curvo 24"'],
                'min_price' => 120, 'max_price' => 950,
                'allowed_brands' => ['Samsung', 'LG', 'BenQ', 'Asus', 'Acer', 'MSI', 'Dell']
            ],
            'Teclados' => [
                'prefixes' => ['Teclado Mecánico RGB', 'Teclado Inalámbrico Silent', 'Teclado TKL Gaming', 'Teclado Ergonómico'],
                'min_price' => 25, 'max_price' => 220,
                'allowed_brands' => ['Logitech', 'Corsair', 'Razer', 'SteelSeries', 'HyperX', 'Redragon']
            ],
            'Mouses' => [
                'prefixes' => ['Mouse Gamer 16000DPI', 'Mouse Inalámbrico Ergonomico', 'Mouse Ultralight Honeycomb'],
                'min_price' => 15, 'max_price' => 160,
                'allowed_brands' => ['Logitech', 'Razer', 'SteelSeries', 'HyperX', 'Corsair']
            ],
            'Almacenamiento' => [
                'prefixes' => ['Disco SSD NVMe M.2 1TB', 'Disco Duro Externo 2TB', 'SSD SATA III 500GB', 'SSD PRO PCIe 4.0 2TB'],
                'min_price' => 35, 'max_price' => 380,
                'allowed_brands' => ['Kingston', 'Seagate', 'Western Digital', 'Samsung', 'Corsair']
            ],
            'Tarjetas Gráficas' => [
                'prefixes' => ['Tarjeta de Video RTX 4060 8GB', 'Tarjeta de Video RX 7700 XT 12GB', 'Tarjeta Gaming RTX 4080 16GB'],
                'min_price' => 280, 'max_price' => 1950,
                'allowed_brands' => ['NVIDIA', 'AMD', 'Asus', 'MSI', 'EVGA', 'Gigabyte']
            ],
            'Procesadores' => [
                'prefixes' => ['Procesador Core i7 13700K', 'Procesador Ryzen 7 7800X3D', 'Procesador Core i5 13400', 'Procesador Ryzen 5 5600X'],
                'min_price' => 110, 'max_price' => 680,
                'allowed_brands' => ['Intel', 'AMD']
            ]
        ];

        // Mapear marcas permitidas a IDs directamente para evitar filter() en cada fila
        $mappedContext = [];
        foreach ($categoryContext as $catName => $ctx) {
            $validIds = $brands->filter(fn($b) => in_array($b->name, $ctx['allowed_brands']))->pluck('id')->toArray();
            $mappedContext[$catName] = [
                'prefixes' => $ctx['prefixes'],
                'min_price' => $ctx['min_price'],
                'max_price' => $ctx['max_price'],
                'brand_ids' => !empty($validIds) ? $validIds : $brands->pluck('id')->toArray()
            ];
        }

        $defaultBrands = $brands->pluck('id')->toArray();
        $statuses = ['activo', 'activo', 'activo', 'inactivo', 'agotado'];

        $bar = $this->command->getOutput()->createProgressBar($totalProducts / $chunkSize);
        $now = now()->toDateTimeString();

        $skuCounter = 100000;

        // 3. Inserción por Lotes
        for ($i = 0; $i < $totalProducts; $i += $chunkSize) {
            $rows = [];
            $limit = min($chunkSize, $totalProducts - $i);

            for ($j = 0; $j < $limit; $j++) {
                $skuCounter++;
                $category = $categories->random();
                $catName = $category->name;

                if (isset($mappedContext[$catName])) {
                    $ctx = $mappedContext[$catName];
                    $prefix = $ctx['prefixes'][array_rand($ctx['prefixes'])];
                    $price = round(rand($ctx['min_price'] * 100, $ctx['max_price'] * 100) / 100, 2);
                    $brandId = $ctx['brand_ids'][array_rand($ctx['brand_ids'])];
                } else {
                    $prefix = $catName . ' ' . rand(100, 999);
                    $price = round(rand(2000, 50000) / 100, 2);
                    $brandId = $defaultBrands[array_rand($defaultBrands)];
                }

                $sku = 'SKU-' . $skuCounter;
                
                // UNICIDAD GARANTIZADA: Usamos el $skuCounter que es único globalmente
                $name = "{$prefix} - Mod. {$skuCounter}";
                $slug = Str::slug($prefix) . '-' . $skuCounter;

                $rows[] = [
                    'category_id' => $category->id,
                    'brand_id'    => $brandId,
                    'sku'         => $sku,
                    'name'        => $name,
                    'slug'        => $slug,
                    'description' => "Descripción detallada para el producto {$name}. Garantía de fábrica y alto rendimiento comercial.",
                    'price'       => $price,
                    'stock'       => rand(0, 350),
                    'status'      => $statuses[array_rand($statuses)],
                    'created_at'  => $now,
                    'updated_at'  => $now,
                ];
            }

            DB::table('products')->insert($rows);
            $bar->advance();
        }

        $bar->finish();
        $this->command->newLine();
        $this->command->info("¡{$totalProducts} productos generados con éxito!");
    }
}