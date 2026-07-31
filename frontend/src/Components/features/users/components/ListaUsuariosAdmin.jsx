import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { usersApi } from '../api/usersApi';
import CrearUsuario from './CrearUsuario';
import EditarUsuario from './EditarUsuario';

const styles = {
    container: {
        color: '#e0e0e0',
        marginTop: '10px',
    },
    createBtn: {
        padding: '10px 20px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        marginBottom: '20px',
        transition: '0.3s',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
    },
    card: {
        backgroundColor: '#151515',
        border: '1px solid #2a2a2a',
        padding: '20px',
        borderRadius: '12px',
    },
    cardTitle: {
        color: '#fff',
        margin: '0 0 8px 0',
        fontSize: '1.2rem',
    },
    cardText: {
        color: '#a0a0a0',
        margin: '5px 0',
        fontSize: '0.9rem',
    },
    roleBadge: {
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold',
        display: 'inline-block',
        color: 'white',
    },
    cardActions: {
        display: 'flex',
        gap: '8px',
        marginTop: '15px',
    },
    editBtn: {
        padding: '6px 14px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: '0.2s',
    },
    deleteBtn: {
        padding: '6px 14px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: '0.2s',
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginTop: '30px',
        padding: '10px 0',
    },
    pageBtn: {
        padding: '8px 16px',
        border: 'none',
        borderRadius: '6px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    pageBtnActive: {
        backgroundColor: '#7b2ffc',
        color: 'white',
    },
    pageBtnDisabled: {
        backgroundColor: '#2a2a2a',
        color: '#666',
        cursor: 'not-allowed',
    },
    pageInfo: {
        padding: '8px 16px',
        backgroundColor: '#151515',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        color: '#a0a0a0',
    }
};

export default function ListaUsuariosAdmin() {
    const [page, setPage] = useState(1);
    const { users, loading, error, refetch, pagination } = useUsers({ page });
    const [selectedUser, setSelectedUser] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que quieres eliminar este usuario?')) {
            try {
                await usersApi.eliminar(id);
                alert('Usuario eliminado!');
                refetch();
            } catch (error) {
                alert('Error al eliminar usuario');
            }
        }
    };

    if (loading) return <p style={{color: '#a0a0a0'}}>Cargando usuarios...</p>;
    if (error) return <p style={{color: '#ff4d4d'}}>Error: {error.message}</p>;

    const totalPages = pagination?.last_page || 1;

    return (
        <div style={styles.container}>
            <button
                onClick={() => setShowCreate(!showCreate)}
                style={styles.createBtn}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#218838'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#28a745'}
            >
                {showCreate ? 'Cancelar' : '+ Crear Usuario'}
            </button>

            {showCreate && <CrearUsuario onSuccess={() => { refetch(); setShowCreate(false); }} />}

            {showEdit && selectedUser && (
                <EditarUsuario
                    userId={selectedUser.id}
                    onSuccess={() => { refetch(); setShowEdit(false); setSelectedUser(null); }}
                />
            )}

            <div style={styles.grid}>
                {users.map((user) => (
                    <div key={user.id} style={styles.card}>
                        <h4 style={styles.cardTitle}>{user.name}</h4>
                        <p style={styles.cardText}><strong>Email:</strong> {user.email}</p>
                        <p style={styles.cardText}>
                            <strong>Rol:</strong>{' '}
                            <span style={{
                                ...styles.roleBadge,
                                backgroundColor: user.role === 'admin' ? '#7b2ffc' : '#00d4ff',
                            }}>
                                {user.role === 'admin' ? 'ADMIN' : 'Cliente'}
                            </span>
                        </p>
                        <p style={styles.cardText}><strong>Registro:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                        <div style={styles.cardActions}>
                            <button
                                onClick={() => { setSelectedUser(user); setShowEdit(true); }}
                                style={styles.editBtn}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#0069d9'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(user.id)}
                                style={styles.deleteBtn}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div style={styles.pagination}>
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        style={{
                            ...styles.pageBtn,
                            ...(page <= 1 ? styles.pageBtnDisabled : styles.pageBtnActive),
                        }}
                    >
                        Anterior
                    </button>
                    <span style={styles.pageInfo}>
                        Página {page} de {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                        style={{
                            ...styles.pageBtn,
                            ...(page >= totalPages ? styles.pageBtnDisabled : styles.pageBtnActive),
                        }}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}