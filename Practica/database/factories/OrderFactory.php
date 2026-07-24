<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition()
    {
        $statuses = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];
        $weights = [0.2, 0.3, 0.2, 0.25, 0.05]; // 20% pendiente, 30% pagado, etc.
        
        $subtotal = $this->faker->randomFloat(2, 50, 1000);
        $tax = $subtotal * 0.18;
        $shippingCost = $this->faker->randomFloat(2, 5, 30);
        $total = $subtotal + $tax + $shippingCost;
        
        return [
            'user_id' => User::factory(),
            'address_id' => Address::factory(),
            'order_number' => 'ORD-' . $this->faker->unique()->numerify('####-####'),
            'status' => $this->faker->randomElement($statuses, $weights),
            'subtotal' => $subtotal,
            'tax' => $tax,
            'shipping_cost' => $shippingCost,
            'total' => $total,
            'created_at' => $this->faker->dateTimeBetween('-3 months', 'now'),
        ];
    }
}