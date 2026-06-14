<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreInvoiceRequest extends FormRequest
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
            'services' => 'required|array|min:1',
            'services.*.service_id' => 'required|integer|exists:services,id|distinct',
            'services.*.discount' => 'nullable|numeric|between:0,100',
            'customer_id' => 'required|exists:customers,id',
            'staff_id' => 'nullable|exists:staffs,id',
            'appointment_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'note' => 'nullable|string|max:1000',
        ];
    }
}
