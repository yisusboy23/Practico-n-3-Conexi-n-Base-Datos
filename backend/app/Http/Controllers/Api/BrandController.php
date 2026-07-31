<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Http\Resources\BrandResource;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function index()
    {
        return BrandResource::collection(
            Brand::paginate(50)
        );
    }

    // Crear una nueva marca
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

    // Mostrar una marca específica
    public function show(Brand $brand)
    {
        return new BrandResource($brand);
    }

    // Actualizar una marca existente
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

    // Eliminar una marca
    public function destroy(Brand $brand)
    {
        $brand->delete();

        return response()->json(['message' => 'Marca eliminada con éxito'], 200);
    }
}