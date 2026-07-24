<?php

namespace Database\Factories;

use App\Models\Brand;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class BrandFactory extends Factory
{
    protected $model = Brand::class;

    public function definition()
    {
        static $brands = [
            'HP', 'Dell', 'Apple', 'Lenovo', 'Asus', 'Acer', 'MSI',
            'Samsung', 'Sony', 'Logitech', 'Corsair', 'Kingston',
            'Seagate', 'Western Digital', 'NVIDIA', 'AMD', 'Intel',
            'BenQ', 'Epson', 'Canon', 'Brother', 'TP-Link', 'D-Link',
            'NETGEAR', 'Razer', 'SteelSeries', 'HyperX'
        ];
        
        static $index = 0;
        
        $name = $brands[$index % count($brands)];
        $index++;
        
        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'logo_url' => $this->faker->optional()->imageUrl(200, 200, 'business'),
        ];
    }
}