<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    // REGISTRO
    public function register(Request $request)
    {

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
        ]);


        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'cliente'
        ]);


        $token = $user->createToken('api-token')->plainTextToken;


        return response()->json([
            'message' => 'Usuario registrado correctamente',
            'token' => $token,
            'user' => $user
        ], 201);
    }



    // LOGIN
    public function login(Request $request)
    {

        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);


        $user = User::where(
            'email',
            $validated['email']
        )->first();



        if (!$user || !Hash::check(
            $validated['password'],
            $user->password
        )) {

            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);

        }



        $token = $user->createToken('api-token')->plainTextToken;


        return response()->json([
            'message' => 'Login exitoso',
            'token' => $token,
            'user' => $user
        ]);

    }




    // LOGOUT
    public function logout(Request $request)
    {

        $request->user()
            ->currentAccessToken()
            ->delete();


        return response()->json([
            'message' => 'Sesión cerrada correctamente'
        ]);

    }




    // USUARIO ACTUAL
    public function user(Request $request)
    {

        return response()->json(
            $request->user()
        );

    }

}