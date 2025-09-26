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
Route::get('/orders/edit/{order_id}', [AppController::class, 'getOrderDetails']);
Route::post('/orders/update-status/{order_id}', [AppController::class, 'updateOrderStatus']);
