// database/migrations/2026_07_01_000004_create_brands_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('brands', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->string('slug', 120)->unique();
            $table->string('logo_url', 255)->nullable();
            $table->timestamps();
            
            $table->index('name');
            $table->index('slug');
        });
    }

    public function down()
    {
        Schema::dropIfExists('brands');
    }
};