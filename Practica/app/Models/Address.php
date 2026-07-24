<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'recipient_name', 'line1', 'city',
        'state', 'postal_code', 'country', 'is_default'
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    // Relaciones
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    // Scope
    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }
}
