import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Headphones, Play, Pause, Volume2, VolumeX, Check, X, ChevronRight, Award, Info, Dumbbell, Zap, ChevronLeft, Send, RotateCcw } from 'lucide-react'
import { getModuleQuestions } from '../../services/questionService'
import { saveModuleScore } from '../../utils/localScoring'
import ModuleRulesModal from '../../components/common/ModuleRulesModal'

// --- Trainer Sub-components ---
function AudioSprint({ questions, onBack }) {
    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const handleAnswer = (correct) => {
        if (correct) setScore(s => s + 1);
        if (index + 1 < questions.length) {
            setIndex(prev => prev + 1);
        } else {
            setShowResults(true);
            saveModuleScore('listening', Math.round(((score + (correct ? 1 : 0)) / questions.length) * 100), questions.length * 20);
        }
    }

    if (showResults) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>⚡</div>
                <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#111827', margin: '0 0 8px' }}>Sprint Finished!</h2>
                <p style={{ color: '#6B7280', marginBottom: '32px' }}>You processed {score} clips correctly.</p>
                <button onClick={onBack} style={{ padding: '12px 24px', borderRadius: '12px', background: '#22C55E', color: 'white', fontWeight: '700', border: 'none', cursor: 'pointer' }}>Back to Modes</button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px', background: 'none', border: 'none', color: '#22C55E', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                <ChevronLeft size={16} /> All Modes
            </button>

            <div style={{ marginBottom: '32px' }}>
                <Zap size={40} style={{ color: '#F59E0B', marginBottom: '16px' }} />
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: 0 }}>Rapid-Fire Prep</h2>
                <p style={{ color: '#6B7280' }}>Listen and pick the correct meaning immediately.</p>
            </div>

            <div style={{ padding: '40px', background: '#F0FDF4', borderRadius: '24px', marginBottom: '32px', border: '2px solid #DCFCE7' }}>
                <audio ref={audioRef} src={questions[index].audio_data} onEnded={() => setIsPlaying(false)} />
                <button 
                    onClick={() => { audioRef.current.play(); setIsPlaying(true); }}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'white', border: 'none', boxShadow: '0 10px 20px rgba(34, 197, 94, 0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}
                >
                    {isPlaying ? <Pause style={{ color: '#22C55E' }} /> : <Play style={{ color: '#22C55E', marginLeft: '4px' }} />}
                </button>
                <p style={{ marginTop: '20px', fontWeight: '600', color: '#166534' }}>CLIP {index + 1} OF {questions.length}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {questions[index].options.map((opt, i) => (
                    <button 
                        key={i}
                        onClick={() => handleAnswer(opt.value === questions[index].correct_answer)}
                        style={{ padding: '16px', borderRadius: '12px', border: 'none', background: 'white', border: '2px solid #E5E7EB', color: '#374151', fontWeight: '600', cursor: 'pointer' }}
                    >
                        {opt.text}
                    </button>
                ))}
            </div>
        </div>
    );
}

