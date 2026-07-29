<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Http\Resources\PaymentResource;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        return PaymentResource::collection(Payment::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id'       => 'required|integer|exists:orders,id|unique:payments,order_id',
            'method'         => 'required|in:tarjeta,paypal,transferencia',
            'transaction_id' => 'nullable|string|max:100',
            'status'         => 'nullable|in:pendiente,aprobado,rechazado,reembolsado',
            'amount'         => 'required|numeric|min:0',
            'paid_at'        => 'nullable|date',
        ]);

        $payment = Payment::create($validated);

        return new PaymentResource($payment);
    }

    public function show(Payment $payment)
    {
        return new PaymentResource($payment);
    }

    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'method'         => 'sometimes|in:tarjeta,paypal,transferencia',
            'transaction_id' => 'nullable|string|max:100',
            'status'         => 'sometimes|in:pendiente,aprobado,rechazado,reembolsado',
            'amount'         => 'sometimes|numeric|min:0',
            'paid_at'        => 'nullable|date',
        ]);

        $payment->update($validated);

        return new PaymentResource($payment);
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();

        return response()->json(['message' => 'Registro de pago eliminado con éxito'], 200);
    }
}