<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller; // <-- IMPORTANTE: Agregar esta línea
use App\Models\Category;
use App\Http\Resources\CategoryResource;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // Listar todo (GET /categories)
    public function index()
    {
        return CategoryResource::collection(Category::all());
    }

    // Crear (POST /categories)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'parent_id' => 'nullable|integer|exists:categories,id',
            'name' => 'required|string|max:100',
            'slug' => 'required|string|max:120|unique:categories,slug',
        ]);

        $category = Category::create($validated);

        return new CategoryResource($category);
    }

    // Mostrar uno solo (GET /categories/{category})
    public function show(Category $category)
    {
        return new CategoryResource($category);
    }

    // Editar / Actualizar (PUT /categories/{category})
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'parent_id' => 'nullable|integer|exists:categories,id',
            'name' => 'sometimes|string|max:100',
            'slug' => 'sometimes|string|max:120|unique:categories,slug,' . $category->id,
        ]);

        $category->update($validated);

        return new CategoryResource($category);
    }

    // Eliminar (DELETE /categories/{category})
    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json(['message' => 'Categoría eliminada con éxito'], 200);
    }
}