function ListeningDictation({ questions, onBack }) {
    const [index, setIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [showCorrection, setShowCorrection] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const handleSubmit = () => {
        setShowCorrection(true);
    }

    const handleNext = () => {
        if (index + 1 < questions.length) {
            setIndex(prev => prev + 1);
            setUserInput('');
            setShowCorrection(false);
        } else {
            onBack();
        }
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px', background: 'none', border: 'none', color: '#22C55E', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                <ChevronLeft size={16} /> All Modes
            </button>

            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                <Headphones size={40} style={{ color: '#22C55E', marginBottom: '16px' }} />
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: 0 }}>Dictation Drill</h2>
                <p style={{ color: '#6B7280' }}>Listen carefully and type what was said.</p>
            </div>

            <div style={{ padding: '24px', background: 'white', borderRadius: '20px', border: '2px solid #F3F4F6', marginBottom: '24px' }}>
                <audio ref={audioRef} src={questions[index].audio_data} onEnded={() => setIsPlaying(false)} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <button 
                        onClick={() => { audioRef.current.play(); setIsPlaying(true); }}
                        style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F0FDF4', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                         {isPlaying ? <Pause size={20} style={{ color: '#22C55E' }} /> : <Play size={20} style={{ color: '#22C55E' }} />}
                    </button>
                    <div>
                        <p style={{ margin: 0, fontWeight: '700', color: '#111827' }}>Click to Play</p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#6B7280' }}>Listen as many times as you need</p>
                    </div>
                </div>

                <textarea 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type what you hear..."
                    disabled={showCorrection}
                    style={{ width: '100%', minHeight: '120px', padding: '16px', borderRadius: '12px', border: '2px solid #E5E7EB', outline: 'none', fontSize: '16px', transition: 'border-color 0.2s', resize: 'none' }}
                />

                {showCorrection && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ marginTop: '20px', padding: '16px', background: '#F8FAFC', borderRadius: '12px', borderLeft: '4px solid #3B82F6' }}>
                        <p style={{ margin: 0, fontSize: '12px', color: '#6B7280', fontWeight: '600' }}>TRANSCRIPT REFERENCE</p>
                        <p style={{ margin: '8px 0 0 0', color: '#1E40AF', fontStyle: 'italic' }}>"{questions[index].content}"</p>
                    </motion.div>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {!showCorrection ? (
                    <button 
                        onClick={handleSubmit}
                        disabled={!userInput}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', background: userInput ? '#22C55E' : '#E5E7EB', color: 'white', fontWeight: '700', border: 'none', cursor: userInput ? 'pointer' : 'not-allowed' }}
                    >
                        <Send size={18} /> Reveal Answer
                    </button>
                ) : (
                    <button 
                        onClick={handleNext}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', background: '#22C55E', color: 'white', fontWeight: '700', border: 'none', cursor: 'pointer' }}
                    >
                        Next Clip <ChevronRight size={18} />
                    </button>
                )}
            </div>
        </div>
    );
}

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
    const [completedQuestions, setCompletedQuestions] = useState(() => {
        const saved = localStorage.getItem('neuraLingua_completed_listening');
        return saved ? JSON.parse(saved) : [];
    });
    const [showPopup, setShowPopup] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [activeTab, setActiveTab] = useState('practice'); // 'practice' | 'trainer'
    const [trainerMode, setTrainerMode] = useState(null); // null | 'sprint' | 'dictation'

    useEffect(() => {
        localStorage.setItem('neuraLingua_completed_listening', JSON.stringify(completedQuestions));
    }, [completedQuestions]);
    const audioRef = useRef(null)

    useEffect(() => {
        fetchQuestions()
    }, [])

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

    const listeningRules = [
        "Listen to the audio clip carefully by clicking the Play button.",
        "You can pause or replay the audio as many times as you need.",
        "Read the question and select the best answer based on what you heard.",
        "Your score will be logged at the end of the session.",
        "Make sure your device volume is turned up!"
    ];

    const handleSelectAnswer = (value) => {
        if (showResult) return
        setSelectedAnswer(value)
    }

    const handleSubmit = async () => {
        if (!selectedAnswer) return

        const correct = String(selectedAnswer).trim().toLowerCase() === String(currentQuestion.correct_answer).trim().toLowerCase()
        setIsCorrect(correct)
        setShowResult(true)
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
        if (correct && !completedQuestions.includes(currentIndex)) {
            setCompletedQuestions(prev => [...prev, currentIndex])
        }
    }

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1)
            setSelectedAnswer(null)
            setShowResult(false)
            setIsCorrect(false)
            setProgress(0)
            setCurrentTime(0)
            setIsPlaying(false)
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0
            }
        }
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')} `
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
                    borderTop: '4px solid #22C55E',
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
                    background: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)',
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
                    {/* Instructions Button */}
                    <button
                        onClick={() => setShowRules(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '10px 16px',
                            backgroundColor: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '10px',
                            color: '#4B5563',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        }}
                    >
                        <Info size={16} />
                        Instructions
                    </button>

                    {/* Tab Navigation */}
                    <div style={{
                        display: 'flex',
                        backgroundColor: 'white',
                        padding: '4px',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        border: '1px solid #E5E7EB',
                    }}>
                        <button
                            onClick={() => { setActiveTab('practice'); setTrainerMode(null); }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: activeTab === 'practice' ? '#22C55E' : 'transparent',
                                color: activeTab === 'practice' ? 'white' : '#6B7280',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Headphones size={16} /> Practice
                        </button>
                        <button
                            onClick={() => setActiveTab('trainer')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: activeTab === 'trainer' ? '#22C55E' : 'transparent',
                                color: activeTab === 'trainer' ? 'white' : '#6B7280',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Dumbbell size={16} /> Trainer
                        </button>
                    </div>

                    {/* Score */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 24px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                    <Award size={24} style={{ color: '#F59E0B' }} />
                    <div>
                        <p style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: 0 }}>
                            {score.correct}/{score.total}
                        </p>
                        <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Correct</p>
                    </div>
                </div>
            </div>

            {/* Progress Bar moved into sidebar or kept above? Let's keep it above for consistency or put it in content. */}
            
            <AnimatePresence mode="wait">
                {activeTab === 'practice' ? (
                    <motion.div
                        key="practice"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid-sidebar"
                    >
                        {/* Questions Sidebar */}
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
                                Questions
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {questions.map((q, idx) => (
                                    <motion.button
                                        key={q.id || idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        whileHover={{ x: 4 }}
                                        style={{
                                            padding: '12px 16px',
                                            borderRadius: '10px',
                                            border: 'none',
                                            backgroundColor: currentIndex === idx ? '#F0FDF4' : 'transparent',
                                            borderLeft: currentIndex === idx ? '3px solid #22C55E' : '3px solid transparent',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ flex: 1 }}>
                                                <p style={{
                                                    fontSize: '14px',
                                                    fontWeight: currentIndex === idx ? '600' : '500',
                                                    color: currentIndex === idx ? '#166534' : '#374151',
                                                    margin: 0,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    maxWidth: '180px'
                                                }}>
                                                    {q.title || `Question ${idx + 1}`}
                                                </p>
                                            </div>
                                            {completedQuestions.includes(idx) && (
                                                <Check size={14} style={{ color: '#22C55E' }} />
                                            )}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Progress Bar inside content area */}
                            <div style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                padding: '16px 20px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '10px',
                                }}>
                                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                                        Question {currentIndex + 1} of {questions.length}
                                        {completedQuestions.includes(currentIndex) && <Check size={16} style={{ color: '#22C55E', marginLeft: '8px' }} />}
                                    </span>
                                    <span style={{ fontSize: '14px', color: '#6B7280' }}>
                                        {Math.round(questionProgress)}%
                                    </span>
                                </div>
                                <div style={{
                                    height: '6px',
                                    backgroundColor: '#E5E7EB',
                                    borderRadius: '3px',
                                    overflow: 'hidden',
                                }}>
                                    <motion.div
                                        animate={{ width: `${questionProgress}%` }}
                                        style={{
                                            height: '100%',
                                            background: 'linear-gradient(90deg, #22C55E 0%, #4ADE80 100%)',
                                            borderRadius: '3px',
                                        }}
                                    />
                                </div>
                            </div>

                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                }}
                            >
                                {/* Audio Player */}
                                <div style={{
                                    background: 'linear-gradient(135deg, #166534 0%, #22C55E 100%)',
                                    padding: '32px',
                                }}>
                                    {/* Hidden real audio element */}
                                    {currentQuestion.audio_data && (
                                        <audio
                                            ref={audioRef}
                                            src={currentQuestion.audio_data}
                                            onTimeUpdate={handleAudioTimeUpdate}
                                            onLoadedMetadata={handleAudioLoaded}
                                            onEnded={handleAudioEnded}
                                            muted={isMuted}
                                        />
                                    )}

                                    {/* Track label */}
                                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: '13px', marginBottom: '16px', margin: '0 0 16px' }}>
                                        {currentQuestion.audio_data ? '🎵 ' + (currentQuestion.title || 'Listening Exercise') : '📝 Read the passage below carefully'}
                                    </p>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '24px',
                                        marginBottom: '24px',
                                    }}>
                                        <button
                                            onClick={() => setIsMuted(!isMuted)}
                                            disabled={!currentQuestion.audio_data}
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '50%',
                                                border: 'none',
                                                backgroundColor: 'rgba(255,255,255,0.2)',
                                                cursor: currentQuestion.audio_data ? 'pointer' : 'default',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                opacity: currentQuestion.audio_data ? 1 : 0.4,
                                            }}
                                        >
                                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                        </button>

                                        <motion.button
                                            onClick={handlePlayPause}
                                            disabled={!currentQuestion.audio_data}
                                            whileHover={currentQuestion.audio_data ? { scale: 1.05 } : {}}
                                            whileTap={currentQuestion.audio_data ? { scale: 0.95 } : {}}
                                            style={{
                                                width: '72px',
                                                height: '72px',
                                                borderRadius: '50%',
                                                border: 'none',
                                                backgroundColor: 'white',
                                                cursor: currentQuestion.audio_data ? 'pointer' : 'default',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                                                opacity: currentQuestion.audio_data ? 1 : 0.5,
                                            }}
                                        >
                                            {isPlaying ? (
                                                <Pause size={32} style={{ color: '#166534' }} />
                                            ) : (
                                                <Play size={32} style={{ color: '#166534', marginLeft: '4px' }} />
                                            )}
                                        </motion.button>

                                        <div style={{ width: '48px' }} />
                                    </div>

                                    {/* Progress Slider */}
                                    <div style={{ marginBottom: '12px' }}>
                                        <div style={{
                                            height: '6px',
                                            backgroundColor: 'rgba(255,255,255,0.3)',
                                            borderRadius: '3px',
                                            overflow: 'hidden',
                                        }}>
                                            <motion.div
                                                animate={{ width: `${progress}%` }}
                                                style={{
                                                    height: '100%',
                                                    backgroundColor: 'white',
                                                    borderRadius: '3px',
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        color: 'rgba(255,255,255,0.9)',
                                        fontSize: '13px',
                                    }}>
                                        <span>{formatTime(currentTime)}</span>
                                        <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '32px' }}>
                                    {/* Prompt Card */}
                                    {currentQuestion && (
                                        <motion.div
                                            key={`prompt-${currentQuestion.id}`}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
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
                                                    backgroundColor: '#F0FDF4',
                                                    borderRadius: '20px',
                                                }}>
                                                    <Headphones size={14} style={{ color: '#22C55E' }} />
                                                    <span style={{ fontSize: '13px', color: '#166534', fontWeight: '500' }}>
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

                                    {/* Answer Options */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
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

                                    {/* Actions */}
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
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
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="trainer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '32px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            minHeight: '400px'
                        }}
                    >
                        {!trainerMode ? (
                            <div>
                                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: '0 0 8px' }}>Listening Trainer</h2>
                                <p style={{ color: '#6B7280', marginBottom: '32px' }}>Sharpen your ears with specialized drills.</p>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                                    <motion.button
                                        whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(34, 197, 94, 0.15)' }}
                                        onClick={() => setTrainerMode('sprint')}
                                        style={{
                                            padding: '32px', textAlign: 'left', borderRadius: '20px', border: '2px solid #F3F4F6',
                                            backgroundColor: 'white', cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                                            <Zap size={24} style={{ color: '#22C55E' }} />
                                        </div>
                                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>Audio Sprint</h3>
                                        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0, lineHeight: '1.5' }}>Rapid-fire listening challenges to improve quick comprehension.</p>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(34, 197, 94, 0.15)' }}
                                        onClick={() => setTrainerMode('dictation')}
                                        style={{
                                            padding: '32px', textAlign: 'left', borderRadius: '20px', border: '2px solid #F3F4F6',
                                            backgroundColor: 'white', cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                                            <Award size={24} style={{ color: '#22C55E' }} />
                                        </div>
                                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>Dictation Mode</h3>
                                        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0, lineHeight: '1.5' }}>Listen and type exactly what you hear to perfect your details.</p>
                                    </motion.button>
                                </div>
                            </div>
                        ) : trainerMode === 'sprint' ? (
                            <AudioSprint questions={questions} onBack={() => setTrainerMode(null)} />
                        ) : (
                            <ListeningDictation questions={questions} onBack={() => setTrainerMode(null)} />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

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
                                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
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
                                You've finished the Listening practice session.
                            </p>

                            <div style={{
                                marginBottom: '32px',
                                padding: '20px',
                                backgroundColor: '#F8FAFC',
                                borderRadius: '16px',
                            }}>
                                <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '4px' }}>Final Accuracy</p>
                                <p style={{ fontSize: '36px', fontWeight: '800', color: '#2563EB', margin: 0 }}>
                                    {score.total > 0 ? Math.round((score.correct / score.total) * 100) : (isCorrect ? 100 : 0)}%
                                </p>
                            </div>

                            <div style={{ display: 'grid', gap: '12px' }}>
                                <button
                                    onClick={() => {
                                        setShowPopup(false);
                                        setCurrentIndex(0);
                                        setScore({ correct: 0, total: 0 });
                                        setShowResult(false);
                                        setCompletedQuestions([]);
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
                                        background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                                        color: 'white',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Next Topic
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

            <ModuleRulesModal 
                isOpen={showRules}
                onClose={() => setShowRules(false)}
                title="Listening Rules"
                description="Follow these guidelines to improve your listening skills:"
                rules={listeningRules}
            />
        </div>
    )
}
