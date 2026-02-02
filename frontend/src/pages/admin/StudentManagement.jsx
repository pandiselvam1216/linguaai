import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users, Search, Plus, Trash2, Edit2, X, Check,
    ChevronLeft, ChevronRight, UserCheck, UserX, Mail
} from 'lucide-react'
import api from '../../services/api'

export default function StudentManagement() {
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [search, setSearch] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingStudent, setEditingStudent] = useState(null)
    const [formData, setFormData] = useState({ email: '', password: '', full_name: '', is_active: true })
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(null)

    useEffect(() => {
        fetchStudents()
    }, [page, search])

    const fetchStudents = async () => {
        try {
            const response = await api.get('/admin/students', {
                params: { page, per_page: 10, search }
            })
            setStudents(response.data.students || [])
            setTotalPages(response.data.pages || 1)
        } catch (error) {
            console.error('Failed to fetch students:', error)
            // Mock data for demo
            setStudents([
                { id: 1, full_name: 'John Doe', email: 'john@example.com', is_active: true, created_at: '2024-01-15', stats: { attempts: 25, average_score: 78 } },
                { id: 2, full_name: 'Jane Smith', email: 'jane@example.com', is_active: true, created_at: '2024-01-20', stats: { attempts: 42, average_score: 85 } },
                { id: 3, full_name: 'Bob Wilson', email: 'bob@example.com', is_active: false, created_at: '2024-02-01', stats: { attempts: 12, average_score: 65 } },
            ])
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = (student = null) => {
        if (student) {
            setEditingStudent(student)
            setFormData({
                email: student.email,
                password: '',
                full_name: student.full_name,
                is_active: student.is_active
            })
        } else {
            setEditingStudent(null)
            setFormData({ email: '', password: '', full_name: '', is_active: true })
        }
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setEditingStudent(null)
        setFormData({ email: '', password: '', full_name: '', is_active: true })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)

        try {
            if (editingStudent) {
                await api.put(`/admin/students/${editingStudent.id}`, formData)
            } else {
                await api.post('/admin/students', formData)
            }
            handleCloseModal()
            fetchStudents()
        } catch (error) {
            console.error('Failed to save student:', error)
            alert(error.response?.data?.error || 'Failed to save student')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (studentId) => {
        if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
            return
        }

        setDeleting(studentId)
        try {
            await api.delete(`/admin/students/${studentId}`)
            fetchStudents()
        } catch (error) {
            console.error('Failed to delete student:', error)
            alert(error.response?.data?.error || 'Failed to delete student')
        } finally {
            setDeleting(null)
        }
    }

    const handleToggleStatus = async (student) => {
        try {
            await api.put(`/admin/students/${student.id}`, { is_active: !student.is_active })
            fetchStudents()
        } catch (error) {
            console.error('Failed to update status:', error)
        }
    }

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F9FAFB',
            }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    border: '4px solid #E5E7EB',
                    borderTop: '4px solid #3B82F6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                }} />
            </div>
        )
    }

    return (
        <div style={{
            padding: '24px',
            backgroundColor: '#F9FAFB',
            minHeight: '100vh',
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Users size={24} style={{ color: 'white' }} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 }}>
                            Student Management
                        </h1>
                        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
                            Add, edit, and manage student accounts
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    style={{
                        padding: '12px 24px',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                    }}
                >
                    <Plus size={18} />
                    Add Student
                </button>
            </div>

            {/* Search & Filters */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                }}>
                    <div style={{
                        flex: 1,
                        position: 'relative',
                    }}>
                        <Search size={18} style={{
                            position: 'absolute',
                            left: '14px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#9CA3AF',
                        }} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            style={{
                                width: '100%',
                                padding: '12px 14px 12px 44px',
                                borderRadius: '10px',
                                border: '2px solid #E5E7EB',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                        />
                    </div>
                </div>
            </div>

            {/* Students Table */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#F9FAFB' }}>
                            <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Student</th>
                            <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Status</th>
                            <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Attempts</th>
                            <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Avg Score</th>
                            <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, idx) => (
                            <motion.tr
                                key={student.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                style={{ borderTop: '1px solid #F3F4F6' }}
                            >
                                <td style={{ padding: '16px 24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '10px',
                                            backgroundColor: '#EFF6FF',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: '600',
                                            color: '#3B82F6',
                                            fontSize: '14px',
                                        }}>
                                            {student.full_name?.charAt(0)?.toUpperCase() || 'S'}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827', margin: 0 }}>
                                                {student.full_name || 'No Name'}
                                            </p>
                                            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Mail size={12} /> {student.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '16px 24px' }}>
                                    <button
                                        onClick={() => handleToggleStatus(student)}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            border: 'none',
                                            backgroundColor: student.is_active ? '#F0FDF4' : '#FEF2F2',
                                            color: student.is_active ? '#166534' : '#991B1B',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                        }}
                                    >
                                        {student.is_active ? <UserCheck size={14} /> : <UserX size={14} />}
                                        {student.is_active ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td style={{ padding: '16px 24px' }}>
                                    <span style={{ fontSize: '14px', color: '#374151' }}>
                                        {student.stats?.attempts || 0}
                                    </span>
                                </td>
                                <td style={{ padding: '16px 24px' }}>
                                    <span style={{
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: (student.stats?.average_score || 0) >= 70 ? '#22C55E' : (student.stats?.average_score || 0) >= 50 ? '#F59E0B' : '#EF4444'
                                    }}>
                                        {student.stats?.average_score || 0}%
                                    </span>
                                </td>
                                <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                                        <button
                                            onClick={() => handleOpenModal(student)}
                                            style={{
                                                padding: '8px',
                                                borderRadius: '8px',
                                                border: '1px solid #E5E7EB',
                                                backgroundColor: 'white',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Edit2 size={16} style={{ color: '#6B7280' }} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(student.id)}
                                            disabled={deleting === student.id}
                                            style={{
                                                padding: '8px',
                                                borderRadius: '8px',
                                                border: '1px solid #FECACA',
                                                backgroundColor: '#FEF2F2',
                                                cursor: deleting === student.id ? 'not-allowed' : 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                opacity: deleting === student.id ? 0.5 : 1,
                                            }}
                                        >
                                            <Trash2 size={16} style={{ color: '#EF4444' }} />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{
                        padding: '16px 24px',
                        borderTop: '1px solid #F3F4F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <span style={{ fontSize: '14px', color: '#6B7280' }}>
                            Page {page} of {totalPages}
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #E5E7EB',
                                    backgroundColor: 'white',
                                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                                    opacity: page === 1 ? 0.5 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '14px',
                                    color: '#374151',
                                }}
                            >
                                <ChevronLeft size={16} /> Prev
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #E5E7EB',
                                    backgroundColor: 'white',
                                    cursor: page === totalPages ? 'not-allowed' : 'pointer',
                                    opacity: page === totalPages ? 0.5 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '14px',
                                    color: '#374151',
                                }}
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                        }}
                        onClick={handleCloseModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                padding: '32px',
                                width: '100%',
                                maxWidth: '480px',
                                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '24px',
                            }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>
                                    {editingStudent ? 'Edit Student' : 'Add New Student'}
                                </h2>
                                <button
                                    onClick={handleCloseModal}
                                    style={{
                                        padding: '8px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: '#F3F4F6',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <X size={18} style={{ color: '#6B7280' }} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData(p => ({ ...p, full_name: e.target.value }))}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px 14px',
                                            borderRadius: '10px',
                                            border: '2px solid #E5E7EB',
                                            fontSize: '14px',
                                            outline: 'none',
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px 14px',
                                            borderRadius: '10px',
                                            border: '2px solid #E5E7EB',
                                            fontSize: '14px',
                                            outline: 'none',
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                        Password {editingStudent && <span style={{ color: '#9CA3AF', fontWeight: '400' }}>(leave blank to keep current)</span>}
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                                        required={!editingStudent}
                                        style={{
                                            width: '100%',
                                            padding: '12px 14px',
                                            borderRadius: '10px',
                                            border: '2px solid #E5E7EB',
                                            fontSize: '14px',
                                            outline: 'none',
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData(p => ({ ...p, is_active: e.target.checked }))}
                                            style={{ width: '18px', height: '18px', accentColor: '#3B82F6' }}
                                        />
                                        <span style={{ fontSize: '14px', color: '#374151' }}>Active account</span>
                                    </label>
                                </div>

                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            borderRadius: '10px',
                                            border: '1px solid #E5E7EB',
                                            backgroundColor: 'white',
                                            color: '#374151',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            borderRadius: '10px',
                                            border: 'none',
                                            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                                            color: 'white',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            cursor: saving ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            opacity: saving ? 0.7 : 1,
                                        }}
                                    >
                                        <Check size={16} />
                                        {saving ? 'Saving...' : (editingStudent ? 'Update' : 'Create')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
