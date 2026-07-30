<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Address;
use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'cart_id'    => 'required|integer|exists:carts,id',
            'address_id' => 'required|integer|exists:addresses,id',
        ]);

        $cart = Cart::with('items.product')->findOrFail($validated['cart_id']);
        $address = Address::findOrFail($validated['address_id']);

        if ($cart->items->isEmpty()) {
            return response()->json(['message' => 'El carrito está vacío'], 422);
        }

        $order = DB::transaction(function () use ($cart, $address) {
            $items = $cart->items()->with('product')->lockForUpdate()->get();

            $subtotal = 0;
            $lines = [];

            foreach ($items as $item) {
                $product = $item->product;

                if ($product->stock < $item->quantity) {
                    abort(422, "Sin stock suficiente para: {$product->name}");
                }

                $rowSubtotal = $product->price * $item->quantity;
                $subtotal += $rowSubtotal;

                $lines[] = [
                    'product_id' => $product->id,
                    'quantity'   => $item->quantity,
                    'unit_price' => $product->price,
                    'subtotal'   => $rowSubtotal,
                ];

                $product->decrement('stock', $item->quantity);
            }

            $tax = round($subtotal * 0.13, 2);
            $shipping = 15.00;

            $order = Order::create([
                'user_id'       => $cart->user_id,
                'address_id'    => $address->id,
                'order_number'  => 'ORD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6)),
                'status'        => 'pendiente',
                'subtotal'      => $subtotal,
                'tax'           => $tax,
                'shipping_cost' => $shipping,
                'total'         => $subtotal + $tax + $shipping,
            ]);

            $order->items()->createMany($lines);
            $cart->items()->delete();
            $cart->update(['status' => 'convertido']);

            return $order;
        });

        return new OrderResource($order->load(['items.product', 'address']));
    }
}