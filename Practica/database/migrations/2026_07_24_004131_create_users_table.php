// database/migrations/2026_07_01_000001_create_users_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('email', 150)->unique();
            $table->string('password', 255);
            $table->enum('role', ['cliente', 'admin'])->default('cliente');
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamps();
            
            $table->index('email');
            $table->index('role');
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
};