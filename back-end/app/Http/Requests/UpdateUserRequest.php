<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'email' => ['email',   Rule::unique('users')->ignore($this->user->user_id)],
            'phone' => ['required', 'string', 'min:10', 'max:15', Rule::unique('users')->ignore($this->user()->id)],
            'password' => 'required|string|min:8',
            'dob' => 'nullable|date',
            'role' => 'nullable'
        ];
    }
}
