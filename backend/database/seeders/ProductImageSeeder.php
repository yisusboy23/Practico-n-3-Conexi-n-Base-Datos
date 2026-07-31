<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductImageSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Aumentar temporalmente el límite de memoria para el script
        ini_set('memory_limit', '512M');
        DB::disableQueryLog();

        $this->command->info("Creando imágenes de productos...");

        // Obtener el ID mínimo y máximo de la tabla de productos para iterar sin cargar todo a RAM
        $minId = DB::table('products')->min('id');
        $maxId = DB::table('products')->max('id');

        if (!$minId || !$maxId) {
            $this->command->error("No hay productos registrados para generar imágenes.");
            return;
        }

        $chunkSize = 5000; // Procesamos de a 5,000 productos por lote
        $now = now()->toDateTimeString();

        // Imágenes de ejemplo para simular variedad
        $sampleImages = [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
            'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500',
            'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500',
            'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500',
            'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500'
        ];

        $totalChunks = ceil(($maxId - $minId + 1) / $chunkSize);
        $bar = $this->command->getOutput()->createProgressBar($totalChunks);

        // 2. Iteración eficiente por rangos de IDs (No satura RAM)
        for ($currentId = $minId; $currentId <= $maxId; $currentId += $chunkSize) {
            $endId = $currentId + $chunkSize - 1;

            // Consultar solo los IDs del rango actual
            $productIds = DB::table('products')
                ->whereBetween('id', [$currentId, $endId])
                ->pluck('id');

            $rows = [];

            foreach ($productIds as $id) {
                // Generar 1 imagen principal por producto
                $rows[] = [
                    'product_id' => $id,
                    'url'        => $sampleImages[array_rand($sampleImages)],
                    'is_primary' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            // Insertar masivamente
            if (!empty($rows)) {
                DB::table('product_images')->insert($rows);
            }

            // Liberar variables de memoria manualmente por cada ciclo
            unset($rows, $productIds);

            $bar->advance();
        }

        $bar->finish();
        $this->command->newLine();
        $this->command->info("¡Imágenes de productos creadas exitosamente!");
    }
}