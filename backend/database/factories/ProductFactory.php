<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        // 1. Usar sequence o UUID de Str para garantizar unicidad instantánea sin colisión de tiempo
        $uniqueId = Str::uuid()->toString(); 
        $productNumber = $this->faker->unique()->numberBetween(1, 1000000);
        $name = 'Producto ' . $productNumber;
        $statuses = ['activo', 'activo', 'activo', 'inactivo', 'agotado'];

        return [
            // Cargar IDs estáticos o pasarlos desde el Seeder para evitar consultas costosas
            'category_id' => $this->faker->numberBetween(1, 10), 
            'brand_id'    => $this->faker->numberBetween(1, 10),
            'sku'         => 'SKU-' . $productNumber . '-' . Str::random(4),
            'name'        => $name,
            // Con UUID aseguramos que el slug NUNCA se duplique en inserciones masivas
            'slug'        => Str::slug($name) . '-' . substr($uniqueId, 0, 8),
            'description' => $this->faker->sentence(10),
            'price'       => $this->faker->randomFloat(2, 20, 1500),
            'stock'       => $this->faker->numberBetween(0, 200),
            'status'      => $this->faker->randomElement($statuses),
            'created_at'  => now(),
            'updated_at'  => now(),
        ];
    }
}