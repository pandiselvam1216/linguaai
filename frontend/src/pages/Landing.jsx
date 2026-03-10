import { Link } from 'react-router-dom'
import logoImg from '../assets/logo.png'
import neuraGlobalIcon from '../assets/Neura Global Icon.png'
import './Landing.css'
import { motion } from 'framer-motion'
import {
    ArrowRight, Headphones, Mic, BookOpen, Edit3,
    CheckSquare, Book, Brain, Star, Users, Award,
    Sparkles, Play, CheckCircle, Zap, Globe, Shield
} from 'lucide-react'

const modules = [
    { icon: Headphones, title: 'Listening', desc: 'Audio comprehension', color: '#3B82F6', bg: '#EFF6FF' },
    { icon: Mic, title: 'Speaking', desc: 'Pronunciation & fluency', color: '#10B981', bg: '#ECFDF5' },
    { icon: BookOpen, title: 'Reading', desc: 'Text comprehension', color: '#8B5CF6', bg: '#F5F3FF' },
    { icon: Edit3, title: 'Writing', desc: 'Essay & grammar', color: '#F59E0B', bg: '#FFFBEB' },
    { icon: CheckSquare, title: 'Grammar', desc: 'Rules & exercises', color: '#EF4444', bg: '#FEF2F2' },
    { icon: Book, title: 'Vocabulary', desc: 'Word building', color: '#6366F1', bg: '#EEF2FF' },
    { icon: Brain, title: 'Critical Thinking', desc: 'JAM sessions', color: '#EC4899', bg: '#FDF2F8' },
]

const features = [
    { icon: Mic, title: 'AI Pronunciation', desc: 'Real-time speech analysis with instant feedback', color: '#3B82F6' },
    { icon: CheckCircle, title: 'Smart Grammar', desc: 'Instant error detection with explanations', color: '#10B981' },
    { icon: Zap, title: 'Adaptive Learning', desc: 'Personalized paths based on skill level', color: '#F59E0B' },
    { icon: Globe, title: 'Progress Analytics', desc: 'Detailed insights and performance tracking', color: '#8B5CF6' },
    { icon: Shield, title: 'Institution Tools', desc: 'Admin dashboard and student management', color: '#EF4444' },
    { icon: Sparkles, title: '24/7 Access', desc: 'Learn anytime on any device', color: '#6366F1' },
]

