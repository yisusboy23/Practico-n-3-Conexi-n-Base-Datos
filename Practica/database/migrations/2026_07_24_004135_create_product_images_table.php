// database/migrations/2026_07_01_000006_create_product_images_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('url', 255);
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
            
            $table->index('product_id');
            $table->index('is_primary');
        });
    }

    public function down()
    {
        Schema::dropIfExists('product_images');
    }
};