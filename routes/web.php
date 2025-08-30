<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ApiController;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
Route::get('/', function () {
    return Inertia::render('Home');
});

Auth::routes();
Route::get('/drivers', function () {
    return Inertia::render('Driver');
});
