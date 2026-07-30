<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Http\Resources\OrderResource;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    // Listar órdenes paginadas
    public function index()
    {
        $orders = Order::with(['items.product', 'address', 'payment'])->paginate(15);
        return OrderResource::collection($orders);
    }

    // Crear una nueva orden
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'       => 'required|integer|exists:users,id',
            'address_id'    => 'required|integer|exists:addresses,id',
            'subtotal'      => 'required|numeric|min:0',
            'tax'           => 'nullable|numeric|min:0',
            'shipping_cost' => 'nullable|numeric|min:0',
            'total'         => 'required|numeric|min:0',
            'status'        => 'nullable|in:pendiente,pagado,enviado,entregado,cancelado',
        ]);

        // Generar un número de orden único automáticamente si no viene en el Request
        $validated['order_number'] = 'ORD-' . strtoupper(Str::random(10));

        $order = Order::create($validated);

        return new OrderResource($order->load(['address']));
    }

    // Ver una orden específica
    public function show(Order $order)
    {
        return new OrderResource($order->load(['items.product', 'address', 'payment']));
    }

    // Actualizar estado o datos de una orden
    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status'        => 'sometimes|in:pendiente,pagado,enviado,entregado,cancelado',
            'address_id'    => 'sometimes|integer|exists:addresses,id',
            'shipping_cost' => 'sometimes|numeric|min:0',
            'total'         => 'sometimes|numeric|min:0',
        ]);

        $order->update($validated);

        return new OrderResource($order->load(['items.product', 'address', 'payment']));
    }

    // Eliminar/Cancelar orden
    public function destroy(Order $order)
    {
        $order->delete();

        return response()->json(['message' => 'Orden eliminada con éxito'], 200);
    }
}