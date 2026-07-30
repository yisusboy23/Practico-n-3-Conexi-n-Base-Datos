<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('user') ? $this->route('user')->id : null;

        return [
            'name'     => 'sometimes|required|string|max:150',
            'email'    => 'sometimes|required|email|max:150|unique:users,email,' . $userId,
            'password' => 'nullable|string|min:8',
            'role'     => 'sometimes|in:cliente,admin',
        ];
    }
}