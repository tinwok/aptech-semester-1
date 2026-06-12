<?php

namespace App\Http\Controllers;

use App\Models\FeedBack;
use App\Models\Invoices;
use Illuminate\Http\Request;

class FeedBackController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $feedbacks = FeedBack::with('invoice')->latest()->paginate(10);

        return response()->json($feedbacks);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'invoice_id' => 'required|exists:invoices,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500'
        ]);

        $invoice = Invoices::findOrFail($validated['invoice_id']);

        if ($invoice->status !== 'completed') {
            return response()->json([
                'message' => 'Feedback is only allowed for completed appointments'
            ], 422);
        }

        $existingFeedback = FeedBack::where('invoice_id', $invoice->id)->first();

        if ($existingFeedback) {
            return response()->json([
                'message' => 'This invoice has already been reviewed'
            ], 422);
        }

        $feedback = FeedBack::create($validated);

        return response()->json([
            'message' => 'Feedback submitted successfully',
            'data' => $feedback
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(FeedBack $feedBack)
    {
        return response()->json($feedBack->load('invoice'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FeedBack $feedBack)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FeedBack $feedBack)
    {
        $validated = $request->validate([
            'rating' => 'sometimes|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500'
        ]);

        $feedBack->update($validated);

        return response()->json([
            'message' => 'Feedback updated successfully',
            'data' => $feedBack
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FeedBack $feedBack)
    {
        $feedBack->delete();
        return response()->json([
            'message' => 'Feedback deleted successfully'
        ]);
    }
}
