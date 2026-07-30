<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $this->command->info('Creando categorías...');
        
        DB::disableQueryLog();
        
        // Categorías principales ÚNICAS
        $categories = [
            ['name' => 'Laptops', 'parent_id' => null],
            ['name' => 'Desktops', 'parent_id' => null],
            ['name' => 'Monitores', 'parent_id' => null],
            ['name' => 'Teclados', 'parent_id' => null],
            ['name' => 'Mouses', 'parent_id' => null],
            ['name' => 'Audífonos', 'parent_id' => null],
            ['name' => 'Almacenamiento', 'parent_id' => null],
            ['name' => 'Tarjetas Gráficas', 'parent_id' => null],
            ['name' => 'Procesadores', 'parent_id' => null],
            ['name' => 'Placas Madre', 'parent_id' => null],
            ['name' => 'Gabinetes', 'parent_id' => null],
            ['name' => 'Impresoras', 'parent_id' => null],
            ['name' => 'Redes', 'parent_id' => null],
            ['name' => 'Accesorios', 'parent_id' => null],
        ];
        
        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'parent_id' => $category['parent_id'],
            ]);
        }
        
        // Subcategorías (con nombres diferentes)
        $subcategories = [
            ['name' => 'Gaming', 'parent_name' => 'Laptops'],
            ['name' => 'Ultrabooks', 'parent_name' => 'Laptops'],
            ['name' => 'Workstations', 'parent_name' => 'Laptops'],
            ['name' => 'All-in-One', 'parent_name' => 'Desktops'],
            ['name' => 'Mini PCs', 'parent_name' => 'Desktops'],
            ['name' => 'Gaming', 'parent_name' => 'Monitores'],
            ['name' => 'Curved', 'parent_name' => 'Monitores'],
            ['name' => 'Teclados Mecánicos', 'parent_name' => 'Teclados'],
            ['name' => 'Teclados Ergonómicos', 'parent_name' => 'Teclados'],
            ['name' => 'Mouses Gaming', 'parent_name' => 'Mouses'],
            ['name' => 'Mouses Ergonómicos', 'parent_name' => 'Mouses'],
            ['name' => 'SSD', 'parent_name' => 'Almacenamiento'],
            ['name' => 'HDD', 'parent_name' => 'Almacenamiento'],
            ['name' => 'NVMe', 'parent_name' => 'Almacenamiento'],
            ['name' => 'Tarjetas Gráficas', 'parent_name' => 'Tarjetas Gráficas'],
            ['name' => 'Routers', 'parent_name' => 'Redes'],
            ['name' => 'Switches', 'parent_name' => 'Redes'],
            ['name' => 'Cables', 'parent_name' => 'Accesorios'],
            ['name' => 'Adaptadores', 'parent_name' => 'Accesorios'],
            ['name' => 'Fundas', 'parent_name' => 'Accesorios'],
        ];
        
        foreach ($subcategories as $sub) {
            $parent = Category::where('name', $sub['parent_name'])->first();
            if ($parent) {
                Category::create([
                    'name' => $sub['name'],
                    'slug' => Str::slug($sub['name'] . '-' . $sub['parent_name']),
                    'parent_id' => $parent->id,
                ]);
            }
        }
        
        $this->command->info('Categorías creadas exitosamente.');
    }
}