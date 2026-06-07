<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Models\Services;
use Illuminate\Http\Request;
use App\Services\CloudinaryService;

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
        $services = Services::latest()->paginate(10);
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
        $imageUrl = null;
        $validated = $request->validated();
        if ($request->hasFile('image')) {
            $upload = $this->cloudinaryService->upload($request->file('image'), 'services');
            $imageUrl = $upload['url'];
        }
        $validated['image_url'] = $imageUrl;
        $services = Services::create($validated);
        return response()->json($services, 201);
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
    public function update(UpdateServiceRequest $request, Services $service)
    {
        $imageUrl = $service->image_url;
        $validated = $request->validated();
        if ($request->hasFile('image')) {
            $upload = $this->cloudinaryService->upload($request->file('image'), 'services');
            $imageUrl = $upload['url'];
        }
        $validated['image_url'] =  $imageUrl;
        $service->update($validated);
        return response()->json($service, 201);
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
