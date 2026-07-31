<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use App\Http\Resources\CartResource;
use Illuminate\Http\Request;

class CartController extends Controller
{
    // Obtener un carrito por su ID (o crearlo si no existe)
    public function show($id)
    {
        $cart = Cart::with('items.product')->findOrFail($id);
        return new CartResource($cart);
    }

    // Crear un nuevo carrito
    // backend/app/Http/Controllers/Api/CartController.php

    public function store(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'message' => 'Usuario no autenticado'
            ], 401);
        }

        // Buscar carrito activo existente
        $cart = Cart::where('user_id', $user->id)
                    ->where('status', 'activo')
                    ->first();

        if ($cart) {
            return new CartResource($cart);
        }

        // Crear nuevo carrito
        $cart = Cart::create([
            'user_id' => $user->id,
            'status' => 'activo'
        ]);

        return new CartResource($cart);
    }

    // Agregar un producto al carrito
// backend/app/Http/Controllers/Api/CartController.php

    public function addItem(Request $request, Cart $cart)
    {
        // Verificar que el carrito pertenece al usuario autenticado
        if ($cart->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'No tienes permiso para modificar este carrito'
            ], 403);
        }

        $validated = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($validated['product_id']);
        $cart->addItem($product, $validated['quantity']);

        return new CartResource($cart->load('items.product'));
    }

    // Vaciar el carrito
    public function clear(Cart $cart)
    {
        $cart->clear();
        return response()->json(['message' => 'Carrito vaciado con éxito'], 200);
    }
}