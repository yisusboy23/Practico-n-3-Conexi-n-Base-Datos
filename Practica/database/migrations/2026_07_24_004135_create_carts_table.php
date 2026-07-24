// database/migrations/2026_07_01_000007_create_carts_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('session_id', 100)->nullable();
            $table->enum('status', ['activo', 'convertido', 'abandonado'])->default('activo');
            $table->timestamps();
            
            $table->index('user_id');
            $table->index('session_id');
            $table->index('status');
        });
    }

    public function down()
    {
        Schema::dropIfExists('carts');
    }
};