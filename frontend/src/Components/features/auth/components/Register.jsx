import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const styles = {
    container: {
        maxWidth: '440px',
        margin: '60px auto',
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
        marginBottom: '15px',
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
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    }
};

export default function Register({ onRegisterSuccess }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (password !== passwordConfirmation) {
            setError('Las contraseñas no coinciden');
            return;
        }

        const result = await register({ name, email, password });
        if (result.success) {
            onRegisterSuccess?.(result.user);
        } else {
            setError(result.error || 'Error al registrarse');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.container}>
            <h2 style={styles.title}>Crear Cuenta</h2>
            {error && <div style={styles.error}>{error}</div>}
            
            <input
                type="text"
                placeholder="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={styles.input}
            />
            
            <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
            />
            
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
            />
            
            <input
                type="password"
                placeholder="Confirmar contraseña"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                style={styles.input}
            />
            
            <button 
                type="submit" 
                style={styles.button}
                onMouseEnter={(e) => {e.target.style.backgroundColor = '#218838'; e.target.style.transform = 'translateY(-2px)';}}
                onMouseLeave={(e) => {e.target.style.backgroundColor = '#28a745'; e.target.style.transform = 'translateY(0)';}}
            >
                Registrarse
            </button>
        </form>
    );
}