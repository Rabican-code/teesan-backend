<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    protected $fillable = [
        'image',
        'name',
        'email',
        'date',
        'documents',
        'active',
        'online',
        'wallet_history',
        'total_orders',
    ];

    protected $casts = [
        'documents' => 'array',
        'wallet_history' => 'array',
        'active' => 'boolean',
        'online' => 'boolean',
        'date' => 'date',
    ];
}
