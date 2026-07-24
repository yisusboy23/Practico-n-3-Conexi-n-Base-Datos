<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentSeeder extends Seeder
{
    public function run()
    {
        $this->command->info('Creando pagos...');
        
        DB::disableQueryLog();
        
        $orderIds = Order::pluck('id')->toArray();
        $payments = [];
        
        foreach ($orderIds as $orderId) {
            $order = Order::find($orderId);
            
            $payments[] = [
                'order_id' => $orderId,
                'method' => $this->randomElement(['tarjeta', 'paypal', 'transferencia']),
                'transaction_id' => 'TXN-' . $this->uniqueTransactionId(),
                'status' => $this->randomElement(['pendiente', 'aprobado', 'rechazado', 'reembolsado']),
                'amount' => $order ? $order->total : rand(50, 1000),
                'paid_at' => $this->randomDateBetween('-2 months', 'now'),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        
        foreach (array_chunk($payments, 5000) as $chunk) {
            Payment::insert($chunk);
        }
        
        $this->command->info(count($payments) . ' pagos creados.');
    }
    
    private function randomElement($array)
    {
        return $array[array_rand($array)];
    }
    
    private $transactionCounter = 0;
    private function uniqueTransactionId()
    {
        $this->transactionCounter++;
        return str_pad($this->transactionCounter, 12, '0', STR_PAD_LEFT);
    }
    
    private function randomDateBetween($start, $end)
    {
        $start = strtotime($start);
        $end = strtotime($end);
        $timestamp = mt_rand($start, $end);
        return date('Y-m-d H:i:s', $timestamp);
    }
}
