<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductImageFactory extends Factory
{
    protected $model = ProductImage::class;

    public function definition()
    {
        return [
            'product_id' => Product::factory(),
            'url' => $this->faker->imageUrl(400, 400, 'electronics'),
            'is_primary' => $this->faker->boolean(10),
        ];
    }
}