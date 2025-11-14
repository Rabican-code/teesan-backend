<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'product_image',
        'price',
        'discount_price',
        'category_id',
        'quantity',
        'calories',
        'grams',
        'fats',
        'proteins',
        'publish',
        'non_veg',
        'takeaway',
    ];

    public function stores()
    {
        return $this->belongsToMany(Store::class, 'product_store');
    }

    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_product')
            ->withPivot('quantity')
            ->withTimestamps();
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
