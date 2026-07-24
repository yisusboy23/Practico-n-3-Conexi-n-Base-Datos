<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition()
    {
        $methods = ['tarjeta', 'paypal', 'transferencia'];
        $statuses = ['pendiente', 'aprobado', 'rechazado', 'reembolsado'];
        $weights = [0.1, 0.7, 0.1, 0.1]; // 70% aprobado
        
        return [
            'order_id' => Order::factory(),
            'method' => $this->faker->randomElement($methods),
            'transaction_id' => $this->faker->optional(0.8)->bothify('TXN-####-####-####'),
            'status' => $this->faker->randomElement($statuses, $weights),
            'amount' => function ($attributes) {
                return $attributes['order']->total ?? $this->faker->randomFloat(2, 50, 1000);
            },
            'paid_at' => $this->faker->optional(0.7)->dateTimeBetween('-2 months', 'now'),
        ];
    }
}