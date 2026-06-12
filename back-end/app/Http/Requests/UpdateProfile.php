<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfile extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'phone' => [
                'required',
                'string',
                'min:10',
                'max:15',
                Rule::unique('users', 'phone')->ignore($this->user()->id),
            ],
            'dob' => 'nullable|date',
            'preferred_staff_id' => 'nullable|integer|exists:staffs,id',
            'preferences' => 'nullable|string',
            'allergies' => 'nullable|string',
        ];
    }
}