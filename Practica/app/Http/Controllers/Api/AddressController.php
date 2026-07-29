<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Http\Resources\AddressResource;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index()
    {
        return AddressResource::collection(Address::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'        => 'required|integer|exists:users,id',
            'recipient_name' => 'required|string|max:150',
            'line1'          => 'required|string|max:255',
            'city'           => 'required|string|max:100',
            'state'          => 'required|string|max:100',
            'postal_code'    => 'required|string|max:20',
            'country'        => 'required|string|max:100',
            'is_default'     => 'nullable|boolean',
        ]);

        $address = Address::create($validated);

        return new AddressResource($address);
    }

    public function show(Address $address)
    {
        return new AddressResource($address);
    }

    public function update(Request $request, Address $address)
    {
        $validated = $request->validate([
            'user_id'        => 'sometimes|integer|exists:users,id',
            'recipient_name' => 'sometimes|string|max:150',
            'line1'          => 'sometimes|string|max:255',
            'city'           => 'sometimes|string|max:100',
            'state'          => 'sometimes|string|max:100',
            'postal_code'    => 'sometimes|string|max:20',
            'country'        => 'sometimes|string|max:100',
            'is_default'     => 'sometimes|boolean',
        ]);

        $address->update($validated);

        return new AddressResource($address);
    }

    public function destroy(Address $address)
    {
        $address->delete();

        return response()->json(['message' => 'Dirección eliminada con éxito'], 200);
    }
}