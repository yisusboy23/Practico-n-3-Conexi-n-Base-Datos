<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'address_id' => $this->address_id,
            'order_number' => $this->order_number,
            'status' => $this->status,
            'status_badge' => $this->status_badge,
            'subtotal' => (float) $this->subtotal,
            'tax' => (float) $this->tax,
            'shipping_cost' => (float) $this->shipping_cost,
            'total' => (float) $this->total,
            'can_be_cancelled' => $this->canBeCancelled(),
            'is_paid' => $this->isPaid(),
            
            // Relaciones opcionales/cargadas
            'items' => $this->whenLoaded('items', function () {
                return $this->items->map(fn($item) => [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name ?? null,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'subtotal' => (float) $item->subtotal,
                ]);
            }),
            'address' => $this->whenLoaded('address'),
            'payment' => $this->whenLoaded('payment'),
            
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}