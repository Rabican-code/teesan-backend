<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Pricing
            $table->decimal('discount_price', 10, 2)->nullable()->after('price');

            // Relations
            $table->unsignedBigInteger('category_id')->nullable()->after('discount_price');
            $table->integer('quantity')->default(0)->after('category_id');

            // Nutrition / ingredients
            $table->string('calories')->nullable()->after('quantity');
            $table->string('grams')->nullable()->after('calories');
            $table->string('fats')->nullable()->after('grams');
            $table->string('proteins')->nullable()->after('fats');

            // Flags
            $table->boolean('publish')->default(false)->after('proteins');
            $table->boolean('non_veg')->default(false)->after('publish');
            $table->boolean('takeaway')->default(false)->after('non_veg');

            // Foreign key for category (optional)
            $table->foreign('category_id')->references('id')->on('categories')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn([
                'discount_price',
                'category_id',
                'quantity',
                'calories',
                'grams',
                'fats',
                'proteins',
                'publish',
                'non_veg',
                'takeaway',
            ]);
        });
    }
};
