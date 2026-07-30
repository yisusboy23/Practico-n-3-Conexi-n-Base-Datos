<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id'        => 'required|exists:users,id',
            'recipient_name' => 'required|string|max:150',
            'line1'          => 'required|string|max:255',
            'city'           => 'required|string|max:100',
            'state'          => 'required|string|max:100',
            'postal_code'    => 'required|string|max:20',
            'country'        => 'required|string|max:100',
            'is_default'     => 'boolean',
        ];
    }
}