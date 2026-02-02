import { Link } from 'react-router-dom'
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
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #1A73E8 0%, #4285F4 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(26, 115, 232, 0.3)',
                        }}>
                            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>N</span>
                        </div>
                        <span style={{ fontWeight: '600', fontSize: '20px', color: '#1F2937' }}>NeuraLingua</span>
                    </Link>

                    {/* Nav Links */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                        <a href="#features" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Features</a>
                        <a href="#modules" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Modules</a>
                        <Link to="/pricing" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Pricing</Link>
                    </div>

                    {/* Auth Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Link to="/login" style={{
                            color: '#374151',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: '500',
                            padding: '10px 20px',
                        }}>
                            Sign in
                        </Link>
                        <Link to="/register" style={{
                            backgroundColor: '#1A73E8',
                            color: 'white',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: '500',
                            padding: '10px 24px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(26, 115, 232, 0.3)',
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
                        <h1 style={{
                            fontSize: '56px',
                            fontWeight: '700',
                            color: '#111827',
                            lineHeight: '1.1',
                            marginBottom: '24px',
                            maxWidth: '800px',
                            margin: '0 auto 24px',
                        }}>
                            Master English with{' '}
                            <span style={{ color: '#1A73E8' }}>Intelligent AI</span>
                        </h1>

                        {/* Subheadline */}
                        <p style={{
                            fontSize: '20px',
                            color: '#6B7280',
                            lineHeight: '1.6',
                            maxWidth: '600px',
                            margin: '0 auto 40px',
                        }}>
                            Comprehensive English training for schools and colleges.
                            Develop all language skills with personalized AI feedback.
                        </p>

                        {/* CTA Buttons */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '60px' }}>
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

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '48px',
                            maxWidth: '700px',
                            margin: '0 auto',
                            padding: '40px 0',
                            borderTop: '1px solid #E5E7EB',
                        }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <Users size={24} style={{ color: '#1A73E8', marginBottom: '12px' }} />
                            <div style={{ fontSize: '36px', fontWeight: '700', color: '#111827' }}>50,000+</div>
                            <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>Active Students</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Award size={24} style={{ color: '#1A73E8', marginBottom: '12px' }} />
                            <div style={{ fontSize: '36px', fontWeight: '700', color: '#111827' }}>500+</div>
                            <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>Institutions</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <Star size={24} style={{ color: '#F59E0B', marginBottom: '12px' }} />
                            <div style={{ fontSize: '36px', fontWeight: '700', color: '#111827' }}>4.9/5</div>
                            <div style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>User Rating</div>
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

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '24px',
                    }}>
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

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '16px',
                    }}>
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
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
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
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            backgroundColor: '#1A73E8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>N</span>
                        </div>
                        <span style={{ fontWeight: '600', fontSize: '16px', color: '#374151' }}>NeuraLingua</span>
                    </div>

                    <div style={{ display: 'flex', gap: '32px' }}>
                        <a href="#" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '14px' }}>Privacy</a>
                        <a href="#" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '14px' }}>Terms</a>
                        <a href="#" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '14px' }}>Contact</a>
                    </div>

                    <p style={{ fontSize: '14px', color: '#9CA3AF' }}>
                        © 2026 NeuraGlobal. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
