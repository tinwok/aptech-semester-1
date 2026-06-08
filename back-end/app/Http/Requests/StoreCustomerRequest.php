<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //User
            'name' => 'required|string|max:255',
            'email' => 'email|unique:users,email|required',
            'phone' => 'required|min:10|max:15|unique:users,phone',
            'password' => 'required|string|min:8',
            'dob' => 'nullable|date',

            // customers
            'preferred_staff_id' => 'nullable|integer|exists:staffs,id',
            'preferences' => 'nullable|string',
            'allergies' => 'nullable|string'
        ];
    }
}
