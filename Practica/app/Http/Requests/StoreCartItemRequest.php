<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCartItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cart_id'    => 'required|exists:carts,id',
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
        ];
    }
}