import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckSquare, Star, ChevronRight, Award, RefreshCw, Check, X } from 'lucide-react'
import { getModuleQuestions } from '../../services/questionService'
import { saveModuleScore } from '../../utils/localScoring'

export default function Grammar() {
    const [questions, setQuestions] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [showResult, setShowResult] = useState(false)
    const [isCorrect, setIsCorrect] = useState(false)
    const [score, setScore] = useState({ correct: 0, total: 0 })
    const [loading, setLoading] = useState(true)
    const [showExplanation, setShowExplanation] = useState(false)
    const [showPopup, setShowPopup] = useState(false);
    const [completedQuestions, setCompletedQuestions] = useState(() => {
        const saved = localStorage.getItem('neuraLingua_completed_grammar');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('neuraLingua_completed_grammar', JSON.stringify(completedQuestions));
    }, [completedQuestions]);

    useEffect(() => {
        fetchQuestions()
    }, [])

    const fetchQuestions = async () => {
        try {
            const questions = await getModuleQuestions('grammar')
            setQuestions(questions)
        } catch (error) {
            console.error('Failed to fetch questions:', error)
        } finally {
            setLoading(false)
        }
    }

    const currentQuestion = questions[currentIndex]

    const handleSelectAnswer = (value) => {
        if (showResult) return
        setSelectedAnswer(value)
    }

    const handleCheckAnswer = async () => {
        if (!selectedAnswer) return

        const correct = selectedAnswer === currentQuestion.correct_answer
        setIsCorrect(correct)
        setShowResult(true)
        setShowExplanation(true)
        setScore(prev => {
            const newScore = {
                correct: prev.correct + (correct ? 1 : 0),
                total: prev.total + 1
            };

            // Check if this is the last question
            if (currentIndex === questions.length - 1) {
                const finalPercent = Math.round((newScore.correct / newScore.total) * 100);
                saveModuleScore('grammar', finalPercent, newScore.total * 60);
            }

            return newScore;
        })
        if (!completedQuestions.includes(currentIndex)) {
            setCompletedQuestions(prev => [...prev, currentIndex])
        }
    }

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1)
            setSelectedAnswer(null)
            setShowResult(false)
            setShowExplanation(false)
        }
    }

    const handleRestart = () => {
        setCurrentIndex(0)
        setSelectedAnswer(null)
        setShowResult(false)
        setShowExplanation(false)
        setScore({ correct: 0, total: 0 })
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
                    borderTop: '4px solid #EF4444',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                }} />
            </div>
        )
    }

    if (!questions.length) {
        return (
            <div style={{
                padding: '32px',
                backgroundColor: '#F9FAFB',
                minHeight: '100vh',
            }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '48px',
                    textAlign: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                    <CheckSquare size={48} style={{ color: '#D1D5DB', marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>No questions available</h3>
                    <p style={{ color: '#6B7280', marginTop: '8px' }}>Check back later for new grammar exercises.</p>
                </div>
            </div>
        )
    }

    const progress = ((currentIndex + 1) / questions.length) * 100
    const scorePercent = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0

    return (
        <div className="page-container" style={{
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
                flexWrap: 'wrap',
                gap: '12px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <CheckSquare size={24} style={{ color: 'white' }} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 }}>
                            Grammar Practice
                        </h1>
                        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
                            Master English grammar rules
                        </p>
                    </div>
                </div>

                {/* Score Display */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                }}>
                    <div style={{
                        padding: '12px 24px',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                    }}>
                        <Award size={24} style={{ color: '#F59E0B' }} />
                        <div>
                            <p style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 }}>
                                {score.correct}/{score.total}
                            </p>
                            <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Score</p>
                        </div>
                    </div>
                    <div style={{
                        padding: '12px 24px',
                        backgroundColor: scorePercent >= 70 ? '#DCFCE7' : scorePercent >= 40 ? '#FEF3C7' : '#FEE2E2',
                        borderRadius: '12px',
                        textAlign: 'center',
                    }}>
                        <p style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: scorePercent >= 70 ? '#16A34A' : scorePercent >= 40 ? '#D97706' : '#DC2626',
                            margin: 0
                        }}>
                            {scorePercent}%
                        </p>
                        <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Accuracy</p>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                }}>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                        Question {currentIndex + 1} of {questions.length}
                        {completedQuestions.includes(currentIndex) && <CheckCircle size={16} style={{ color: '#22C55E', marginLeft: '8px' }} />}
                    </span>
                    <span style={{ fontSize: '14px', color: '#6B7280' }}>
                        {Math.round(progress)}% Complete
                    </span>
                </div>
                <div style={{
                    height: '8px',
                    backgroundColor: '#E5E7EB',
                    borderRadius: '4px',
                    overflow: 'hidden',
                }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        style={{
                            height: '100%',
                            background: 'linear-gradient(90deg, #EF4444 0%, #F87171 100%)',
                            borderRadius: '4px',
                        }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '32px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                }}
            >
                {/* Difficulty Badge */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '20px',
                }}>
                    <Star size={16} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                    <span style={{ fontSize: '13px', color: '#6B7280' }}>
                        Difficulty: {currentQuestion.difficulty === 1 ? 'Easy' : currentQuestion.difficulty === 2 ? 'Medium' : 'Hard'}
                    </span>
                </div>

                {/* Question Text */}
                <h2 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '28px',
                    lineHeight: '1.6',
                }}>
                    {currentQuestion.content}
                </h2>

                {/* Answer Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    {currentQuestion.options?.map((option, idx) => {
                        const isSelected = selectedAnswer === option.value
                        const isCorrectOption = option.value === currentQuestion.correct_answer
                        const showCorrectHighlight = showResult && isCorrectOption
                        const showWrongHighlight = showResult && isSelected && !isCorrectOption

                        return (
                            <motion.button
                                key={idx}
                                onClick={() => handleSelectAnswer(option.value)}
                                whileHover={!showResult ? { scale: 1.01 } : {}}
                                whileTap={!showResult ? { scale: 0.99 } : {}}
                                style={{
                                    width: '100%',
                                    padding: '16px 20px',
                                    borderRadius: '12px',
                                    border: '2px solid',
                                    borderColor: showCorrectHighlight ? '#22C55E'
                                        : showWrongHighlight ? '#EF4444'
                                            : isSelected ? '#3B82F6'
                                                : '#E5E7EB',
                                    backgroundColor: showCorrectHighlight ? '#F0FDF4'
                                        : showWrongHighlight ? '#FEF2F2'
                                            : isSelected ? '#EFF6FF'
                                                : 'white',
                                    cursor: showResult ? 'default' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    transition: 'all 0.2s ease',
                                    textAlign: 'left',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        backgroundColor: showCorrectHighlight ? '#22C55E'
                                            : showWrongHighlight ? '#EF4444'
                                                : isSelected ? '#3B82F6'
                                                    : '#F3F4F6',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        color: (showCorrectHighlight || showWrongHighlight || isSelected) ? 'white' : '#6B7280',
                                    }}>
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <span style={{
                                        fontSize: '16px',
                                        fontWeight: isSelected ? '500' : '400',
                                        color: '#1F2937',
                                    }}>
                                        {option.text}
                                    </span>
                                </div>
                                {showResult && (
                                    <div>
                                        {showCorrectHighlight && <Check size={20} style={{ color: '#22C55E' }} />}
                                        {showWrongHighlight && <X size={20} style={{ color: '#EF4444' }} />}
                                    </div>
                                )}
                            </motion.button>
                        )
                    })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                    {showExplanation && currentQuestion.explanation && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{
                                padding: '16px 20px',
                                backgroundColor: '#F0F9FF',
                                borderRadius: '12px',
                                borderLeft: '4px solid #3B82F6',
                                marginBottom: '24px',
                            }}
                        >
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#1E40AF', marginBottom: '4px' }}>
                                Explanation
                            </p>
                            <p style={{ fontSize: '14px', color: '#1E3A8A', margin: 0, lineHeight: '1.6' }}>
                                {currentQuestion.explanation}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    {!showResult ? (
                        <button
                            onClick={handleCheckAnswer}
                            disabled={!selectedAnswer}
                            style={{
                                padding: '14px 32px',
                                borderRadius: '10px',
                                border: 'none',
                                background: selectedAnswer
                                    ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
                                    : '#E5E7EB',
                                color: selectedAnswer ? 'white' : '#9CA3AF',
                                fontSize: '15px',
                                fontWeight: '600',
                                cursor: selectedAnswer ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: selectedAnswer ? '0 4px 14px rgba(59, 130, 246, 0.4)' : 'none',
                            }}
                        >
                            <Check size={18} />
                            Check Answer
                        </button>
                    ) : currentIndex < questions.length - 1 ? (
                        <button
                            onClick={handleNext}
                            style={{
                                padding: '14px 32px',
                                borderRadius: '10px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                                color: 'white',
                                fontSize: '15px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                            }}
                        >
                            Next Question
                            <ChevronRight size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowPopup(true)}
                            style={{
                                padding: '14px 32px',
                                borderRadius: '10px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                                color: 'white',
                                fontSize: '15px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)',
                            }}
                        >
                            <Award size={18} />
                            Final Submit
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Completion Popup */}
            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '20px',
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '24px',
                                padding: '40px',
                                maxWidth: '400px',
                                width: '100%',
                                textAlign: 'center',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px',
                                color: 'white',
                            }}>
                                <Award size={40} />
                            </div>

                            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>
                                Module Complete!
                            </h2>
                            <p style={{ color: '#6B7280', marginBottom: '32px' }}>
                                You've finished the Grammar practice session.
                            </p>

                            <div style={{
                                marginBottom: '32px',
                                padding: '20px',
                                backgroundColor: '#F8FAFC',
                                borderRadius: '16px',
                            }}>
                                <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '4px' }}>Final accuracy</p>
                                <p style={{ fontSize: '36px', fontWeight: '800', color: '#EF4444', margin: 0 }}>
                                    {scorePercent}%
                                </p>
                            </div>

                            <div style={{ display: 'grid', gap: '12px' }}>
                                <button
                                    onClick={() => {
                                        setShowPopup(false);
                                        handleRestart();
                                    }}
                                    style={{
                                        padding: '14px',
                                        borderRadius: '12px',
                                        border: '2px solid #E2E8F0',
                                        background: 'white',
                                        color: '#475569',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Retest
                                </button>
                                <button
                                    onClick={() => {
                                        setShowPopup(false);
                                        handleNext();
                                    }}
                                    style={{
                                        padding: '14px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
                                        color: 'white',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Next Question
                                </button>
                                <button
                                    onClick={() => window.location.href = '/dashboard'}
                                    style={{
                                        padding: '14px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: '#F1F5F9',
                                        color: '#475569',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Next Module
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
