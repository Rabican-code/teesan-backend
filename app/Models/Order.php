<?php

namespace App\Models;

use App\Models\Driver;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;
    protected $table = 'orders';

    protected $fillable = [
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
    ];

    protected $casts = [
        'accepted_at' => 'datetime',
        'in_transit_at' => 'datetime',
        'completed_at' => 'datetime',
    ];
    public function products()
    {
        return $this->belongsToMany(Product::class)->withPivot('quantity');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class, 'store_id', 'id');
    }

    public function deliveryPartner()
    {
        return $this->belongsTo(Driver::class, 'delivery_partner', 'id');
    }


}
