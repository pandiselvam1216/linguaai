import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    LayoutDashboard, Headphones, Mic, BookOpen, Edit3,
    CheckSquare, Book, Brain, ChevronLeft, ChevronRight, LogOut,
    Shield, Users, BarChart2, FileQuestion
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/listening', icon: Headphones, label: 'Listening' },
    { path: '/speaking', icon: Mic, label: 'Speaking' },
    { path: '/reading', icon: BookOpen, label: 'Reading' },
    { path: '/writing', icon: Edit3, label: 'Writing' },
    { path: '/grammar', icon: CheckSquare, label: 'Grammar' },
    { path: '/vocabulary', icon: Book, label: 'Vocabulary' },
    { path: '/critical-thinking', icon: Brain, label: 'Critical Thinking' },
]

const adminItems = [
    { path: '/admin', icon: Shield, label: 'Admin Dashboard' },
    { path: '/admin/students', icon: Users, label: 'Students' },
    { path: '/admin/questions', icon: FileQuestion, label: 'Questions' },
    { path: '/admin/reports', icon: BarChart2, label: 'Reports' },
]

export default function Sidebar({ isOpen, onToggle }) {
    const { logout, user, isAdmin } = useAuth()

    return (
        <motion.aside
            initial={false}
            animate={{ width: isOpen ? 260 : 72 }}
            style={{
                position: 'fixed',
                left: 0,
                top: 0,
                height: '100vh',
                backgroundColor: '#FFFFFF',
                borderRight: '1px solid #E5E7EB',
                zIndex: 50,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
            }}
        >
            {/* Logo */}
            <div style={{
                height: '72px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                borderBottom: '1px solid #F3F4F6',
            }}>
                {isOpen ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #1A73E8 0%, #4285F4 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>N</span>
                        </div>
                        <span style={{ fontWeight: '600', fontSize: '18px', color: '#111827' }}>NeuraLingua</span>
                    </div>
                ) : (
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #1A73E8 0%, #4285F4 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                    }}>
                        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>N</span>
                    </div>
                )}
                {isOpen && (
                    <button
                        onClick={onToggle}
                        style={{
                            padding: '8px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            color: '#6B7280',
                        }}
                    >
                        <ChevronLeft size={18} />
                    </button>
                )}
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
                {!isOpen && (
                    <button
                        onClick={onToggle}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '10px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            color: '#6B7280',
                            marginBottom: '8px',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <ChevronRight size={18} />
                    </button>
                )}

                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: isOpen ? '12px 16px' : '12px',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            marginBottom: '4px',
                            justifyContent: isOpen ? 'flex-start' : 'center',
                            backgroundColor: isActive ? '#EFF6FF' : 'transparent',
                            color: isActive ? '#1A73E8' : '#6B7280',
                            fontWeight: isActive ? '500' : '400',
                            transition: 'all 0.15s ease',
                        })}
                    >
                        <item.icon size={20} />
                        {isOpen && <span style={{ fontSize: '14px' }}>{item.label}</span>}
                    </NavLink>
                ))}

                {/* Admin Menu */}
                {isAdmin && (
                    <>
                        {isOpen ? (
                            <div style={{
                                margin: '16px 0 8px',
                                padding: '0 16px',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#9CA3AF',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                Administration
                            </div>
                        ) : (
                            <div style={{ height: '16px' }} />
                        )}
                        {adminItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/admin'} // Exact match for admin root
                                style={({ isActive }) => ({
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: isOpen ? '12px 16px' : '12px',
                                    borderRadius: '10px',
                                    textDecoration: 'none',
                                    marginBottom: '4px',
                                    justifyContent: isOpen ? 'flex-start' : 'center',
                                    backgroundColor: isActive ? '#F0FDF4' : 'transparent',
                                    color: isActive ? '#166534' : '#6B7280',
                                    fontWeight: isActive ? '500' : '400',
                                    transition: 'all 0.15s ease',
                                })}
                            >
                                <item.icon size={20} />
                                {isOpen && <span style={{ fontSize: '14px' }}>{item.label}</span>}
                            </NavLink>
                        ))}
                    </>
                )}
            </nav>

            {/* User */}
            <div style={{ padding: '16px 12px', borderTop: '1px solid #F3F4F6' }}>
                {isOpen && user && (
                    <div style={{
                        padding: '12px 16px',
                        marginBottom: '12px',
                        backgroundColor: '#F9FAFB',
                        borderRadius: '10px',
                    }}>
                        <p style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#111827',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>
                            {user.full_name || 'User'}
                        </p>
                        <p style={{
                            fontSize: '12px',
                            color: '#6B7280',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>
                            {user.email}
                        </p>
                    </div>
                )}
                <button
                    onClick={logout}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: isOpen ? '12px 16px' : '12px',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        color: '#6B7280',
                        justifyContent: isOpen ? 'flex-start' : 'center',
                        transition: 'all 0.15s ease',
                    }}
                >
                    <LogOut size={20} />
                    {isOpen && <span style={{ fontSize: '14px', fontWeight: '500' }}>Sign out</span>}
                </button>
            </div>
        </motion.aside>
    )
}
