<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id', 'method', 'transaction_id',
        'status', 'amount', 'paid_at'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    // Relaciones
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // Scopes
    public function scopeApproved($query)
    {
        return $query->where('status', 'aprobado');
    }

    // Métodos de negocio
    public function isApproved()
    {
        return $this->status === 'aprobado';
    }

    public function canBeRefunded()
    {
        return in_array($this->status, ['aprobado']);
    }
}
