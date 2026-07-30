// database/migrations/2026_07_01_000009_create_orders_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('restrict');
            $table->foreignId('address_id')->constrained()->onDelete('restrict');
            $table->string('order_number', 30)->unique();
            $table->enum('status', ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'])->default('pendiente');
            $table->decimal('subtotal', 10, 2);
            $table->decimal('tax', 10, 2)->default(0);
            $table->decimal('shipping_cost', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            $table->timestamps();
            $table->index(['user_id', 'status']);
            $table->index('order_number');
            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('orders');
    }
};