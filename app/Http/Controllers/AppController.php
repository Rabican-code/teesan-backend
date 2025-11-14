<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Driver;
use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppController extends Controller
{

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
            'email' => 'required|email|unique:drivers,email,' . $driver->id, //  allow same email for this driver
            'phone' => 'nullable|string|max:20',
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

    public function getOrders()
    {
        $orders = Order::with(['products.stores', 'user', 'deliveryPartner'])
            ->get();

        $formatted = $orders->map(function ($order) {
            // Collect all store names from products (optional, can be removed if store_id is primary)
            $storeNames = $order->products
                ->flatMap(fn($product) => $product->stores->pluck('name'))
                ->unique()
                ->join(', ');

            return [
                'order_id' => $order->order_id,
                'store_id' => $order->store_id, // Directly from orders table
                'store' => $storeNames ?: 'N/A', // Optional: can be replaced with store name from store_id
                'status' => $order->order_status,
                'partner' => $order->deliveryPartner ? $order->deliveryPartner->name : 'N/A', // Fetch partner name
                'client' => $order->user->name ?? 'Guest',
                'date' => $order->created_at->format('Y-m-d'),
                'amount' => number_format($order->total, 2),
            ];
        });

        return response()->json($formatted);
    }

    public function getOrderDetails($order_id)
    {
        $order = Order::with(['products', 'user', 'store', 'deliveryPartner'])
            ->where('order_id', $order_id)
            ->first([
                'id',
                'user_id',
                'total',
                'order_id',
                'order_status',
                'store_id',
                'delivery_partner',
                'accepted_at',
                'in_transit_at',
                'completed_at',
                'payment_method',
                'created_at',
                'updated_at'
            ]);

        // Fetch drivers for the delivery partner dropdown
        $drivers = Driver::where('active', true)->get();

        // Map product images to full URLs
        $products = $order?->products->map(function ($product) {
            $product->product_image = $product->product_image
                ? asset("/api/images/products/" . $product->product_image)
                : null;
            return $product;
        });

        // Store image full URL
        if ($order?->store && $order->store->store_image) {
            $order->store->store_image = asset("/api/images/stores/" . $order->store->store_image);
        }

        return Inertia::render('OrderDetails', [
            'order' => $order ?? [],
            'user' => $order?->user,
            'store' => $order?->store,
            'products' => $products ?? [],
            'drivers' => $drivers ?? [],
            'deliveryPartner' => $order?->deliveryPartner,
        ]);
    }

    public function updateOrderStatus(Request $request, $order_id)
    {
        \Illuminate\Support\Facades\Log::info("updateOrderStatus called with order_id: {$order_id}", $request->all());

        $order = Order::where('order_id', $order_id)->first();

        if (!$order) {
            \Illuminate\Support\Facades\Log::error("Order not found: {$order_id}");
            return response()->json(['error' => 'Order not found'], 404);
        }

        $validated = $request->validate([
            'order_status' => 'required|string|in:Order Placed,Order Accepted,Order Shipped,Order Rejected,Driver Rejected,Driver Pending,In Transit,Completed,Cancelled',
            'delivery_partner' => 'nullable|exists:drivers,id',
            'accepted_at' => 'nullable|date',
            'in_transit_at' => 'nullable|date',
            'completed_at' => 'nullable|date',
            'payment_method' => 'nullable|string',
        ]);

        \Illuminate\Support\Facades\Log::info("Validation passed", $validated);

        $updateData = [
            'order_status' => $validated['order_status'],
            'delivery_partner' => $validated['delivery_partner'] ?? null,
        ];

        // Automatically set timestamps based on status change
        if ($validated['order_status'] === 'Order Accepted' && !$order->accepted_at) {
            $updateData['accepted_at'] = now();
        }
        if ($validated['order_status'] === 'In Transit' && !$order->in_transit_at) {
            $updateData['in_transit_at'] = now();
        }
        if ($validated['order_status'] === 'Completed' && !$order->completed_at) {
            $updateData['completed_at'] = now();
        }

        // Add timestamps if provided
        if (isset($validated['accepted_at'])) {
            $updateData['accepted_at'] = \Carbon\Carbon::parse($validated['accepted_at']);
        }
        if (isset($validated['in_transit_at'])) {
            $updateData['in_transit_at'] = \Carbon\Carbon::parse($validated['in_transit_at']);
        }
        if (isset($validated['completed_at'])) {
            $updateData['completed_at'] = \Carbon\Carbon::parse($validated['completed_at']);
        }
        if (isset($validated['payment_method'])) {
            $updateData['payment_method'] = $validated['payment_method'];
        }

        \Illuminate\Support\Facades\Log::info("Final update data", $updateData);

        try {
            $order->update($updateData);
            \Illuminate\Support\Facades\Log::info("Order updated successfully");
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Error updating order: " . $e->getMessage());
            return response()->json(['error' => 'Failed to update order'], 500);
        }

        // Reload the order to get the updated data
        $order->refresh();

        \Illuminate\Support\Facades\Log::info("Updated order data", [
            'order_status' => $order->order_status,
            'accepted_at' => $order->accepted_at,
            'in_transit_at' => $order->in_transit_at,
            'completed_at' => $order->completed_at,
        ]);

        return back()->with([
            'success' => 'Order status updated successfully',
            'updated_order' => $order,
        ]);
    }


    public function createProduct()
    {
        $stores = Store::select('id', 'name')->get();
        $categories = Category::select('id', 'name')->get();

        return Inertia::render('CreateProduct', [
            'stores' => $stores,
            'categories' => $categories,
        ]);
    }

    public function editProduct($product_id)
    {
        $product = Product::with('stores')->findOrFail($product_id);
        $stores = Store::select('id', 'name')->get();
        $categories = Category::select('id', 'name')->get();

        return Inertia::render('EditProduct', [
            'product' => $product,
            'stores' => $stores,
            'categories' => $categories,
        ]);
    }

    public function updateProduct(Request $request, $product_id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'discount_price' => 'nullable|numeric',
            'category_id' => 'nullable|exists:categories,id',
            'quantity' => 'nullable|integer',
            'description' => 'nullable|string',
            'calories' => 'nullable|string',
            'grams' => 'nullable|string',
            'fats' => 'nullable|string',
            'proteins' => 'nullable|string',
            // 'publish' => 'boolean',
            // 'nonVeg' => 'boolean',
            // 'takeaway' => 'boolean',
            'store_ids' => 'array',
            'store_ids.*' => 'integer|exists:stores,id',
            'image' => 'nullable|image|max:2048',
        ]);

        $product = Product::findOrFail($product_id);
        $product->fill([
            'name' => $validated['name'],
            'price' => $validated['price'],
            'discount_price' => $validated['discount_price'] ?? null,
            'category_id' => $validated['category_id'] ?? null,
            'quantity' => $validated['quantity'] ?? 0,
            'description' => $validated['description'] ?? null,
            'calories' => $validated['calories'] ?? null,
            'grams' => $validated['grams'] ?? null,
            'fats' => $validated['fats'] ?? null,
            'proteins' => $validated['proteins'] ?? null,
            'publish' => $request->boolean('publish'),
            'non_veg' => $request->boolean('nonVeg'),
            'takeaway' => $request->boolean('takeaway'),
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $product->product_image = $path;
        }

        $product->save();

        $product->stores()->sync($validated['store_ids'] ?? []);

        return redirect()->back()->with('success', 'Product updated successfully!');
    }

    public function editStore($product_id)
    {
        $store = Store::findOrFail($product_id);

        return Inertia::render('EditStore', [
            'store' => $store,
        ]);
    }

    public function updateStore(Request $request, $id)
    {
        $store = Store::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_ids' => 'array',
            'category_ids.*' => 'integer|exists:categories,id',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'zone' => 'nullable|string|max:100',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'description' => 'nullable|string',
            'services' => 'array',
            'delivery_charge' => 'nullable|numeric',
            'min_delivery_charge' => 'nullable|numeric',
            'min_delivery_km' => 'nullable|numeric',
            // 'active' => 'nullable|boolean',
            // 'dine_in' => 'nullable|boolean',
            // 'special_discount' => 'nullable|boolean',
            'image' => 'nullable|file|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['store_image'] = $request->file('image')->store('stores', 'public');
        }

        $store->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? $store->phone,
            'address' => $validated['address'] ?? $store->address,
            'zone' => $validated['zone'] ?? $store->zone,
            'latitude' => $validated['latitude'] ?? $store->latitude,
            'longitude' => $validated['longitude'] ?? $store->longitude,
            'description' => $validated['description'] ?? $store->description,
            'store_image' => $validated['store_image'] ?? $store->store_image,
            'delivery_charge' => $validated['delivery_charge'] ?? $store->delivery_charge,
            'min_delivery_charge' => $validated['min_delivery_charge'] ?? $store->min_delivery_charge,
            'min_delivery_km' => $validated['min_delivery_km'] ?? $store->min_delivery_km,
            // 'active' => $validated['active'] ?? $store->active,
            'dine_in' => $validated['dine_in'] ?? $store->dine_in,
            'special_discount' => $validated['special_discount'] ?? $store->special_discount,
            'services' => json_encode($validated['services'] ?? json_decode($store->services, true)),
        ]);

        if (!empty($validated['category_ids'])) {
            $store->categories()->sync($validated['category_ids']);
        }

        return response()->json([
            'message' => 'Store updated successfully',
            'store' => $store->load('categories'),
        ]);
    }


}
