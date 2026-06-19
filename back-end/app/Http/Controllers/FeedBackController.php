<?php

namespace App\Http\Controllers;

use App\Models\FeedBack;
use App\Models\Invoices;
use Illuminate\Http\Request;

class FeedBackController extends Controller
{
    public function index()
    {
        $feedbacks = FeedBack::with([
            'invoice.customer.user',
            'invoice.staff.users',
            'invoice.invoiceDetails.service',
        ])
            ->latest()
            ->paginate(10);

        return response()->json($feedbacks);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'invoice_id' => 'required|exists:invoices,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
        ]);

        $invoice = Invoices::findOrFail($validated['invoice_id']);

        if ($invoice->status !== 'completed') {
            return response()->json([
                'message' => 'Feedback is only allowed for completed appointments',
            ], 422);
        }

        $existingFeedback = FeedBack::where('invoice_id', $invoice->id)->first();

        if ($existingFeedback) {
            return response()->json([
                'message' => 'This invoice has already been reviewed',
            ], 422);
        }

        $feedback = FeedBack::create($validated);

        return response()->json([
            'message' => 'Feedback submitted successfully',
            'data' => $feedback,
        ], 201);
    }

    public function show(FeedBack $feedBack)
    {
        return response()->json(
            $feedBack->load([
                'invoice.customer.user',
                'invoice.staff.users',
                'invoice.invoiceDetails.service',
            ])
        );
    }

    public function edit(FeedBack $feedBack)
    {
        //
    }

    public function update(Request $request, FeedBack $feedBack)
    {
        $validated = $request->validate([
            'rating' => 'sometimes|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
        ]);

        $feedBack->update($validated);

        return response()->json([
            'message' => 'Feedback updated successfully',
            'data' => $feedBack,
        ]);
    }

    public function destroy(FeedBack $feedBack)
    {
        $feedBack->delete();

        return response()->json([
            'message' => 'Feedback deleted successfully',
        ]);
    }
}