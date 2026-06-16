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

        $invoice = Invoices::with('customer')->findOrFail($validated['invoice_id']);

        if ($invoice->status !== 'completed') {
            return response()->json([
                'message' => 'Feedback is only allowed for completed appointments',
            ], 422);
        }

        if ($invoice->customer?->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'You can only review your own completed appointments',
            ], 403);
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

    public function show(FeedBack $feedback)
    {
        return response()->json(
            $feedback->load([
                'invoice.customer.user',
                'invoice.staff.users',
                'invoice.invoiceDetails.service',
            ])
        );
    }

    public function update(Request $request, FeedBack $feedback)
    {
        $validated = $request->validate([
            'rating' => 'sometimes|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
        ]);

        $feedback->update($validated);

        return response()->json([
            'message' => 'Feedback updated successfully',
            'data' => $feedback,
        ]);
    }

    public function destroy(FeedBack $feedback)
    {
        $feedback->delete();

        return response()->json([
            'message' => 'Feedback deleted successfully',
        ]);
    }
}