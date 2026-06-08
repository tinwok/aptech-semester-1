<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCustomerRequest extends FormRequest
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
            'email' => ['email',   Rule::unique('users')->ignore($this->customer->user_id)],
            'phone' => ['nullable', 'string', 'min:10', 'max:15', Rule::unique('users', 'phone')
                ->ignore($this->customer->user_id)],
            'password' => 'nullable|string|min:8',
            'dob' => 'nullable|date',

            // customers
            'preferred_staff_id' => 'nullable|integer|exists:staffs,id',
            'preferences' => 'nullable|string|max:500',
            'allergies' => 'nullable|string|max:500'
        ];
    }
}
