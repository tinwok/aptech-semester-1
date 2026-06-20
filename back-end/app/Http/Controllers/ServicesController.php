<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Models\ServiceInventory;
use App\Models\Services;
use Illuminate\Http\Request;
use App\Services\CloudinaryService;
use Illuminate\Support\Facades\DB;

class ServicesController extends Controller
{
    public function __construct(

        private CloudinaryService $cloudinaryService

    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $services = Services::with('invoiceDetails.invoice', 'serviceInventories.product')->latest()->paginate(10);
        return response()->json($services);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Chỉ admin mới thêm được dịch vụ
     */
    public function store(StoreServiceRequest $request)
    {
        $validated = $request->validated();

        $imageUrl = null;

        if ($request->hasFile('image')) {

            $upload = $this->cloudinaryService->upload(
                $request->file('image'),
                'services'
            );

            if (!$upload || !isset($upload['url'])) {
                return response()->json([
                    'message' => 'Upload image failed'
                ], 500);
            }

            $imageUrl = $upload['url'];
        }

        $service = DB::transaction(function () use (
            $validated,
            $imageUrl
        ) {

            $inventories = $validated['inventories'];

            unset($validated['inventories']);

            $validated['image_url'] = $imageUrl;

            $service = Services::create($validated);

            foreach ($inventories as $inventory) {

                $service->serviceInventories()->create([
                    'product_id' => $inventory['product_id'],
                    'quantity_used' => $inventory['quantity_used'],
                ]);
            }

            return $service->load(
                'serviceInventories.product'
            )->paginate(10);
        });

        return response()->json($service, 201);
    }
    /**
     * Display the specified resource.
     */
    public function show(Services $service)
    {
        return response()->json($service);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($services)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        StoreServiceRequest $request,
        string $id
    ) {
        $service = Services::findOrFail($id);
        $validated = $request->validated();
        $imageUrl = $service->image_url;

        if ($request->hasFile('image')) {
            $upload = $this->cloudinaryService->upload(
                $request->file('image'),
                'services'
            );
            if (!$upload || !isset($upload['url'])) {
                return response()->json([
                    'message' => 'Upload image failed'
                ], 500);
            }
            $imageUrl = $upload['url'];
        }

        DB::transaction(function () use (
            $service,
            $validated,
            $imageUrl
        ) {

            $inventories = $validated['inventories'];
            unset($validated['inventories']);
            $validated['image_url'] = $imageUrl;
            $service->update($validated);
            $service->serviceInventories()->delete();
            foreach ($inventories as $inventory) {
                $service->serviceInventories()->create([
                    'product_id' => $inventory['product_id'],
                    'quantity_used' => $inventory['quantity_used'],
                ]);
            }
        });
        return response()->json(
            $service->fresh()->load(
                'serviceInventories.product'
            )->paginate(10)
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Services $service)
    {
        $service->delete();
        return response()->json(['message' => "Deleted succesfully!"]);
    }
}
