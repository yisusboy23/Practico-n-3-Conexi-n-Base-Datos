<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'brand', 'images']);

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('brand_id')) {
            $query->where('brand_id', $request->brand_id);
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        return ProductResource::collection(
            $query->paginate(15)
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|integer|exists:categories,id',
            'brand_id'    => 'required|integer|exists:brands,id',
            'sku'         => 'required|string|max:50|unique:products,sku',
            'name'        => 'required|string|max:200',
            'slug'        => 'required|string|max:220|unique:products,slug',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'status'      => 'nullable|in:activo,inactivo,agotado',
        ]);

        $product = Product::create($validated);

        return new ProductResource($product->load(['category', 'brand']));
    }

    public function show(Product $product)
    {
        return new ProductResource($product->load(['category', 'brand', 'images']));
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => 'sometimes|integer|exists:categories,id',
            'brand_id'    => 'sometimes|integer|exists:brands,id',
            'sku'         => 'sometimes|string|max:50|unique:products,sku,' . $product->id,
            'name'        => 'sometimes|string|max:200',
            'slug'        => 'sometimes|string|max:220|unique:products,slug,' . $product->id,
            'description' => 'nullable|string',
            'price'       => 'sometimes|numeric|min:0',
            'stock'       => 'sometimes|integer|min:0',
            'status'      => 'sometimes|in:activo,inactivo,agotado',
        ]);

        $product->update($validated);

        return new ProductResource($product->load(['category', 'brand']));
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(['message' => 'Producto eliminado con éxito'], 200);
    }
}