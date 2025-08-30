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
        Log::info('Fetching stores:', $stores->toArray());
        return response()->json($stores);
    }

    public function storesByCategory($id)
    {
        $category = Category::with('stores')->findOrFail($id);
        return response()->json($category->stores);
    }
    // Fetch products for a given store
    public function storeProducts($id)
    {
        $store = Store::with('products')->findOrFail($id);
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
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'total' => 'required|numeric',
        ]);

        Log::info('Validated order', $validated);
        $order = Order::create([
            'user_id' => $validated['user_id'] ?? null,
            'total' => $validated['total'],
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
        $orders = Order::with('products')->get();
        return response()->json($orders);
    }

    // Retrieve all users
    public function getUsers()
    {
        $users = User::all();
        return response()->json($users);
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
        $products = Product::with('stores')->where('name', 'LIKE', "%{$query}%")->get();

        return response()->json(['stores' => $stores, 'products' => $products]);
    }
}
