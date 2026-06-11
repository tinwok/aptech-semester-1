<?php

namespace App\Http\Controllers;

use App\Models\Payments;
use Illuminate\Http\Request;

class PaymentsController extends Controller
{
    public function store(Request $request)

    {
        $validated = $request->validate([
            'invoice_id' => 'required|exists:invoices,id',
            'payment_method' => 'required|in:cash,banking,qr'
        ]);

        $invoice = Payments::with('invoiceDetails')
            ->findOrFail($validated['invoice_id']);
        $totalAmount = $invoice->invoiceDetails->sum('subtotal');

        $payment = Payments::create([
            'invoice_id' => $invoice->id,
            'total_amount' => $totalAmount,
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'pending'
        ]);
        return response()->json([
            'message' => 'Payment created',
            'data' => $payment
        ]);
    }
    // Khách đã chuyển khoản nhân viên xác nhận
    public function paid(String $id)
    {
        $payment = Payments::findOrFail($id);

        $payment->update([
            'payment_status' => 'paid'
        ]);

        return response()->json([
            'message' => 'Payment successful'
        ]);
    }
    public function qrInfo()
    {
        return response()->json([
            'bank_name' => env('BANK_NAME'),
            'account_number' => env('ACCOUNT_NUMBER'),
            'account_name' => env('ACCOUNT_NAME')
        ]);
    }
}
