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
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|integer|exists:users,id',
            'session_id' => 'nullable|string|max:100',
        ]);

        $cart = Cart::create($validated);

        return new CartResource($cart);
    }

    // Agregar un producto al carrito
    public function addItem(Request $request, Cart $cart)
    {
        $validated = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        // Usa el método de negocio definido en tu modelo Cart
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