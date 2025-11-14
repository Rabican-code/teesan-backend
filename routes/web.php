<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ApiController;
use App\Http\Controllers\AppController;
use App\Models\Order;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
Route::get('/', function () {
    return Inertia::render('Dashboard');
});

Auth::routes();
Route::get('/drivers', function () {
    return Inertia::render('Driver');
});
Route::get('/orders', function () {
    return Inertia::render('Order');
});
Route::get('/products', function () {
    return Inertia::render('Products');
});
Route::get('/stores', function () {
    return Inertia::render('Stores');
});
Route::get('/drivers/createDriverPage', function () {
    return Inertia::render('CreateDriver');
});

Route::get('/products/createProductsPage', [AppController::class, 'createProduct']);

Route::get('/orders/edit/{order_id}', [AppController::class, 'getOrderDetails']);
Route::post('/orders/update-status/{order_id}', [AppController::class, 'updateOrderStatus']);

Route::get('/product/edit/{product_id}', [AppController::class, 'editProduct']);
Route::post('/product/update/{product_id}', [AppController::class, 'updateProduct']);

Route::get('/store/edit/{product_id}', [AppController::class, 'editStore']);
Route::post('/store/update/{store_id}', [AppController::class, 'updateStore']);

Route::get('/create-store-page', function () {
    return Inertia::render('CreateStore');
});
