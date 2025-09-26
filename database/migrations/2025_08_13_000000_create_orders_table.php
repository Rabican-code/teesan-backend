<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->decimal('total', 10, 2)->default(0);
            $table->string('order_id')->nullable();
            $table->integer('store_id')->nullable();
            $table->string('order_status')->default('Order Placed');
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('in_transit_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->string('payment_method')->default('cash on delivery');
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
