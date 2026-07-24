// database/migrations/2026_07_01_000005_create_products_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('restrict');
            $table->foreignId('brand_id')->constrained()->onDelete('restrict');
            $table->string('sku', 50)->unique();
            $table->string('name', 200);
            $table->string('slug', 220)->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('stock')->default(0);
            $table->enum('status', ['activo', 'inactivo', 'agotado'])->default('activo');
            $table->timestamps();
            
            // Índices críticos para 500k filas
            $table->index(['category_id', 'status']);
            $table->index(['brand_id', 'status']);
            $table->index('status');
            $table->index('sku');
            $table->index('slug');
            
            // Check constraints (MySQL 8.0+ or using DB::statement)
            // $table->check('price >= 0');
            // $table->check('stock >= 0');
        });
        
        // Agregar check constraints usando DB::statement para compatibilidad
        DB::statement('ALTER TABLE products ADD CONSTRAINT check_price_non_negative CHECK (price >= 0)');
        DB::statement('ALTER TABLE products ADD CONSTRAINT check_stock_non_negative CHECK (stock >= 0)');
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
};