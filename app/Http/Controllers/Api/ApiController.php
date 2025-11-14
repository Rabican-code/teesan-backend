<?php


namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Driver;
use App\Models\Store;
use App\Models\Product;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
class ApiController extends Controller
    // Add a new category
{
    public function addCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|string',
        ]);
        $category = \App\Models\Category::create([
            'name' => $validated['name'],
            'image' => $validated['image'] ?? null,
        ]);

        return response()->json($category, 201);
    }

    public function categories()
    {
        $categories = Category::all();
        Log::info('Fetching categories:', $categories->toArray());
        return response()->json($categories);
    }

    public function stores()
    {
        $stores = Store::all();

        // Add full image URLs to stores
        $stores->transform(function ($store) {
            if ($store->store_image) {
                $store->store_image = asset("/api/images/stores/" . $store->store_image);
            }
            return $store;
        });

        Log::info('Fetching stores:', $stores->toArray());
        return response()->json($stores);
    }

    public function storesByCategory($id)
    {
        $category = Category::with('stores')->findOrFail($id);

        // Add full image URLs to stores
        $category->stores->transform(function ($store) {
            if ($store->store_image) {
                $store->store_image = asset("/api/images/stores/" . $store->store_image);
            }
            return $store;
        });

        return response()->json($category->stores);
    }
    // Fetch products for a given store
    public function storeProducts($id)
    {
        $store = Store::with('products')->findOrFail($id);

        // Add full image URLs to products
        $store->products->transform(function ($product) {
            if ($product->product_image) {
                $product->product_image = asset("/api/images/products/" . $product->product_image);
            }
            return $product;
        });

        return response()->json($store->products);
    }

    // Add a new product
    public function addProduct(Request $request)
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

        $product = new Product([
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

        if (!empty($validated['store_ids'])) {
            $product->stores()->attach($validated['store_ids']);
        }

        return response()->json($product->load(['stores', 'category']), 201);
    }

    // Add a new store
    public function addStore(Request $request)
    {
        $validated = $request->validate([
            // Admin Config
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'admin_phone' => 'nullable|string|max:20',
            'image' => 'nullable|file|image|mimes:jpg,jpeg,png|max:2048',

            // Store Details
            'name' => 'required|string|max:255',
            'category_ids' => 'array',
            'category_ids.*' => 'integer|exists:categories,id',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',

            // Location
            'zone' => 'nullable|string|max:100',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'description' => 'nullable|string',

            // Services (checkboxes)
            'services' => 'array',
            // 'services.*' => 'boolean',

            // Delivery
            'delivery_charge' => 'nullable|numeric',
            'min_delivery_charge' => 'nullable|numeric',
            'min_delivery_km' => 'nullable|numeric',

            // Toggles
            // 'active' => 'boolean',
            // 'dine_in' => 'boolean',
            // 'special_discount' => 'boolean',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('stores', 'public');
        }

        // Create the store
        $store = Store::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'zone' => $validated['zone'] ?? null,
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
            'description' => $validated['description'] ?? null,
            'store_image' => $validated['image'] ?? null,
            'delivery_charge' => $validated['delivery_charge'] ?? 0,
            'min_delivery_charge' => $validated['min_delivery_charge'] ?? 0,
            'min_delivery_km' => $validated['min_delivery_km'] ?? 0,
            'active' => $validated['active'] ?? true,
            'dine_in' => $validated['dine_in'] ?? false,
            'special_discount' => $validated['special_discount'] ?? false,
            'services' => json_encode($validated['services'] ?? []),
        ]);

        // Attach categories if provided
        if (!empty($validated['category_ids'])) {
            $store->categories()->attach($validated['category_ids']);
        }

        // Optionally: create an admin user for this store
        $user = \App\Models\User::create([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'phone' => $validated['phone'] ?? null,
        ]);

        // You could link the user to the store if you have a relation
        // $store->user_id = $user->id;
        // $store->save();

        return response()->json([
            'message' => 'Store created successfully',
            'store' => $store->load('categories'),
            'admin' => $user,
        ], 201);
    }


    // Add a new order
    public function addOrder(Request $request)
    {
        // Log the incoming request for debugging (optional)
        // Log::info('addOrder called', ['body' => $request->all()]);

        // Create the order directly
        $order = Order::create([
            'user_id' => $request->input('user_id'),
            'store_id' => $request->input('store_id'),
            'total' => $request->input('total'),
            'order_id' => $request->input('order_id'),
            'order_status' => 'Order Placed',
        ]);

        // Attach products to the order with quantities
        foreach ($request->input('items', []) as $item) {
            $order->products()->attach($item['product_id'], [
                'quantity' => $item['quantity'],
            ]);
        }

        // Return the order with attached products
        return response()->json($order->load('products'), 201);
    }

    // Retrieve all orders with their products
    public function getOrders()
    {
        $orders = Order::with(['products', 'deliveryPartner', 'user', 'store'])->get();

        $formatted = $orders->map(function ($order) {
            return [
                'order_id' => $order->order_id,
                'store' => $order->store?->name ?? 'N/A',
                'status' => $order->order_status,
                'partner' => $order->deliveryPartner?->name ?? 'No Partner',
                'client' => $order->user?->name ?? 'Guest',
                'date' => $order->created_at->format('Y-m-d'),
                'amount' => number_format($order->total, 2),
                'accepted_at' => $order->accepted_at,
                'in_transit_at' => $order->in_transit_at,
                'completed_at' => $order->completed_at,
                'payment_method' => $order->payment_method,
            ];
        });

        return response()->json($formatted);
    }

    // Retrieve all users
    public function getDrivers()
    {
        $drivers = \App\Models\Driver::where('active', true)->get();

        // Add full image URLs to drivers
        $drivers->transform(function ($driver) {
            if ($driver->image) {
                $driver->image = asset("/api/images/drivers/" . $driver->image);
            }
            return $driver;
        });

        return response()->json($drivers);
    }

    // Get the currently authenticated user
    public function getCurrentUser(Request $request)
    {
        // For now, return a mock user since authentication isn't fully set up
        // $user = auth()->user();
        $user = User::first();
        if (!$user) {
            return response()->json(['error' => 'No user found'], 404);
        }
        return response()->json($user);
    }

    public function search(Request $request)
    {
        $query = $request->input('q');

        if (!$query) {
            return response()->json(['stores' => [], 'products' => []]);
        }

        $stores = Store::where('name', 'LIKE', "%{$query}%")->get();

        // Add full image URLs to stores
        $stores->transform(function ($store) {
            if ($store->store_image) {
                $store->store_image = asset("/api/images/stores/" . $store->store_image);
            }
            return $store;
        });

        $products = Product::with('stores')->where('name', 'LIKE', "%{$query}%")->get();

        // Add full image URLs to products
        $products->transform(function ($product) {
            if ($product->product_image) {
                $product->product_image = asset("/api/images/products/" . $product->product_image);
            }
            return $product;
        });

        return response()->json(['stores' => $stores, 'products' => $products]);
    }

    public function addDriver(Request $request)
    {
        $validated = $request->validate([
            'image' => 'nullable|file|image|mimes:jpg,jpeg,png|max:2048',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:drivers,email',
            'phone' => 'nullable|string|max:20',
            'date' => 'nullable|date',
            'documents' => 'nullable|array',
            // 'active' => 'boolean',
            // 'online' => 'boolean',
            'wallet_history' => 'nullable|array',
            'total_orders' => 'integer|min:0',
        ]);

        $driver = Driver::create($validated);

        return response()->json([
            'message' => 'Driver created successfully',
            'driver' => $driver
        ], 201);
    }
    public function getProducts()
    {
        $products = Product::with(['stores', 'category'])->get();

        $formatted = $products->map(function ($product) {
            // Combine all store names
            $storeNames = $product->stores->pluck('name')->unique()->join(', ');

            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => number_format($product->price, 2),
                'image' => $product->product_image ?? null,
                'store' => $storeNames ?: 'N/A',
                'category' => $product->category->name ?? 'N/A',
                'is_published' => $product->is_published ? 'Yes' : 'No',
            ];
        });

        return response()->json($formatted);
    }



    public function getStores()
    {
        $stores = Store::select('id', 'name', 'phone', 'store_image', 'created_at', 'updated_at', 'address')->get();

        $formatted = $stores->map(function ($store) {
            return [
                'id' => $store->id,
                'name' => $store->name,
                'phone' => $store->phone ?? 'N/A',
                'store_name' => $store->name,
                'created_at' => $store->created_at ? $store->created_at->format('Y-m-d') : 'N/A',
                'updated_at' => $store->updated_at ? $store->updated_at->format('Y-m-d') : 'N/A',
                'address' => $store->address ?? 'N/A',
                'image' => $store->store_image
                    ? asset('storage/' . $store->store_image)
                    : 'https://via.placeholder.com/80?text=No+Image',
                'wallet_history' => null,
                'products' => 0,
                'orders' => 0,
            ];
        });

        return response()->json($formatted->values());
    }

}
