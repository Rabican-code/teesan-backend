<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::firstOrCreate(
        //     ['email' => 'test@example.com'],
        //     ['name' => 'Test User', 'password' => bcrypt('password')]
        // );

        // Category::updateOrCreate(['name' => 'Vegetables'], ['cat_image' => 'veg.png']);
        // Category::updateOrCreate(['name' => 'Electronics'], ['cat_image' => 'elec.png']);
        // Category::updateOrCreate(['name' => 'Food'], ['cat_image' => 'food.png']);
        // Category::updateOrCreate(['name' => 'Hardware'], ['cat_image' => 'hardware.png']);
        // Category::updateOrCreate(['name' => 'Kirana'], ['cat_image' => 'kirana.png']);
        // Category::updateOrCreate(['name' => 'Medical'], ['cat_image' => 'medical.png']);

        // $store1 = Store::updateOrCreate(['name' => 'Veg Store'], ['store_image' => 'veg_store.png']);
        // $store2 = Store::updateOrCreate(['name' => 'Elec Store'], ['store_image' => 'elec_store.png']);
        // $store3 = Store::updateOrCreate(['name' => 'Food Store'], ['store_image' => 'food_store.png']);

        // $product1 = Product::updateOrCreate(['name' => 'Bulb'], ['description' => 'A light bulb', 'price' => 50.00, 'product_image' => 'bulb.png']);
        // $product2 = Product::updateOrCreate(['name' => 'Potato'], ['description' => 'Fresh Potato', 'price' => 20.00, 'product_image' => 'potato.png']);
        // $product3 = Product::updateOrCreate(['name' => 'Burger'], ['description' => 'A tasty burger', 'price' => 150.00, 'product_image' => 'burger.png']);

        // $store1->products()->syncWithoutDetaching([$product2->id]);
        // $store2->products()->syncWithoutDetaching([$product1->id]);
        // $store3->products()->syncWithoutDetaching([$product3->id]);
    }
}
