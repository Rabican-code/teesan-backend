<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppController extends Controller
{
    public function addDriver(Request $request)
    {
        $validated = $request->validate([
            'image' => 'nullable|string|max:255',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:drivers,email',
            'date' => 'nullable|date',
            'documents' => 'nullable|array',
            'active' => 'boolean',
            'online' => 'boolean',
            'wallet_history' => 'nullable|array',
            'total_orders' => 'integer|min:0',
        ]);

        $driver = Driver::create($validated);

        return response()->json([
            'message' => 'Driver created successfully',
            'driver' => $driver
        ], 201);
    }

    public function getDrivers()
    {
        $drivers = Driver::all();
        return response()->json($drivers);
    }

    public function editDriver($id)
    {
        $driver = Driver::findOrFail($id);

        return response()->json([
            'driver' => $driver
        ]);
    }

    public function updateDriver(Request $request, $id)
    {
        $driver = Driver::findOrFail($id);

        $validated = $request->validate([
            'image' => 'nullable|string|max:255',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:drivers,email,' . $driver->id, // 👈 allow same email for this driver
            'date' => 'nullable|date',
            'documents' => 'nullable|array',
            'active' => 'boolean',
            'online' => 'boolean',
            'wallet_history' => 'nullable|array',
            'total_orders' => 'integer|min:0',
        ]);

        $driver->update($validated);

        return response()->json([
            'message' => 'Driver updated successfully',
            'driver' => $driver
        ]);
    }
}
