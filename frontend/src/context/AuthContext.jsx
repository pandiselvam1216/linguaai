import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState(localStorage.getItem('token'))

    useEffect(() => {
        if (token) {
            fetchUser()
        } else {
            setLoading(false)
        }
    }, [token])

    const fetchUser = async () => {
        try {
            const response = await api.get('/auth/me')
            setUser(response.data.user)
        } catch (error) {
            localStorage.removeItem('token')
            setToken(null)
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password })
        const { access_token, user: userData } = response.data

        localStorage.setItem('token', access_token)
        setToken(access_token)
        setUser(userData)

        return userData
    }

    const register = async (email, password, fullName, role = 'student') => {
        const response = await api.post('/auth/register', {
            email,
            password,
            full_name: fullName,
            role
        })
        const { access_token, user: userData } = response.data

        localStorage.setItem('token', access_token)
        setToken(access_token)
        setUser(userData)

        return userData
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
    }

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role?.name === 'admin',
        isTeacher: user?.role?.name === 'teacher',
        isStudent: user?.role?.name === 'student'
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}
