<?php

namespace App\Http\Controllers;

use App\Models\Inventory_transactions;
use App\Models\Invoices;
use App\Models\Products;
use Carbon\Carbon;
use Illuminate\Http\Request;

class StatsController extends Controller
{

    public function salesReport(Request $request)
    {
        $type = $request->get('type', 'daily');

        $invoices = Invoices::all();
        $grouped = $invoices->groupBy(function ($item) use ($type) {

            $date = Carbon::parse($item->created_at);

            return match ($type) {
                'weekly'  => $date->format('Y-W'),
                'monthly' => $date->format('Y-m'),
                'yearly'  => $date->format('Y'),
                default   => $date->format('Y-m-d'),
            };
        });

        $result = $grouped->map(function ($items, $period) {
            return [
                'period' => $period,
                'total_orders' => $items->count(),
                'revenue' => $items->sum('total_price'),
            ];
        })->values();

        return response()->json($result);
    }
    public function inventoryReport()
    {
        $import = Inventory_transactions::where('type', 'import')->sum('quantity');
        $export = Inventory_transactions::where('type', 'export')->sum('quantity');
        $waste  = Inventory_transactions::where('type', 'waste')->sum('quantity');

        $lowStock = Products::where('current_quantity', '<', 10)->get();

        return response()->json([
            'import' => $import,
            'export' => $export,
            'waste' => $waste,
            'low_stock_products' => $lowStock
        ]);
    }
    public function serviceTrend()
    {
        $invoices = Invoices::with('invoiceDetails.service')->get();
        $items = collect();
        foreach ($invoices as $invoice) {
            foreach ($invoice->invoiceDetails as $detail) {
                $items->push([
                    'service_name' => $detail->service->name ?? 'Unknown',
                    'quantity' => $detail->quantity,
                ]);
            }
        }

        $grouped = $items->groupBy('service_name');

        $result = $grouped->map(function ($items, $name) {
            return [
                'service' => $name,
                'total_sold' => $items->sum('quantity'),
            ];
        })->sortByDesc('total_sold')->values();

        return response()->json([
            'most_popular' => $result->first(),
            'least_popular' => $result->last(),
            'all' => $result
        ]);
    }
}
