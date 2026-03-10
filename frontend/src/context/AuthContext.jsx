import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(mapUser(session.user))
            }
            setLoading(false)
        })

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(mapUser(session.user))
            } else {
                setUser(null)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const mapUser = (supabaseUser) => ({
        id: supabaseUser.id,
        email: supabaseUser.email,
        full_name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0],
        role: { name: supabaseUser.user_metadata?.role || 'student' },
        ...supabaseUser.user_metadata
    })

    const login = async (email, password) => {
        // First authenticate with Supabase for realtime DB access
        const { data: supabaseData, error: supabaseError } = await supabase.auth.signInWithPassword({ email, password })
        if (supabaseError) throw { response: { data: { error: supabaseError.message } } }

        try {
            // Then authenticate with the backend to get the JWT token for admin routes
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.access_token);
            } else {
                console.error("Backend login failed, admin routes may not work.");
            }
        } catch (err) {
            console.error("Error communicating with auth backend:", err);
        }

        return mapUser(supabaseData.user)
    }

    const register = async (email, password, fullName, role = 'student') => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName, role }
            }
        })
        if (error) throw { response: { data: { error: error.message } } }
        return mapUser(data.user)
    }

    const logout = async () => {
        await supabase.auth.signOut()
        localStorage.removeItem('token')
        setUser(null)
    }

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        token: null,
        isAuthenticated: !!user,
        isAdmin: user?.role?.name === 'admin' || user?.email === 'admin@neuralingua.com',
        isTeacher: user?.role?.name === 'teacher',
        isStudent: !!(user && user?.role?.name !== 'admin' && user?.email !== 'admin@neuralingua.com')
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
