<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStaffRequest extends FormRequest
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
            'name' => 'nullable|string|max:255',
            'email' => ['email', Rule::unique('users', 'email')
                ->ignore($this->staff->user_id)],
            'phone' => ['nullable', 'string', 'min:10', 'max:15', Rule::unique('users', 'phone')
                ->ignore($this->staff->user_id)],
            'password' => 'nullable|string|min:8',
            'dob' => 'nullable|date',
            //staff
            'position' => 'nullable|string|in:baber,stylist,manager,receptionist',
            'shift' => 'nullable|string',
            'salary' => 'nullable|numeric|min:0',
            'status' => 'nullable|in:active,inactive,blocked',
        ];
    }
}