export default function Landing() {
    return (
        <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
            {/* Navigation */}
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '72px',
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid #E5E7EB',
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    {/* Logo */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                        <img
                            src={logoImg}
                            alt="NeuraLingua Logo"
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                objectFit: 'contain',
                            }}
                        />
                        <span style={{ fontWeight: '600', fontSize: '20px', color: '#1F2937' }}>NeuraLingua</span>
                    </Link>

                    {/* Nav Links */}
                    <div className="landing-nav-links">
                        <a href="#features" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Features</a>
                        <a href="#modules" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Modules</a>
                    </div>

                    {/* Auth Buttons */}
                    <div className="landing-nav-auth" style={{ gap: '12px' }}>
                        <Link to="/login" className="landing-signin-link" style={{
                            color: '#374151',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: '500',
                            padding: '10px 20px',
                            whiteSpace: 'nowrap',
                        }}>
                            Sign in
                        </Link>
                        <Link to="/register" className="landing-nav-getstarted" style={{
                            backgroundColor: '#1A73E8',
                            color: 'white',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: '500',
                            padding: '10px 24px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(26, 115, 232, 0.3)',
                            whiteSpace: 'nowrap',
                        }}>
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section style={{
                paddingTop: '140px',
                paddingBottom: '80px',
                backgroundColor: '#FFFFFF',
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Badge */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            backgroundColor: '#EFF6FF',
                            borderRadius: '100px',
                            marginBottom: '32px',
                        }}>
                            <Sparkles size={16} style={{ color: '#1A73E8' }} />
                            <span style={{ color: '#1A73E8', fontSize: '14px', fontWeight: '500' }}>AI-Powered Learning Platform</span>
                        </div>

                        {/* Headline */}
                        <h1 className="landing-hero-title" style={{ marginBottom: '24px' }}>
                            Master English with{' '}
                            <span style={{ color: '#1A73E8' }}>Intelligent AI</span>
                        </h1>

                        {/* Subheadline */}
                        <p className="landing-hero-subtitle" style={{ margin: '0 auto 40px' }}>
                            Comprehensive English training for schools and colleges.
                            Develop all language skills with personalized AI feedback.
                        </p>

                        {/* CTA Buttons */}
                        <div className="landing-hero-buttons">
                            <Link to="/register" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: '#1A73E8',
                                color: 'white',
                                textDecoration: 'none',
                                padding: '14px 28px',
                                borderRadius: '10px',
                                fontWeight: '500',
                                fontSize: '16px',
                                boxShadow: '0 4px 14px rgba(26, 115, 232, 0.4)',
                            }}>
                                Start Free Trial <ArrowRight size={18} />
                            </Link>
                            <button style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: 'white',
                                color: '#374151',
                                border: '1px solid #D1D5DB',
                                padding: '14px 28px',
                                borderRadius: '10px',
                                fontWeight: '500',
                                fontSize: '16px',
                                cursor: 'pointer',
                            }}>
                                <Play size={18} /> Watch Demo
                            </button>
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* Features Section */}
            <section id="features" style={{ padding: '80px 0', backgroundColor: '#F9FAFB' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '40px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
                            Why Choose NeuraLingua?
                        </h2>
                        <p style={{ fontSize: '18px', color: '#6B7280', maxWidth: '500px', margin: '0 auto' }}>
                            Our platform combines AI technology with proven learning methods
                        </p>
                    </div>

                    <div className="landing-features-grid">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '16px',
                                    padding: '32px',
                                    border: '1px solid #E5E7EB',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    backgroundColor: `${feature.color}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '20px',
                                }}>
                                    <feature.icon size={24} style={{ color: feature.color }} />
                                </div>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                                    {feature.title}
                                </h3>
                                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.6' }}>
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modules Section */}
            <section id="modules" style={{ padding: '80px 0', backgroundColor: '#FFFFFF' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '40px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
                            7 Learning Modules
                        </h2>
                        <p style={{ fontSize: '18px', color: '#6B7280', maxWidth: '500px', margin: '0 auto' }}>
                            Complete curriculum covering all aspects of English communication
                        </p>
                    </div>

                    <div className="landing-modules-grid">
                        {modules.map((mod, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '16px',
                                    padding: '24px 16px',
                                    border: '1px solid #E5E7EB',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '14px',
                                    backgroundColor: mod.bg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 16px',
                                }}>
                                    <mod.icon size={28} style={{ color: mod.color }} />
                                </div>
                                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                                    {mod.title}
                                </h3>
                                <p style={{ fontSize: '12px', color: '#9CA3AF' }}>
                                    {mod.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Table Section */}
            <section style={{ padding: '80px 0', backgroundColor: '#FFFFFF' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <h2 style={{ fontSize: '40px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
                            NeuraLingua vs Existing Platforms
                        </h2>
                        <p style={{ fontSize: '18px', color: '#6B7280', maxWidth: '520px', margin: '0 auto' }}>
                            See how we stack up against the competition
                        </p>
                    </div>

                    <div className="landing-comparison-wrapper">
                        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1a1a2e' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    {['Feature', 'NeuraLingua', 'Duolingo', 'Babbel', 'ELSA Speak'].map((h, i) => (
                                        <th key={i} style={{
                                            padding: '20px 24px',
                                            textAlign: 'left',
                                            fontSize: '14px',
                                            fontWeight: '700',
                                            color: i === 0 ? '#fff' : i === 1 ? '#fff' : '#f87171',
                                            backgroundColor: i === 1 ? 'rgba(26,115,232,0.2)' : 'transparent',
                                            borderRight: i < 4 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ['Target Users', 'Schools + Colleges', 'General learners', 'Adults', 'Individuals'],
                                    ['Communication Skills', 'Full training', { text: 'Limited', color: '#f87171' }, { text: 'Limited', color: '#f87171' }, 'Only speaking'],
                                    ['AI Pronunciation Feedback', true, 'Basic', false, true],
                                    ['AI Writing Evaluation', true, false, false, false],
                                    ['Reading & Comprehension', true, 'Limited', { text: 'Limited', color: '#f87171' }, false],
                                    ['Grammar Training', true, 'Basic', 'Strong', false],
                                    ['Critical Thinking', true, false, false, false],
                                    ['Interview Preparation', true, false, false, false],
                                    ['Presentation Skills', true, false, false, false],
                                    ['Group Discussion Practice', true, false, false, false],
                                    ['Placement Communication', true, false, false, false],
                                    ['College Dashboard', true, false, false, false],
                                ].map((row, rowIdx) => (
                                    <tr key={rowIdx} style={{
                                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                                        backgroundColor: rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                                    }}>
                                        {row.map((cell, colIdx) => (
                                            <td key={colIdx} style={{
                                                padding: '16px 24px',
                                                fontSize: '14px',
                                                color: colIdx === 0 ? '#e5e7eb' : '#9ca3af',
                                                fontWeight: colIdx === 0 ? '500' : '400',
                                                backgroundColor: colIdx === 1 ? 'rgba(26,115,232,0.1)' : 'transparent',
                                                borderRight: colIdx < 4 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                                            }}>
                                                {cell === true ? (
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#4ade80' }}>
                                                        <span style={{
                                                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                                            width: '20px', height: '20px', borderRadius: '4px', backgroundColor: '#16a34a',
                                                        }}>✓</span> Yes
                                                    </span>
                                                ) : cell === false ? (
                                                    <span style={{ color: '#f87171', fontSize: '18px', fontWeight: 'bold' }}>✕</span>
                                                ) : typeof cell === 'object' && cell.text ? (
                                                    <span style={{ color: cell.color }}>{cell.text}</span>
                                                ) : (
                                                    <span style={{ color: colIdx === 1 ? '#93c5fd' : '#9ca3af' }}>{cell}</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* CTA Section */}

            <section style={{ padding: '80px 0', backgroundColor: '#F9FAFB' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #1A73E8 0%, #4285F4 100%)',
                        borderRadius: '24px',
                        padding: '64px',
                        textAlign: 'center',
                        boxShadow: '0 20px 60px rgba(26, 115, 232, 0.3)',
                    }}>
                        <h2 style={{ fontSize: '36px', fontWeight: '700', color: 'white', marginBottom: '16px' }}>
                            Ready to Start Learning?
                        </h2>
                        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
                            Join hundreds of institutions improving student outcomes with NeuraLingua
                        </p>
                        <div className="landing-cta-buttons">
                            <Link to="/register" style={{
                                backgroundColor: 'white',
                                color: '#1A73E8',
                                textDecoration: 'none',
                                padding: '14px 32px',
                                borderRadius: '10px',
                                fontWeight: '600',
                                fontSize: '16px',
                            }}>
                                Get Started Free
                            </Link>
                            <Link to="/login" style={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                textDecoration: 'none',
                                padding: '14px 32px',
                                borderRadius: '10px',
                                fontWeight: '500',
                                fontSize: '16px',
                                border: '1px solid rgba(255,255,255,0.3)',
                            }}>
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '40px 0', backgroundColor: '#FFFFFF', borderTop: '1px solid #E5E7EB' }}>
                <div className="landing-footer-inner" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                            src={logoImg}
                            alt="NeuraLingua Logo"
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                objectFit: 'contain',
                            }}
                        />
                        <span style={{ fontWeight: '600', fontSize: '16px', color: '#374151' }}>NeuraLingua</span>
                    </div>

                    <div className="landing-footer-links">
                        <a href="#" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '14px' }}>Privacy</a>
                        <a href="#" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '14px' }}>Terms</a>
                        <a href="#" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '14px' }}>Contact</a>
                    </div>

                    {/* NeuraGlobal Branding */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Powered by</span>
                        <img
                            src={neuraGlobalIcon}
                            alt="NeuraGlobal"
                            style={{
                                height: '22px',
                                objectFit: 'contain',
                            }}
                        />
                        <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500' }}>NeuraGlobal</span>
                    </div>

                    <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>
                        © 2026 NeuraGlobal. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
