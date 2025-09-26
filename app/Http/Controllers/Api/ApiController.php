<?php


namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\Category;
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
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'store_ids' => 'array',
            'store_ids.*' => 'integer|exists:stores,id',
        ]);

        $product = \App\Models\Product::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
        ]);

        if (!empty($validated['store_ids'])) {
            $product->stores()->attach($validated['store_ids']);
        }

        return response()->json($product->load('stores'), 201);
    }

    // Add a new store
    public function addStore(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_ids' => 'array',
            'category_ids.*' => 'integer|exists:categories,id',
        ]);

        $store = Store::create([
            'name' => $validated['name'],
        ]);

        if (!empty($validated['category_ids'])) {
            $store->categories()->attach($validated['category_ids']);
        }

        return response()->json($store->load('categories'), 201);
    }

    // Add a new order
    public function addOrder(Request $request)
    {
        Log::info('addOrder called', ['body' => $request->all()]);
        $validated = $request->validate([
            'user_id' => 'nullable|integer|exists:users,id',
            'store_id' => 'required|integer|exists:stores,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'total' => 'required|numeric',
            'order_id' => 'required|string|unique:orders,order_id',
        ]);

        Log::info('Validated order', $validated);
        $order = Order::create([
            'user_id' => $validated['user_id'] ?? null,
            'store_id' => $validated['store_id'],
            'total' => $validated['total'],
            'order_id' => $validated['order_id'],
            'order_status' => 'Order Placed',
        ]);
        Log::info('Order created', ['order' => $order]);

        // Attach products to the order with quantities
        foreach ($validated['items'] as $item) {
            $order->products()->attach($item['product_id'], ['quantity' => $item['quantity']]);
        }
        Log::info('Products attached to order', ['order_id' => $order->id]);

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
}
