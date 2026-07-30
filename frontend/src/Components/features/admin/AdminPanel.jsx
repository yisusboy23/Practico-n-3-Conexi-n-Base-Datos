import { useState } from 'react';
import { useAuth } from '../auth/hooks/useAuth';
import ListaProductosAdmin from '../products/components/ListaProductosAdmin';

export default function AdminPanel() {
    const { user, loading } = useAuth();
    const [seccion, setSeccion] = useState('productos');

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                Cargando...
            </div>
        );
    }

    if (user?.role !== 'admin') {
        return (
            <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
                <h2>Acceso Denegado</h2>
                <p>No tienes permisos de administrador</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>Panel de Administracion</h2>
            
            <nav style={{ marginBottom: '20px', display: 'flex', gap: '10px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                <button onClick={() => setSeccion('productos')} style={{ padding: '8px 16px', backgroundColor: seccion === 'productos' ? '#007bff' : '#ddd', color: seccion === 'productos' ? 'white' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Productos</button>
                <button onClick={() => setSeccion('categorias')} style={{ padding: '8px 16px', backgroundColor: seccion === 'categorias' ? '#007bff' : '#ddd', color: seccion === 'categorias' ? 'white' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Categorias</button>
                <button onClick={() => setSeccion('marcas')} style={{ padding: '8px 16px', backgroundColor: seccion === 'marcas' ? '#007bff' : '#ddd', color: seccion === 'marcas' ? 'white' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Marcas</button>
                <button onClick={() => setSeccion('usuarios')} style={{ padding: '8px 16px', backgroundColor: seccion === 'usuarios' ? '#007bff' : '#ddd', color: seccion === 'usuarios' ? 'white' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Usuarios</button>
            </nav>

            {seccion === 'productos' && <ListaProductosAdmin />}
            {seccion === 'categorias' && <div>Gestion de Categorias (en desarrollo)</div>}
            {seccion === 'marcas' && <div>Gestion de Marcas (en desarrollo)</div>}
            {seccion === 'usuarios' && <div>Gestion de Usuarios (en desarrollo)</div>}
        </div>
    );
}
