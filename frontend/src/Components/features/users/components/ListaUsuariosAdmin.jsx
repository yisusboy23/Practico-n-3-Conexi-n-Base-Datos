import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { usersApi } from '../api/usersApi';
import CrearUsuario from './CrearUsuario';
import EditarUsuario from './EditarUsuario';

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

    if (loading) return <p>Cargando usuarios...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const totalPages = pagination?.last_page || 1;

    return (
        <div>
            <button
                onClick={() => setShowCreate(!showCreate)}
                style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px' }}
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {users.map((user) => (
                    <div key={user.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                        <h4>{user.name}</h4>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p>
                            <strong>Rol:</strong>{' '}
                            <span style={{
                                backgroundColor: user.role === 'admin' ? '#28a745' : '#007bff',
                                color: 'white',
                                padding: '2px 10px',
                                borderRadius: '12px',
                                fontSize: '12px'
                            }}>
                                {user.role === 'admin' ? 'ADMIN' : 'Cliente'}
                            </span>
                        </p>
                        <p><strong>Registro:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                        <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                            <button
                                onClick={() => { setSelectedUser(user); setShowEdit(true); }}
                                style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(user.id)}
                                style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* PAGINACIÓN */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', padding: '10px 0' }}>
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: page <= 1 ? '#ccc' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: page <= 1 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Anterior
                    </button>
                    <span style={{ padding: '8px 16px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                        Página {page} de {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: page >= totalPages ? '#ccc' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: page >= totalPages ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}