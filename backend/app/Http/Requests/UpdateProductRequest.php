<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $productId = $this->route('product') ? $this->route('product')->id : null;

        return [
            'category_id' => 'sometimes|required|exists:categories,id',
            'brand_id'    => 'sometimes|required|exists:brands,id',
            'sku'         => 'sometimes|required|string|max:50|unique:products,sku,' . $productId,
            'name'        => 'sometimes|required|string|max:200',
            'description' => 'nullable|string',
            'price'       => 'sometimes|required|numeric|min:0',
            'stock'       => 'sometimes|required|integer|min:0',
            'status'      => 'sometimes|in:activo,inactivo,agotado',
        ];
    }
}