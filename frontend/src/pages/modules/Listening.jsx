import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Headphones, Play, Pause, Volume2, VolumeX, Check, X, ChevronRight, Award, Clock, RotateCcw, CheckCircle } from 'lucide-react'
import { getModuleQuestions } from '../../services/questionService'
import { saveModuleScore } from '../../utils/localScoring'

export default function Listening() {
    const [questions, setQuestions] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [showResult, setShowResult] = useState(false)
    const [isCorrect, setIsCorrect] = useState(false)
    const [score, setScore] = useState({ correct: 0, total: 0 })
    const [loading, setLoading] = useState(true)
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [isMuted, setIsMuted] = useState(false)
    const [completedQuestions, setCompletedQuestions] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    // removed local storage syncing

    const audioRef = useRef(null)

    useEffect(() => {
        fetchQuestions()
    }, [])

    // removed local storage syncing

    // Sync mute state with audio element
    useEffect(() => {
        if (audioRef.current) audioRef.current.muted = isMuted
    }, [isMuted])

    // When question changes, reset audio
    useEffect(() => {
        setIsPlaying(false)
        setProgress(0)
        setCurrentTime(0)
        setDuration(0)
    }, [currentIndex])

    const fetchQuestions = async () => {
        try {
            const questions = await getModuleQuestions('listening')
            setQuestions(questions)
        } catch (error) {
            console.error('Failed to fetch questions:', error)
        } finally {
            setLoading(false)
        }
    }

    const currentQuestion = questions[currentIndex]

    const handlePlayPause = () => {
        const audio = audioRef.current
        if (!audio) return
        if (isPlaying) {
            audio.pause()
        } else {
            audio.play()
        }
        setIsPlaying(!isPlaying)
    }

    const handleAudioTimeUpdate = () => {
        const audio = audioRef.current
        if (!audio) return
        setCurrentTime(audio.currentTime)
        setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0)
    }

    const handleAudioLoaded = () => {
        const audio = audioRef.current
        if (!audio) return
        setDuration(audio.duration)
    }

    const handleAudioEnded = () => {
        setIsPlaying(false)
        setProgress(100)
    }

    const handleSelectQuestion = (index) => {
        if (isPlaying) {
            audioRef.current?.pause()
            setIsPlaying(false)
        }
        setCurrentIndex(index)
        setSelectedAnswer(null)
        setShowResult(false)
        setProgress(0)
        setCurrentTime(0)
    }

    const handleSelectAnswer = (value) => {
        if (showResult) return
        setSelectedAnswer(value)
    }

    const handleSubmit = async () => {
        if (!selectedAnswer) return

        const correct = selectedAnswer === currentQuestion.correct_answer
        setIsCorrect(correct)
        setShowResult(true)

        if (correct && !completedQuestions.includes(currentQuestion.id)) {
            setCompletedQuestions(prev => [...prev, currentQuestion.id])
        }

        setScore(prev => {
            const newScore = {
                correct: prev.correct + (correct ? 1 : 0),
                total: prev.total + 1
            };

            // Check if this is the last question
            if (currentIndex === questions.length - 1) {
                const finalPercent = Math.round((newScore.correct / newScore.total) * 100);
                saveModuleScore('listening', finalPercent, newScore.total * 60);
            }

            return newScore;
        })
    }

    const handleReset = () => {
        setSelectedAnswer(null)
        setShowResult(false)
        setProgress(0)
        setCurrentTime(0)
        setIsPlaying(false)
        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
        }
    }

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            handleSelectQuestion(currentIndex + 1)
        }
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
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
                    borderTop: '4px solid #3B82F6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                }} />
            </div>
        )
    }

    if (!questions.length) {
        return (
            <div style={{ padding: '32px', backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '48px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                    <Headphones size={48} style={{ color: '#D1D5DB', marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>No listening exercises available</h3>
                    <p style={{ color: '#6B7280', marginTop: '8px', margin: '8px 0 0 0' }}>Check back later for new content.</p>
                </div>
            </div>
        )
    }

    const questionProgress = ((currentIndex + 1) / questions.length) * 100

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
                gap: '16px',
                marginBottom: '24px',
                flexWrap: 'wrap',
            }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}>
                    <Headphones size={24} style={{ color: 'white' }} />
                </div>
                <div>
                    <h1 style={{ fontWeight: '700', color: '#111827', margin: 0 }}>
                        Listening Practice
                    </h1>
                    <p style={{ color: '#6B7280', margin: 0 }}>
                        Improve your audio comprehension skills
                    </p>
                </div>
            </div>

            <div className="grid-sidebar">
                {/* Topics Sidebar */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    height: 'fit-content',
                }}>
                    <h3 style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#6B7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '16px',
                    }}>
                        Exercises
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {questions.map((q, idx) => (
                            <motion.button
                                key={q.id}
                                onClick={() => handleSelectQuestion(idx)}
                                whileHover={{ x: 4 }}
                                style={{
                                    padding: '14px 16px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    backgroundColor: currentIndex === idx ? '#EFF6FF' : 'transparent',
                                    borderLeft: currentIndex === idx ? '3px solid #3B82F6' : '3px solid transparent',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    position: 'relative',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <p style={{
                                        fontSize: '14px',
                                        fontWeight: currentIndex === idx ? '600' : '500',
                                        color: currentIndex === idx ? '#1E40AF' : '#374151',
                                        margin: 0,
                                        flex: 1,
                                    }}>
                                        {q.title || `Exercise ${idx + 1}`}
                                    </p>
                                    {completedQuestions.includes(q.id) && (
                                        <CheckCircle size={16} style={{ color: '#22C55E' }} />
                                    )}
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Prompt Card */}
                    {currentQuestion && (
                        <motion.div
                            key={`prompt-${currentQuestion.id}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                padding: '24px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                marginBottom: '16px',
                                flexWrap: 'wrap',
                                gap: '12px'
                            }}>
                                <h2 style={{
                                    fontSize: '20px',
                                    fontWeight: '600',
                                    color: '#111827',
                                    margin: 0,
                                }}>
                                    {currentQuestion.title}
                                </h2>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '6px 12px',
                                    backgroundColor: '#EFF6FF',
                                    borderRadius: '20px',
                                }}>
                                    <Headphones size={14} style={{ color: '#3B82F6' }} />
                                    <span style={{ fontSize: '13px', color: '#1E40AF', fontWeight: '500' }}>
                                        Listening
                                    </span>
                                </div>
                            </div>
                            <p style={{
                                fontSize: '15px',
                                color: '#4B5563',
                                lineHeight: '1.6',
                                margin: 0,
                            }}>
                                {currentQuestion.content}
                            </p>
                        </motion.div>
                    )}

                    {/* Playback Area (Matches Speaking Recording Area) */}
                    <div className="card" style={{
                        padding: 'min(40px, 6vw)',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'min(32px, 5vw)',
                            marginBottom: '20px',
                            flexWrap: 'wrap',
                        }}>
                            {/* Circular Audio Progress (Matches Speaking Timer) */}
                            <div style={{ position: 'relative', width: '120px', height: '120px', flexShrink: 0 }}>
                                <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                                    <circle cx="60" cy="60" r="54" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                                    <circle
                                        cx="60" cy="60" r="54"
                                        stroke="#3B82F6"
                                        strokeWidth="8" fill="none"
                                        strokeDasharray={`${2 * Math.PI * 54}`}
                                        strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
                                        strokeLinecap="round"
                                        style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                                    />
                                </svg>
                                <div style={{
                                    position: 'absolute', top: '50%', left: '50%',
                                    transform: 'translate(-50%, -50%)', textAlign: 'center',
                                }}>
                                    <p style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0, fontFamily: 'monospace' }}>
                                        {formatTime(currentTime)}
                                    </p>
                                </div>
                            </div>
 
                            {/* Divider - hide on small screens when wrapping */}
                            <div style={{ width: '1px', height: '80px', backgroundColor: '#E5E7EB', display: window.innerWidth < 480 ? 'none' : 'block' }} />
 
                            {/* Play Button (Matches Speaking Mic Button) */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                <motion.button
                                    onClick={handlePlayPause}
                                    disabled={!currentQuestion.audio_data}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    animate={isPlaying ? {
                                        boxShadow: ['0 0 0 0 rgba(59,130,246,0.4)', '0 0 0 20px rgba(59,130,246,0)', '0 0 0 0 rgba(59,130,246,0.4)']
                                    } : {}}
                                    transition={isPlaying ? { duration: 1.5, repeat: Infinity } : {}}
                                    style={{
                                        width: '80px', height: '80px', borderRadius: '50%', border: 'none',
                                        background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
                                        cursor: currentQuestion.audio_data ? 'pointer' : 'default',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                                        opacity: currentQuestion.audio_data ? 1 : 0.5,
                                    }}
                                >
                                    {isPlaying ? <Pause size={32} style={{ color: 'white' }} /> : <Play size={32} style={{ color: 'white', marginLeft: '4px' }} />}
                                </motion.button>
                                <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, fontWeight: '500' }}>
                                    {isPlaying ? 'Playing...' : 'Tap to play'}
                                </p>
                            </div>
                        </div>
 
                        {currentQuestion.audio_data && (
                            <audio
                                ref={audioRef}
                                src={currentQuestion.audio_data}
                                onTimeUpdate={handleAudioTimeUpdate}
                                onLoadedMetadata={handleAudioLoaded}
                                onEnded={handleAudioEnded}
                                muted={isMuted}
                                style={{ display: 'none' }}
                            />
                        )}
 
                        <p style={{ color: '#6B7280', marginBottom: '0' }}>
                            {currentQuestion.audio_data ? (isPlaying ? 'Listen carefully to the audio' : 'Click play to start the exercise') : 'Read the content above to answer'}
                        </p>
                    </div>

                    {/* Answer Options */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '32px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#111827',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}>
                            <CheckCircle size={18} style={{ color: '#3B82F6' }} />
                            Select the correct answer
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {currentQuestion.options?.map((option, idx) => {
                                const isSelected = selectedAnswer === option.value
                                const isCorrectOption = option.value === currentQuestion.correct_answer
                                const showCorrect = showResult && isCorrectOption
                                const showWrong = showResult && isSelected && !isCorrectOption

                                return (
                                    <motion.button
                                        key={idx}
                                        onClick={() => handleSelectAnswer(option.value)}
                                        whileHover={!showResult ? { scale: 1.01, x: 4 } : {}}
                                        style={{
                                            width: '100%',
                                            padding: '16px 20px',
                                            borderRadius: '12px',
                                            border: '2px solid',
                                            borderColor: showCorrect ? '#22C55E'
                                                : showWrong ? '#EF4444'
                                                    : isSelected ? '#3B82F6'
                                                        : '#E5E7EB',
                                            backgroundColor: showCorrect ? '#F0FDF4'
                                                : showWrong ? '#FEF2F2'
                                                    : isSelected ? '#EFF6FF'
                                                        : 'white',
                                            cursor: showResult ? 'default' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            textAlign: 'left',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        <span style={{
                                            fontSize: '15px',
                                            fontWeight: isSelected ? '500' : '400',
                                            color: '#1F2937',
                                        }}>
                                            {option.text}
                                        </span>
                                        {showResult && (
                                            <>
                                                {showCorrect && <Check size={20} style={{ color: '#22C55E' }} />}
                                                {showWrong && <X size={20} style={{ color: '#EF4444' }} />}
                                            </>
                                        )}
                                    </motion.button>
                                )
                            })}
                        </div>

                        {/* Result Feedback */}
                        <AnimatePresence>
                            {showResult && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        padding: '16px 20px',
                                        borderRadius: '12px',
                                        backgroundColor: isCorrect ? '#F0FDF4' : '#FEF2F2',
                                        borderLeft: `4px solid ${isCorrect ? '#22C55E' : '#EF4444'}`,
                                        marginTop: '24px',
                                    }}
                                >
                                    <p style={{
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        color: isCorrect ? '#166534' : '#991B1B',
                                        margin: 0,
                                    }}>
                                        {isCorrect ? '🎉 Correct! Well done!' : '❌ Incorrect. The right answer is highlighted above.'}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Actions */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                            <button
                                onClick={handleReset}
                                style={{
                                    padding: '12px 20px',
                                    borderRadius: '10px',
                                    border: '1px solid #E5E7EB',
                                    backgroundColor: 'white',
                                    color: '#374151',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                }}
                            >
                                <RotateCcw size={16} />
                                Reset
                            </button>
                            {!showResult ? (
                                <button
                                    onClick={handleSubmit}
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
                                    Submit Answer
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
                                        background: 'linear-gradient(135deg, #111827 0%, #374151 100%)',
                                        color: 'white',
                                        fontSize: '15px',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                                    }}
                                >
                                    <CheckCircle size={18} />
                                    Final Submit
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Completion Popup */}
            <AnimatePresence>
                {showPopup && (
                    <div style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                    }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '24px',
                                padding: '40px',
                                width: '90%',
                                maxWidth: '480px',
                                textAlign: 'center',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                            }}
                        >
                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>Topic Completed!</h2>
                            <p style={{ color: '#6B7280', marginBottom: '32px' }}>Here is your overall performance summary.</p>

                            {/* Circular Score */}
                            <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 32px auto' }}>
                                <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
                                    <circle cx="80" cy="80" r="72" stroke="#E5E7EB" strokeWidth="12" fill="none" />
                                    <circle
                                        cx="80" cy="80" r="72"
                                        stroke={(score.total > 0 && (score.correct / score.total) >= 0.7) ? "#22C55E" : ((score.total > 0 && (score.correct / score.total) >= 0.4) ? "#EAB308" : "#EF4444")}
                                        strokeWidth="12" fill="none"
                                        strokeDasharray={`${2 * Math.PI * 72}`}
                                        strokeDashoffset={`${2 * Math.PI * 72 * (1 - (score.total > 0 ? (score.correct / score.total) : (isCorrect ? 1 : 0)))}`}
                                        strokeLinecap="round"
                                        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                                    />
                                </svg>
                                <div style={{
                                    position: 'absolute', top: '50%', left: '50%',
                                    transform: 'translate(-50%, -50%)', textAlign: 'center',
                                }}>
                                    <p style={{ fontSize: '36px', fontWeight: '800', color: '#111827', margin: 0 }}>
                                        {score.total > 0 ? Math.round((score.correct / score.total) * 100) : (isCorrect ? 100 : 0)}%
                                    </p>
                                    <p style={{ fontSize: '14px', color: '#6B7280', margin: 0, fontWeight: '500' }}>Score</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {currentIndex < questions.length - 1 && (
                                    <button
                                        onClick={() => { setShowPopup(false); handleNext(); }}
                                        style={{
                                            padding: '14px 24px', borderRadius: '12px', border: 'none',
                                            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                                            color: 'white', fontSize: '16px', fontWeight: '600', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                        }}
                                    >
                                        Next Topic <ChevronRight size={18} />
                                    </button>
                                )}
                                <button
                                    onClick={() => window.location.href = '/dashboard'}
                                    style={{
                                        padding: '14px 24px', borderRadius: '12px', border: 'none',
                                        background: (currentIndex < questions.length - 1) ? '#F3F4F6' : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                                        color: (currentIndex < questions.length - 1) ? '#374151' : 'white', fontSize: '16px', fontWeight: '600', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                    }}
                                >
                                    Next Module <ChevronRight size={18} />
                                </button>
                                <button
                                    onClick={() => { setShowPopup(false); handleReset(); }}
                                    style={{
                                        padding: '14px 24px', borderRadius: '12px', border: '2px solid #E5E7EB',
                                        backgroundColor: 'white',
                                        color: '#4B5563', fontSize: '16px', fontWeight: '600', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                    }}
                                >
                                    <RotateCcw size={18} /> Retest
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
