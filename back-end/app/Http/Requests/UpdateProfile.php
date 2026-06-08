<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProfile extends FormRequest
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
            // user
            'dob' => 'nullable|date',
            'preferred_staff_id' => 'sometimes|integer|exists:staffs,id',
            'preferences' => 'sometimes|string',
            'allergies' => 'sometimes|string'
        ];
    }
}
