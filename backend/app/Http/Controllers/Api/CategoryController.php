<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Http\Resources\CategoryResource;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request) // ✅ AGREGAR $request
    {
        $query = Category::with('parent.parent.parent');

        // 🔍 BÚSQUEDA POR NOMBRE
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $perPage = $request->input('per_page', 15);
        $page = $request->input('page', 1);

        $categories = $query->paginate($perPage, ['*'], 'page', $page);

        // ✅ DEVOLVER PAGINACIÓN COMPLETA
        return response()->json([
            'data' => CategoryResource::collection($categories),
            'current_page' => $categories->currentPage(),
            'last_page' => $categories->lastPage(),
            'per_page' => $categories->perPage(),
            'total' => $categories->total(),
        ]);
    }

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

    public function show(Category $category)
    {
        return new CategoryResource($category);
    }

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

    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json(['message' => 'Categoría eliminada con éxito'], 200);
    }
}