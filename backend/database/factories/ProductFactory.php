<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition()
    {
        $name = $this->faker->unique()->words(3, true);
        $statuses = ['activo', 'inactivo', 'agotado'];
        
        return [
            // NO creamos categoría ni marca, solo asignamos IDs existentes
            'category_id' => \App\Models\Category::inRandomOrder()->first()?->id ?? 1,
            'brand_id' => \App\Models\Brand::inRandomOrder()->first()?->id ?? 1,
            'sku' => 'SKU-' . $this->faker->unique()->numberBetween(100000, 999999),
            'name' => $name,
            'slug' => Str::slug($name . '-' . uniqid()), // Asegurar slug único
            'description' => $this->faker->paragraphs(3, true),
            'price' => $this->faker->randomFloat(2, 10, 5000),
            'stock' => $this->faker->numberBetween(0, 500),
            'status' => $this->faker->randomElement($statuses),
        ];
    }
}