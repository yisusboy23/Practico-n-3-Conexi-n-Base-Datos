<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BrandSeeder extends Seeder
{
    public function run()
    {
        $this->command->info('Creando marcas...');
        
        DB::disableQueryLog();
        
        $brands = [
            'HP', 'Dell', 'Apple', 'Lenovo', 'Asus', 'Acer', 'MSI',
            'Samsung', 'Sony', 'Logitech', 'Corsair', 'Kingston',
            'Seagate', 'Western Digital', 'NVIDIA', 'AMD', 'Intel',
            'BenQ', 'Epson', 'Canon', 'Brother', 'TP-Link', 'D-Link',
            'NETGEAR', 'Razer', 'SteelSeries', 'HyperX', 'Cooler Master',
            'Thermaltake', 'EVGA'
        ];
        
        foreach ($brands as $brand) {
            Brand::create([
                'name' => $brand,
                'slug' => Str::slug($brand),
                'logo_url' => null, // Sin logo para evitar errores
            ]);
        }
        
        $this->command->info('Marcas creadas exitosamente.');
    }
}