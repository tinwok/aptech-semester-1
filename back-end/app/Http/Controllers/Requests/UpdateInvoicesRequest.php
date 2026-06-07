<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInvoicesRequest extends FormRequest
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
            'services' => 'sometimes|array|min:1',
            'services.*.service_id' => 'sometimes|integer|exists:services,id|distinct',
            // 'services.*.quantity' => 'sometimes|integer|min:1',
            'services.*.discount' => 'nullable|numeric|between:0,100',
            'customer_id' => 'sometimes|exists:customers,id',
            'staff_id' => 'sometimes|exists:staffs,id',
            'appointment_date' => 'sometimes|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i|after:start_time',
            'note' => 'nullable|string|max:1000',
        ];
    }
}
