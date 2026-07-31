<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Http\Resources\BrandResource;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function index(Request $request) // ✅ AGREGAR $request
    {
        $query = Brand::query();

        // 🔍 BÚSQUEDA POR NOMBRE
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $perPage = $request->input('per_page', 15);
        $page = $request->input('page', 1);

        $brands = $query->paginate($perPage, ['*'], 'page', $page);

        // ✅ DEVOLVER PAGINACIÓN COMPLETA
        return response()->json([
            'data' => BrandResource::collection($brands),
            'current_page' => $brands->currentPage(),
            'last_page' => $brands->lastPage(),
            'per_page' => $brands->perPage(),
            'total' => $brands->total(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:brands,name',
            'slug' => 'required|string|max:120|unique:brands,slug',
            'logo_url' => 'nullable|url|max:255',
        ]);

        $brand = Brand::create($validated);

        return new BrandResource($brand);
    }

    public function show(Brand $brand)
    {
        return new BrandResource($brand);
    }

    public function update(Request $request, Brand $brand)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:100|unique:brands,name,' . $brand->id,
            'slug' => 'sometimes|string|max:120|unique:brands,slug,' . $brand->id,
            'logo_url' => 'nullable|url|max:255',
        ]);

        $brand->update($validated);

        return new BrandResource($brand);
    }

    public function destroy(Brand $brand)
    {
        $brand->delete();

        return response()->json(['message' => 'Marca eliminada con éxito'], 200);
    }
}