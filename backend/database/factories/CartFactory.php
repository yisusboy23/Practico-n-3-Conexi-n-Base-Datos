<?php

namespace Database\Factories;

use App\Models\Cart;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CartFactory extends Factory
{
    protected $model = Cart::class;

    public function definition()
    {
        return [
            'user_id' => $this->faker->optional(0.7)->passthrough(User::factory()),
            'session_id' => $this->faker->optional(0.3)->uuid,
            'status' => $this->faker->randomElement(['activo', 'convertido', 'abandonado']),
        ];
    }
}