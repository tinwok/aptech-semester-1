<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreStaff extends FormRequest
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
            'name' => 'required|string|max:255',
            'email' => 'email|unique:users,email',
            'phone' => 'required|string|min:10|max:15|unique:users,phone',
            'password' => 'required|string|min:8',
            'dob' => 'nullable|date',
            //staff
            'user_id' => 'integer|exists:users,id|unique:staffs,user_id',
            'position' => 'required|string|in:baber,stylist,manager,receptionist',
            'shift' => 'required|string|max:255',
            'salary' => 'required|numeric|min:0',
            'status' => 'required|in:active,inactive,blocked',
        ];
    }
}
