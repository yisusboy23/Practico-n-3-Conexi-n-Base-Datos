<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\ProductImageController;
use App\Http\Controllers\Api\CartItemController;


Route::get('/', function () {
    return view('welcome');
});

Route::prefix('api')->group(function () {
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('brands', BrandController::class);
    Route::apiResource('products',ProductController::class);
    Route::apiResource('carts', CartController::class);
    Route::post('carts/{cart}/items', [CartController::class, 'addItem']);
    Route::delete('carts/{cart}/clear', [CartController::class, 'clear']);
    Route::apiResource('orders', OrderController::class);
    Route::apiResource('addresses', AddressController::class);
    Route::apiResource('payments', PaymentController::class);
    Route::apiResource('users', UserController::class);
    Route::post('/checkout', [CheckoutController::class, 'store']);
    Route::get('products/{product}/images', [ProductImageController::class, 'index']);
    Route::post('products/{product}/images', [ProductImageController::class, 'store']);
    Route::get('product-images/{productImage}', [ProductImageController::class, 'show']);
    Route::put('product-images/{productImage}', [ProductImageController::class, 'update']);
    Route::delete('product-images/{productImage}', [ProductImageController::class, 'destroy']);
    Route::put('cart-items/{cartItem}', [CartItemController::class, 'update']);
    Route::delete('cart-items/{cartItem}', [CartItemController::class, 'destroy']);
});