<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CartItemController; // 👈 AGREGA ESTA LÍNEA
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\ProductImageController;


// ==========================
// AUTENTICACIÓN
// ==========================

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // ==========================
    // RECURSOS PROTEGIDOS
    // ==========================

    Route::apiResource('users', UserController::class);
    Route::apiResource('addresses', AddressController::class);

    // CARRITO
    Route::apiResource('carts', CartController::class);
    Route::post('carts/{cart}/items', [CartController::class, 'addItem']);
    Route::delete('carts/{cart}/clear', [CartController::class, 'clear']);

    // 👇 ESTAS DOS LÍNEAS SON LAS QUE FALTABAN
    Route::put('cart-items/{cartItem}', [CartItemController::class, 'update']);
    Route::delete('cart-items/{cartItem}', [CartItemController::class, 'destroy']);

    // PEDIDOS
    Route::apiResource('orders', OrderController::class);

    // PAGOS
    Route::apiResource('payments', PaymentController::class);

    // CHECKOUT
    Route::post('/checkout', [CheckoutController::class,'store']);

    // IMÁGENES DE PRODUCTOS
    Route::get('products/{product}/images', [ProductImageController::class,'index']);
    Route::post('products/{product}/images', [ProductImageController::class,'store']);
    Route::get('product-images/{productImage}', [ProductImageController::class,'show']);
    Route::put('product-images/{productImage}', [ProductImageController::class,'update']);
    Route::delete('product-images/{productImage}', [ProductImageController::class,'destroy']);

});


// ==========================
// PÚBLICAS
// ==========================

Route::apiResource('categories', CategoryController::class)->only(['index','show']);
Route::apiResource('brands', BrandController::class)->only(['index','show']);
Route::apiResource('products', ProductController::class)->only(['index','show']);

Route::middleware(['auth:sanctum','role:admin'])->get('/test-admin', function () {
    return response()->json(['message'=>'Eres admin']);
});