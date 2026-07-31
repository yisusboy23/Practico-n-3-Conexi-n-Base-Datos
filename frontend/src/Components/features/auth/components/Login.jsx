import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const styles = {
    container: {
        maxWidth: '420px',
        margin: '80px auto',
        padding: '40px',
        backgroundColor: '#141414',
        borderRadius: '16px',
        border: '1px solid #2a2a2a',
        boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
        color: '#e0e0e0',
    },
    title: {
        textAlign: 'center',
        marginBottom: '30px',
        fontSize: '1.8rem',
        fontWeight: '600',
        color: '#fff',
    },
    input: {
        width: '100%',
        padding: '14px',
        backgroundColor: '#0f0f0f',
        border: '1px solid #333',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '16px',
        outline: 'none',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box',
    },
    error: {
        color: '#ff4d4d',
        backgroundColor: 'rgba(255, 77, 77, 0.1)',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '15px',
        textAlign: 'center',
        border: '1px solid #ff4d4d',
    },
    button: {
        width: '100%',
        padding: '14px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    }
};

export default function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login({ email, password });
        if (result.success) {
            onLoginSuccess?.(result.user);
        } else {
            setError(result.error || 'Error al iniciar sesión');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.container}>
            <h2 style={styles.title}>Iniciar Sesión</h2>
            {error && <div style={styles.error}>{error}</div>}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                />
            </div>
            <div style={{ marginBottom: '25px' }}>
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                />
            </div>
            <button 
                type="submit" 
                style={styles.button}
                onMouseEnter={(e) => {e.target.style.backgroundColor = '#0056b3'; e.target.style.transform = 'translateY(-2px)';}}
                onMouseLeave={(e) => {e.target.style.backgroundColor = '#007bff'; e.target.style.transform = 'translateY(0)';}}
            >
                Iniciar Sesión
            </button>
        </form>
    );
}