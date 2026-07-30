<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
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


    Route::apiResource('carts', CartController::class);

    Route::post('carts/{cart}/items', 
        [CartController::class, 'addItem']
    );

    Route::delete('carts/{cart}/clear',
        [CartController::class, 'clear']
    );


    Route::apiResource('orders', OrderController::class);


    Route::apiResource('payments', PaymentController::class);


    Route::post('/checkout',
        [CheckoutController::class,'store']
    );


    Route::get('products/{product}/images',
        [ProductImageController::class,'index']
    );

    Route::post('products/{product}/images',
        [ProductImageController::class,'store']
    );

    Route::get('product-images/{productImage}',
        [ProductImageController::class,'show']
    );

    Route::put('product-images/{productImage}',
        [ProductImageController::class,'update']
    );

    Route::delete('product-images/{productImage}',
        [ProductImageController::class,'destroy']
    );

});



// ==========================
// PÚBLICAS
// ==========================

// Normalmente para una tienda:
Route::apiResource('categories', CategoryController::class)
    ->only(['index','show']);

Route::apiResource('brands', BrandController::class)
    ->only(['index','show']);

Route::apiResource('products', ProductController::class)
    ->only(['index','show']);

    Route::middleware(['auth:sanctum','role:admin'])->get('/test-admin', function () {
    return response()->json([
        'message'=>'Eres admin'
    ]);
});