import { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { categoriesApi } from '../api/categoriesApi';
import CrearCategoria from './CrearCategoria';
import EditarCategoria from './EditarCategoria';

export default function ListaCategoriasAdmin() {
    const { categories, loading, error, refetch } = useCategories();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que quieres eliminar esta categoría?')) {
            try {
                await categoriesApi.eliminar(id);
                alert('Categoría eliminada!');
                refetch();
            } catch (error) {
                alert('Error al eliminar categoría');
            }
        }
    };

    if (loading) return <p>Cargando categorías...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <button
                onClick={() => setShowCreate(!showCreate)}
                style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px' }}
            >
                {showCreate ? 'Cancelar' : '+ Crear Categoría'}
            </button>

            {showCreate && <CrearCategoria onSuccess={() => { refetch(); setShowCreate(false); }} />}

            {showEdit && selectedCategory && (
                <EditarCategoria
                    categoryId={selectedCategory.id}
                    onSuccess={() => { refetch(); setShowEdit(false); setSelectedCategory(null); }}
                />
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {categories.map((category) => (
                    <div key={category.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                        <h4>{category.name}</h4>
                        <p><strong>Slug:</strong> {category.slug}</p>
                        <p><strong>Ruta:</strong> {category.full_path || 'N/A'}</p>
                        <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                            <button
                                onClick={() => { setSelectedCategory(category); setShowEdit(true); }}
                                style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(category.id)}
                                style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}