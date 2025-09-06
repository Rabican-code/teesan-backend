<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ApiController;
use App\Http\Controllers\AppController;
use App\Http\Controllers\ImageController;


Route::get('/categories', [ApiController::class, 'categories']);
Route::get('/stores', [ApiController::class, 'stores']);
Route::get('/categories/{id}/stores', [ApiController::class, 'storesByCategory']);
Route::get('/stores/{id}/products', [ApiController::class, 'storeProducts']);
Route::get('/orders', [ApiController::class, 'getOrders']);
Route::get('/search', [ApiController::class, 'search']);
Route::get('/images/{type}/{filename}', [ImageController::class, 'show'])->where('filename', '.*');
Route::get('/drivers', [AppController::class, 'getDriver']);
Route::get('/users', [ApiController::class, 'getUsers']);
Route::get('/user/current', [ApiController::class, 'getCurrentUser']);

Route::post('/create-products', [ApiController::class, 'addProduct']);
Route::post('/create-stores', [ApiController::class, 'addStore']);
Route::post('/create-categories', [ApiController::class, 'addCategory']);
Route::post('/create-orders', [ApiController::class, 'addOrder']);
Route::post('/creat-drivers', [AppController::class, 'addDriver']);


Route::get('/drivers/{id}', [AppController::class, 'editDriver']);

Route::put('/drivers/{id}', [AppController::class, 'updateDriver']);

Route::get('/test', function () {
    return 'test ok';
});
