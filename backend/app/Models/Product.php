<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'brand_id',
        'sku',
        'name',
        'slug',
        'description',
        'price',
        'stock',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
    ];

    // Carga automáticamente la relación de imágenes y categorías/marcas en cada consulta
    protected $with = ['images', 'category', 'brand'];

    // Incluye el atributo virtual 'primary_image' e 'is_in_stock' en el JSON que recibe React
    protected $appends = ['primary_image', 'is_in_stock'];

    // --- EVENTOS DE MODELO (AUTOGENERACIÓN DE SLUG) ---

    protected static function booted(): void
    {
        static::creating(function (Product $product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });

        static::updating(function (Product $product) {
            if ($product->isDirty('name')) {
                $product->slug = Str::slug($product->name);
            }
        });
    }

    // --- RELACIONES ---

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    // --- SCOPES ---

    public function scopeActive($query)
    {
        return $query->where('status', 'activo');
    }

    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    // --- ACCESSORS ---

    /**
     * Evalúa la imagen principal usando la colección cargada en memoria
     * para evitar lanzar una consulta SQL extra por cada producto (problema N+1).
     */
    public function getPrimaryImageAttribute(): string
    {
        if ($this->relationLoaded('images')) {
            $primary = $this->images->firstWhere('is_primary', true);
            return $primary ? $primary->url : ($this->images->first()?->url ?? 'https://via.placeholder.com/400x400');
        }

        return $this->images()->where('is_primary', true)->first()?->url
            ?? $this->images()->first()?->url
            ?? 'https://via.placeholder.com/400x400';
    }

    public function getIsInStockAttribute(): bool
    {
        return $this->stock > 0;
    }
}