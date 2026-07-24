<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'address_id', 'order_number', 'status',
        'subtotal', 'tax', 'shipping_cost', 'total'
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    // Relaciones
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    // Scopes
    public function scopePaid($query)
    {
        return $query->where('status', 'pagado');
    }

    public function scopeCompleted($query)
    {
        return $query->whereIn('status', ['entregado', 'pagado', 'enviado']);
    }

    // Métodos de negocio
    public function canBeCancelled()
    {
        return in_array($this->status, ['pendiente']);
    }

    public function isPaid()
    {
        return $this->status === 'pagado';
    }

    public function getStatusBadgeAttribute()
    {
        $badges = [
            'pendiente' => 'warning',
            'pagado' => 'success',
            'enviado' => 'info',
            'entregado' => 'primary',
            'cancelado' => 'danger',
        ];

        return $badges[$this->status] ?? 'secondary';
    }
}
