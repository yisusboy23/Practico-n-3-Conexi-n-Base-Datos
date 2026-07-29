<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'method' => $this->method,
            'transaction_id' => $this->transaction_id,
            'status' => $this->status,
            'amount' => (float) $this->amount,
            'paid_at' => $this->paid_at?->toDateTimeString(),
            'is_approved' => $this->isApproved(),
            'can_be_refunded' => $this->canBeRefunded(),
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}