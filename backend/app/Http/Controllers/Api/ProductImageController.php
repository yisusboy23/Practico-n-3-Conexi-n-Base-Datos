<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductImageController extends Controller
{
    // Listar imágenes de un producto
    public function index(Product $product)
    {
        return response()->json($product->images);
    }

    // Agregar imagen (Soporta SUBIDA DE ARCHIVO o URL directa)
    public function store(Request $request, Product $product)
    {
        $validated = $request->validate([
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // Para subida de archivo
            'url' => 'nullable|url|max:255',                               // Para URL externa
            'is_primary' => 'nullable|boolean',
        ]);

        // Debe enviar al menos un archivo o una URL
        if (!$request->hasFile('image') && empty($validated['url'])) {
            return response()->json([
                'message' => 'Debes proporcionar un archivo de imagen o una URL válida.'
            ], 422);
        }

        // Si se sube un archivo físico, se guarda en storage/app/public/products
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $imageUrl = Storage::url($path);
        } else {
            $imageUrl = $validated['url'];
        }

        $isPrimary = $request->boolean('is_primary', false);

        // Si esta imagen será la principal, quitamos la marca de las anteriores
        if ($isPrimary) {
            $product->images()->update(['is_primary' => false]);
        }

        $image = $product->images()->create([
            'url' => $imageUrl,
            'is_primary' => $isPrimary,
        ]);

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
                ->update(['is_primary' => false]);
        }

        $productImage->update($validated);

        return response()->json($productImage);
    }

    // Eliminar imagen (Limpia también el almacenamiento local si aplica)
    public function destroy(ProductImage $productImage)
    {
        // Si la imagen fue subida localmente (/storage/products/...), borramos el archivo físico
        if (str_contains($productImage->url, '/storage/')) {
            $relativePath = str_replace('/storage/', '', parse_url($productImage->url, PHP_URL_PATH));
            if (Storage::disk('public')->exists($relativePath)) {
                Storage::disk('public')->delete($relativePath);
            }
        }

        $productImage->delete();

        return response()->json([
            'message' => 'Imagen eliminada con éxito'
        ], 200);
    }
}