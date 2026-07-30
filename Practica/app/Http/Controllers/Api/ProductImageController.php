<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;

class ProductImageController extends Controller
{
    // Listar imágenes de un producto
    public function index(Product $product)
    {
        return response()->json($product->images);
    }

    // Agregar imagen
    public function store(Request $request, Product $product)
    {
        $validated = $request->validate([
            'url' => 'required|url|max:255',
            'is_primary' => 'nullable|boolean',
        ]);

        // Si será la principal, quitar la anterior
        if (!empty($validated['is_primary'])) {
            $product->images()->update([
                'is_primary' => false
            ]);
        }

        $image = $product->images()->create($validated);

        return response()->json($image, 201);
    }

    // Ver una imagen
    public function show(ProductImage $productImage)
    {
        return response()->json($productImage);
    }

    // Actualizar imagen
    public function update(Request $request, ProductImage $productImage)
    {
        $validated = $request->validate([
            'url' => 'sometimes|url|max:255',
            'is_primary' => 'sometimes|boolean',
        ]);

        if (($validated['is_primary'] ?? false) === true) {
            ProductImage::where('product_id', $productImage->product_id)
                ->update([
                    'is_primary' => false
                ]);
        }

        $productImage->update($validated);

        return response()->json($productImage);
    }

    // Eliminar imagen
    public function destroy(ProductImage $productImage)
    {
        $productImage->delete();

        return response()->json([
            'message' => 'Imagen eliminada con éxito'
        ], 200);
    }
}