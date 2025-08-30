<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ApiController;
use App\Http\Controllers\AppController;
use App\Http\Controllers\ImageController;


Route::middleware('api')->get('/categories', [ApiController::class, 'categories']);
Route::middleware('api')->get('/stores', [ApiController::class, 'stores']);
Route::middleware('api')->get('/categories/{id}/stores', [ApiController::class, 'storesByCategory']);
Route::middleware('api')->get('/stores/{id}/products', [ApiController::class, 'storeProducts']);
Route::middleware('api')->get('/orders', [ApiController::class, 'getOrders']);
Route::middleware('api')->get('/search', [ApiController::class, 'search']);
Route::middleware('api')->get('/images/{type}/{filename}', [ImageController::class, 'show'])->where('filename', '.*');
Route::get('/drivers', [AppController::class, 'getDriver']);


Route::get('/users', [ApiController::class, 'getUsers']);
Route::get('/user/current', [ApiController::class, 'getCurrentUser']);
Route::middleware('api')->post('/create-products', [ApiController::class, 'addProduct']);
Route::middleware('api')->post('/create-stores', [ApiController::class, 'addStore']);
Route::middleware('api')->post('/create-categories', [ApiController::class, 'addCategory']);
Route::middleware('api')->post('/create-orders', [ApiController::class, 'addOrder']);
Route::post('/creat-drivers', [AppController::class, 'addDriver']);


Route::get('/drivers/{id}', [AppController::class, 'editDriver']);

Route::put('/drivers/{id}', [AppController::class, 'updateDriver']);

Route::get('/test', function () {
    return 'test ok';
});
