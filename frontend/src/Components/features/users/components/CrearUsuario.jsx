import { useState } from 'react';
import { usersApi } from '../api/usersApi';

export default function CrearUsuario({ onSuccess }) {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'cliente',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await usersApi.crear(form);
            if (onSuccess) onSuccess();
            setForm({ name: '', email: '', password: '', role: 'cliente' });
            alert('Usuario creado exitosamente!');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear usuario');
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '20px 0', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>Crear Usuario</h3>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            
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
                placeholder="Contraseña"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
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
                style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
                {loading ? 'Creando...' : 'Crear Usuario'}
            </button>
        </form>
    );
}