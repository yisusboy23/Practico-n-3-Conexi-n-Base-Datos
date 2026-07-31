import { useState, useEffect } from 'react';
import { usersApi } from '../api/usersApi';

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
            
            // 🔥 EXTRAER DATOS CORRECTAMENTE
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

    if (!userId) {
        return <p>Selecciona un usuario para editar</p>;
    }

    if (loading && !form.name) {
        return <p>Cargando usuario...</p>;
    }

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '20px 0', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>Editar Usuario</h3>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            
            <input
                type="text"
                placeholder="Nombre completo"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
            
            <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
            
            <input
                type="password"
                placeholder="Nueva contraseña (dejar vacío para no cambiar)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            />
            
            <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                style={{ width: '100%', padding: '8px', margin: '5px 0' }}
            >
                <option value="cliente">Cliente</option>
                <option value="admin">Administrador</option>
            </select>
            
            <button
                type="submit"
                disabled={loading}
                style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
                {loading ? 'Actualizando...' : 'Actualizar Usuario'}
            </button>
        </form>
    );
}