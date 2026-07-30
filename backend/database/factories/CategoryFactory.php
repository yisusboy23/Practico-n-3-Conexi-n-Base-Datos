<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition()
    {
        // Lista fija de categorías únicas
        static $categories = [
            'Laptops', 'Desktops', 'Monitores', 'Teclados', 'Mouses',
            'Audífonos', 'Memorias RAM', 'Discos Duros', 'SSD', 'Tarjetas Gráficas',
            'Procesadores', 'Placas Madre', 'Fuentes de Poder', 'Gabinetes', 'Ventiladores',
            'Impresoras', 'Scanners', 'Cámaras Web', 'Micrófonos', 'Parlantes',
            'Routers', 'Switches', 'Cables', 'Adaptadores', 'Cargadores',
            'Baterías', 'Fundas', 'Mochilas', 'Limpieza', 'Soportes'
        ];
        
        static $index = 0;
        
        $name = $categories[$index % count($categories)];
        $index++;
        
        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'parent_id' => null,
        ];
    }
}