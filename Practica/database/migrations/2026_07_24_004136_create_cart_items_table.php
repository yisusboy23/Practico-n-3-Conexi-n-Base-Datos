// database/migrations/2026_07_01_000008_create_cart_items_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->integer('quantity');
            $table->decimal('unit_price', 10, 2);
            $table->timestamps();
            
            // Un único producto por carrito (regla de negocio)
            $table->unique(['cart_id', 'product_id']);
            $table->index(['cart_id', 'product_id']);
            
        });
    }

    public function down()
    {
        Schema::dropIfExists('cart_items');
    }
};