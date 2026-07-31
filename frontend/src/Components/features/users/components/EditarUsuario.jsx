import { useState, useEffect } from 'react';
import { usersApi } from '../api/usersApi';

const styles = {
    container: {
        maxWidth: '500px',
        margin: '20px 0',
        padding: '25px',
        backgroundColor: '#121212',
        border: '1px solid #2a2a2a',
        borderRadius: '12px',
        color: '#e0e0e0',
    },
    title: {
        marginTop: 0,
        marginBottom: '20px',
        fontSize: '1.4rem',
        color: '#fff',
        borderBottom: '2px solid #007bff',
        paddingBottom: '10px',
        display: 'inline-block',
    },
    field: {
        width: '100%',
        padding: '12px',
        margin: '8px 0 15px 0',
        backgroundColor: '#0a0a0a',
        border: '1px solid #333',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '15px',
        outline: 'none',
        boxSizing: 'border-box',
    },
    error: {
        color: '#ff4d4d',
        backgroundColor: 'rgba(255, 77, 77, 0.1)',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '15px',
        border: '1px solid #ff4d4d',
    },
    button: {
        padding: '12px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '15px',
        cursor: 'pointer',
        transition: '0.3s',
    },
    message: {
        color: '#a0a0a0',
        padding: '20px',
        textAlign: 'center',
    }
};

export default function EditarUsuario({ userId, onSuccess }) {
    const [form, setForm] = useState({
        name: '',
        email: '',
        role: 'cliente',
    });
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (userId) {
            cargarUsuario();
        }
    }, [userId]);

    const cargarUsuario = async () => {
        try {
            setLoading(true);
            const response = await usersApi.obtener(userId);
            console.log('📦 Respuesta del API:', response.data);
            
            const userData = response.data.data || response.data;
            console.log('👤 Datos del usuario:', userData);
            
            setForm({
                name: userData.name || '',
                email: userData.email || '',
                role: userData.role || 'cliente',
            });
            setPassword('');
            setError('');
        } catch (error) {
            console.error('❌ Error al cargar usuario:', error);
            setError('Error al cargar usuario');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = {
                name: form.name,
                email: form.email,
                role: form.role,
            };
            
            if (password && password.trim() !== '') {
                data.password = password;
            }
            
            await usersApi.actualizar(userId, data);
            if (onSuccess) onSuccess();
            setPassword('');
            alert('Usuario actualizado exitosamente!');
        } catch (err) {
            console.error('❌ Error al actualizar:', err);
            setError(err.response?.data?.message || 'Error al actualizar usuario');
        }
        setLoading(false);
    };

    if (!userId) return <p style={styles.message}>Selecciona un usuario para editar</p>;
    if (loading && !form.name) return <p style={styles.message}>Cargando usuario...</p>;

    return (
        <form onSubmit={handleSubmit} style={styles.container}>
            <h3 style={styles.title}>Editar Usuario</h3>
            {error && <div style={styles.error}>{error}</div>}
            
            <input
                type="text"
                placeholder="Nombre completo"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                style={styles.field}
            />
            
            <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                style={styles.field}
            />
            
            <input
                type="password"
                placeholder="Nueva contraseña (dejar vacío para no cambiar)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.field}
            />
            
            <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                style={styles.field}
            >
                <option value="cliente">Cliente</option>
                <option value="admin">Administrador</option>
            </select>
            
            <button
                type="submit"
                disabled={loading}
                style={styles.button}
                onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#0069d9')}
                onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#007bff')}
            >
                {loading ? 'Actualizando...' : 'Actualizar Usuario'}
            </button>
        </form>
    );
}