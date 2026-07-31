import { useState } from 'react';
import { useAuth } from '../auth/hooks/useAuth';
import ListaProductosAdmin from '../products/components/ListaProductosAdmin';
import ListaCategoriasAdmin from '../categories/components/ListaCategoriasAdmin';
import ListaMarcasAdmin from '../brands/components/ListaMarcasAdmin';
import ListaUsuariosAdmin from '../users/components/ListaUsuariosAdmin';

const styles = {
    container: {
        padding: '30px',
        maxWidth: '1400px',
        margin: '0 auto',
        backgroundColor: '#0a0a0a',
        minHeight: '100vh',
        color: '#e0e0e0',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
    },
    title: {
        fontSize: '2rem',
        fontWeight: '700',
        marginBottom: '30px',
        color: '#ffffff',
        display: 'inline-block',
        borderBottom: '3px solid #7b2ffc',
        paddingBottom: '10px',
    },
    nav: {
        display: 'flex',
        gap: '12px',
        marginBottom: '30px',
        borderBottom: '1px solid #2a2a2a',
        paddingBottom: '15px',
        flexWrap: 'wrap',
    },
    buttonBase: {
        padding: '10px 24px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px',
        transition: 'all 0.3s ease',
    },
    buttonActive: {
        backgroundColor: '#7b2ffc',
        color: '#fff',
        boxShadow: '0 4px 14px rgba(123, 47, 252, 0.4)',
    },
    buttonInactive: {
        backgroundColor: 'transparent',
        color: '#a0a0a0',
        border: '1px solid #333',
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        color: '#a0a0a0',
        fontSize: '1.2rem',
    },
    denied: {
        textAlign: 'center',
        padding: '80px 20px',
        color: '#ff4d4d',
    }
};

export default function AdminPanel() {
    const { user, loading } = useAuth();
    const [seccion, setSeccion] = useState('productos');

    if (loading) {
        return <div style={styles.loading}>Cargando panel de control...</div>;
    }

    if (user?.role !== 'admin') {
        return (
            <div style={styles.denied}>
                <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Acceso Denegado</h2>
                <p style={{ color: '#a0a0a0' }}>No tienes permisos de administrador</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Panel de Administración</h2>
            
            <nav style={styles.nav}>
                <button
                    onClick={() => setSeccion('productos')}
                    style={{
                        ...styles.buttonBase,
                        ...(seccion === 'productos' ? styles.buttonActive : styles.buttonInactive)
                    }}
                >
                    Productos
                </button>
                <button
                    onClick={() => setSeccion('categorias')}
                    style={{
                        ...styles.buttonBase,
                        ...(seccion === 'categorias' ? styles.buttonActive : styles.buttonInactive)
                    }}
                >
                    Categorías
                </button>
                <button
                    onClick={() => setSeccion('marcas')}
                    style={{
                        ...styles.buttonBase,
                        ...(seccion === 'marcas' ? styles.buttonActive : styles.buttonInactive)
                    }}
                >
                    Marcas
                </button>
                <button
                    onClick={() => setSeccion('usuarios')}
                    style={{
                        ...styles.buttonBase,
                        ...(seccion === 'usuarios' ? styles.buttonActive : styles.buttonInactive)
                    }}
                >
                    Usuarios
                </button>
            </nav>

            {seccion === 'productos' && <ListaProductosAdmin />}
            {seccion === 'categorias' && <ListaCategoriasAdmin />}
            {seccion === 'marcas' && <ListaMarcasAdmin />}
            {seccion === 'usuarios' && <ListaUsuariosAdmin />}
        </div>
    );
}