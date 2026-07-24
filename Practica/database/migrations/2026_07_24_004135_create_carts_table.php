// database/migrations/2026_07_01_000004_create_carts_table.php
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
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('session_id', 100)->nullable();
            $table->enum('status', ['active', 'abandoned', 'converted'])->default('active');
            $table->decimal('total', 12, 2)->default(0);
            $table->timestamp('last_activity_at')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'status']);
            $table->index(['session_id']);
            $table->unique(['user_id', 'status'])->where('status', 'active');
        });
    }

    public function down()
    {
        Schema::dropIfExists('carts');
    }
};