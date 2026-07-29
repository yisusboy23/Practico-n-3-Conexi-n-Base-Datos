<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sku' => $this->sku,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => (float) $this->price,
            'stock' => $this->stock,
            'status' => $this->status,
            'primary_image' => $this->primary_image,
            
            // Carga relaciones solo cuando se solicitan explícitamente
            'category' => new CategoryResource($this->whenLoaded('category')),
            'brand' => new BrandResource($this->whenLoaded('brand')),
            'images' => $this->whenLoaded('images'),
            
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}