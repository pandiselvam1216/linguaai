import { useState, useEffect } from 'react'
import { Menu, Bell, Search, Wifi, WifiOff, Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar({ onMenuClick }) {
    const { user } = useAuth()
    const [isOnline, setIsOnline] = useState(navigator.onLine)
    const [micStatus, setMicStatus] = useState('unknown') // 'granted', 'denied', 'prompt', 'unknown'
    const [audioStatus, setAudioStatus] = useState(false) // true if AudioContext user interaction happened

    useEffect(() => {
        // 1. Network Status
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        // 2. Microphone Permission Status
        const checkMicPermission = async () => {
            try {
                if (navigator.permissions && navigator.permissions.query) {
                    const permission = await navigator.permissions.query({ name: 'microphone' })
                    setMicStatus(permission.state)
                    permission.addEventListener('change', () => {
                        setMicStatus(permission.state)
                    })
                }
            } catch (error) {
                console.warn('Mic permission check failed', error)
            }
        }
        checkMicPermission()

        // 3. Audio Status (Simple check if AudioContext is allowed to run)
        const checkAudio = () => {
            const AudioContext = window.AudioContext || window.webkitAudioContext
            if (AudioContext) {
                const ctx = new AudioContext()
                if (ctx.state === 'running') {
                    setAudioStatus(true)
                } else if (ctx.state === 'suspended') {
                    // Browsers suspend audio until user interaction
                    setAudioStatus(false)
                }
                ctx.close()
            }
        }
        checkAudio()

        // Listen for interactions to update audio status
        const handleInteraction = () => {
            setAudioStatus(true)
            // Once we have an interaction, we assume audio is "ready" for the session
            window.removeEventListener('click', handleInteraction)
            window.removeEventListener('keydown', handleInteraction)
        }
        window.addEventListener('click', handleInteraction)
        window.addEventListener('keydown', handleInteraction)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
            window.removeEventListener('click', handleInteraction)
            window.removeEventListener('keydown', handleInteraction)
        }
    }, [])

    const StatusIndicator = ({ icon: Icon, color, tooltip, offIcon: OffIcon, isOff }) => (
        <div
            title={tooltip}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: isOff ? '#FEE2E2' : '#EFF6FF',
                color: isOff ? '#EF4444' : '#1A73E8', // Red for off, Blue for on
                // If it's a "good" state like online, maybe Green? Let's use specific logic.
                // Resetting color logic below for flexibility
                ...((!isOff && color) ? { color: color, backgroundColor: `${color}20` } : {})
            }}
        >
            {isOff ? <OffIcon size={16} /> : <Icon size={16} />}
        </div>
    )

    return (
        <header style={{
            height: '72px',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #E5E7EB',
            backgroundColor: '#FFFFFF',
            position: 'sticky',
            top: 0,
            zIndex: 40,
        }}>
            <button
                onClick={onMenuClick}
                style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    color: '#6B7280',
                    display: 'none', // Hidden on desktop usually
                }}
            >
                <Menu size={20} />
            </button>

            {/* Search */}
            <div style={{ flex: 1, maxWidth: '400px' }}>
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#9CA3AF',
                    }} />
                    <input
                        type="text"
                        placeholder="Search..."
                        style={{
                            width: '100%',
                            padding: '12px 14px 12px 44px',
                            borderRadius: '10px',
                            border: '1px solid #E5E7EB',
                            backgroundColor: '#F9FAFB',
                            fontSize: '14px',
                            color: '#111827',
                        }}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

                {/* System Status Indicators */}
                <div style={{ display: 'flex', gap: '8px', marginRight: '8px', borderRight: '1px solid #E5E7EB', paddingRight: '16px' }}>
                    {/* Network */}
                    <StatusIndicator
                        icon={Wifi}
                        offIcon={WifiOff}
                        isOff={!isOnline}
                        color={isOnline ? '#10B981' : undefined} // Green if online
                        tooltip={isOnline ? "Network: Online" : "Network: Offline"}
                    />

                    {/* Audio */}
                    <StatusIndicator
                        icon={Volume2}
                        offIcon={VolumeX}
                        isOff={!audioStatus}
                        color={audioStatus ? '#10B981' : undefined}
                        tooltip={audioStatus ? "Audio: Ready" : "Audio: Click to Enable"}
                    />

                    {/* Mic */}
                    <StatusIndicator
                        icon={Mic}
                        offIcon={MicOff}
                        isOff={micStatus !== 'granted'}
                        color={micStatus === 'granted' ? '#10B981' : undefined}
                        tooltip={`Microphone: ${micStatus === 'granted' ? 'Access Granted' : 'Check Permissions'}`}
                    />
                </div>

                <button style={{
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    color: '#6B7280',
                    position: 'relative',
                }}>
                    <Bell size={20} />
                    <span style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#EF4444',
                        borderRadius: '50%',
                    }} />
                </button>

                <div style={{
                    paddingLeft: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                }}>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                            {user?.full_name || 'User'}
                        </p>
                        <p style={{ fontSize: '12px', color: '#6B7280' }}>
                            {user?.role?.name || 'Student'}
                        </p>
                    </div>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #1A73E8 0%, #4285F4 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'white',
                    }}>
                        {user?.full_name?.charAt(0) || 'U'}
                    </div>
                </div>
            </div>
        </header>
    )
}
