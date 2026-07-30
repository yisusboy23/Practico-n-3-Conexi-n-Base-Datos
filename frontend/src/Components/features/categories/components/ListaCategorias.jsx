import { useCategories } from '../hooks/useCategories';

export default function ListaCategorias({ onSeleccionarCategoria }) {
    const { categories, loading, error } = useCategories();

    if (loading) return <p>Cargando categorías...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <ul style={{ listStyle: 'none', padding: 0 }}>
            {categories.map((category) => (
                <li 
                    key={category.id} 
                    onClick={() => onSeleccionarCategoria(category)}
                    style={{ padding: '10px', margin: '5px 0', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
                >
                    <strong>{category.name}</strong>
                    {category.full_path && <span style={{ color: '#666', marginLeft: '10px' }}>{category.full_path}</span>}
                </li>
            ))}
        </ul>
    );
}
