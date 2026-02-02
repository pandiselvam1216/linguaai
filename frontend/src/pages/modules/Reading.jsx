import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Clock, Send, CheckCircle, XCircle, ChevronRight } from 'lucide-react'
import api from '../../services/api'

export default function Reading() {
    const [passages, setPassages] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(true)
    const [timeLeft, setTimeLeft] = useState(600)

    useEffect(() => {
        fetchPassages()
    }, [])

    useEffect(() => {
        if (!submitted && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1)
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [submitted, timeLeft])

    const fetchPassages = async () => {
        try {
            const response = await api.get('/reading/passages')
            setPassages(response.data.passages || [])
        } catch (error) {
            console.error('Failed to fetch passages:', error)
        } finally {
            setLoading(false)
        }
    }

    const currentPassage = passages[currentIndex]

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }))
    }

    const handleSubmit = async () => {
        if (Object.keys(answers).length === 0) return

        setSubmitted(true)
        try {
            const response = await api.post('/reading/submit', {
                passage_id: currentPassage.id,
                answers: answers
            })
            setResults(response.data)
        } catch (error) {
            console.error('Failed to submit:', error)
            // Mock feedback for demo
            setResults({
                score: 85,
                feedback: 'Good comprehension of the main ideas.',
                correct: Object.keys(answers).length - 1,
                total: Object.keys(answers).length
            })
        }
    }

    const handleNext = () => {
        if (currentIndex < passages.length - 1) {
            setCurrentIndex(prev => prev + 1)
            setAnswers({})
            setSubmitted(false)
            setResults(null)
            setTimeLeft(600)
        }
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
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
                    borderTop: '4px solid #8B5CF6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                }} />
            </div>
        )
    }

    if (!passages.length) {
        return (
            <div style={{ padding: '32px', backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '48px',
                    textAlign: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                    <BookOpen size={48} style={{ color: '#D1D5DB', marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>No reading passages available</h3>
                    <p style={{ color: '#6B7280', marginTop: '8px' }}>Check back later for new content.</p>
                </div>
            </div>
        )
    }

    const questions = currentPassage?.options || []

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
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <BookOpen size={24} style={{ color: 'white' }} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 }}>
                            Reading Comprehension
                        </h1>
                        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
                            Read passages and answer questions
                        </p>
                    </div>
                </div>

                {/* Timer */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    backgroundColor: timeLeft < 60 ? '#FEE2E2' : 'white',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                    <Clock size={20} style={{ color: timeLeft < 60 ? '#EF4444' : '#6B7280' }} />
                    <span style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: timeLeft < 60 ? '#EF4444' : '#111827',
                        fontFamily: 'monospace',
                    }}>
                        {formatTime(timeLeft)}
                    </span>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Passage Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                    }}
                >
                    <div style={{
                        padding: '20px 24px',
                        borderBottom: '1px solid #F3F4F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <BookOpen size={18} style={{ color: '#8B5CF6' }} />
                            <h2 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#111827',
                                margin: 0,
                            }}>
                                {currentPassage.title}
                            </h2>
                        </div>
                        <span style={{
                            fontSize: '12px',
                            color: '#6B7280',
                            padding: '4px 10px',
                            backgroundColor: '#F3F4F6',
                            borderRadius: '6px',
                        }}>
                            Passage {currentIndex + 1} of {passages.length}
                        </span>
                    </div>
                    <div style={{
                        padding: '24px',
                        maxHeight: '500px',
                        overflowY: 'auto',
                    }}>
                        <p style={{
                            fontSize: '15px',
                            color: '#374151',
                            lineHeight: '1.8',
                            margin: 0,
                        }}>
                            {currentPassage.passage_text || currentPassage.content}
                        </p>
                    </div>
                </motion.div>

                {/* Questions Card */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                    }}
                >
                    <div style={{
                        padding: '20px 24px',
                        borderBottom: '1px solid #F3F4F6',
                    }}>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#111827',
                            margin: 0,
                        }}>
                            Questions
                        </h3>
                    </div>
                    <div style={{
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                    }}>
                        {questions.length > 0 ? (
                            questions.map((q, idx) => (
                                <div key={idx}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: '#374151',
                                        marginBottom: '10px',
                                    }}>
                                        {idx + 1}. {q.question}
                                    </label>
                                    <input
                                        type="text"
                                        value={answers[idx] || ''}
                                        onChange={(e) => handleAnswerChange(idx, e.target.value)}
                                        disabled={submitted}
                                        placeholder="Type your answer..."
                                        style={{
                                            width: '100%',
                                            padding: '14px 16px',
                                            borderRadius: '10px',
                                            border: '2px solid',
                                            borderColor: submitted
                                                ? (answers[idx]?.toLowerCase() === q.correct_answer?.toLowerCase() ? '#22C55E' : '#EF4444')
                                                : '#E5E7EB',
                                            backgroundColor: submitted ? '#F9FAFB' : 'white',
                                            fontSize: '14px',
                                            outline: 'none',
                                            transition: 'all 0.2s',
                                        }}
                                        onFocus={(e) => {
                                            if (!submitted) e.target.style.borderColor = '#8B5CF6'
                                        }}
                                        onBlur={(e) => {
                                            if (!submitted) e.target.style.borderColor = '#E5E7EB'
                                        }}
                                    />
                                    {submitted && (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            marginTop: '8px',
                                        }}>
                                            {answers[idx]?.toLowerCase() === q.correct_answer?.toLowerCase() ? (
                                                <>
                                                    <CheckCircle size={14} style={{ color: '#22C55E' }} />
                                                    <span style={{ fontSize: '13px', color: '#22C55E' }}>Correct!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle size={14} style={{ color: '#EF4444' }} />
                                                    <span style={{ fontSize: '13px', color: '#EF4444' }}>
                                                        Correct answer: {q.correct_answer}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#374151',
                                    marginBottom: '10px',
                                }}>
                                    What is the main idea of this passage?
                                </label>
                                <textarea
                                    value={answers['main'] || ''}
                                    onChange={(e) => handleAnswerChange('main', e.target.value)}
                                    disabled={submitted}
                                    placeholder="Write your answer here..."
                                    rows={4}
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        borderRadius: '10px',
                                        border: '2px solid #E5E7EB',
                                        backgroundColor: submitted ? '#F9FAFB' : 'white',
                                        fontSize: '14px',
                                        outline: 'none',
                                        resize: 'vertical',
                                        fontFamily: 'inherit',
                                    }}
                                />
                            </div>
                        )}

                        {/* Results */}
                        <AnimatePresence>
                            {results && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        padding: '16px 20px',
                                        backgroundColor: results.score >= 70 ? '#F0FDF4' : '#FEF3C7',
                                        borderRadius: '12px',
                                        borderLeft: `4px solid ${results.score >= 70 ? '#22C55E' : '#F59E0B'}`,
                                    }}
                                >
                                    <p style={{
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        color: results.score >= 70 ? '#166534' : '#D97706',
                                        margin: 0,
                                        marginBottom: '4px',
                                    }}>
                                        Score: {results.score}%
                                    </p>
                                    <p style={{
                                        fontSize: '14px',
                                        color: results.score >= 70 ? '#15803D' : '#CA8A04',
                                        margin: 0,
                                    }}>
                                        {results.feedback}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Actions */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                            {!submitted ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={Object.keys(answers).length === 0}
                                    style={{
                                        padding: '14px 28px',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: Object.keys(answers).length > 0
                                            ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
                                            : '#E5E7EB',
                                        color: Object.keys(answers).length > 0 ? 'white' : '#9CA3AF',
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        cursor: Object.keys(answers).length > 0 ? 'pointer' : 'not-allowed',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        boxShadow: Object.keys(answers).length > 0 ? '0 4px 14px rgba(139, 92, 246, 0.4)' : 'none',
                                    }}
                                >
                                    <Send size={18} />
                                    Submit Answers
                                </button>
                            ) : currentIndex < passages.length - 1 && (
                                <button
                                    onClick={handleNext}
                                    style={{
                                        padding: '14px 28px',
                                        borderRadius: '10px',
                                        border: 'none',
                                        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                                        color: 'white',
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
                                    }}
                                >
                                    Next Passage
                                    <ChevronRight size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
