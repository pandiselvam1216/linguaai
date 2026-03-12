import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, CheckCircle, Info, CheckSquare, Check, X, ChevronRight, Award, Dumbbell, Zap, RotateCcw, ChevronLeft, BookOpen } from 'lucide-react'
import { getModuleQuestions } from '../../services/questionService'
import { saveModuleScore } from '../../utils/localScoring'
import ModuleRulesModal from '../../components/common/ModuleRulesModal'

// --- Trainer Sub-components ---
function GrammarFlashcards({ rules, onBack }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);

    const handleNext = () => {
        setFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % rules.length);
        }, 150);
    }

    const handlePrev = () => {
        setFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + rules.length) % rules.length);
        }, 150);
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px', background: 'none', border: 'none', color: '#EF4444', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                <ChevronLeft size={16} /> All Modes
            </button>
            
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: '600' }}>RULE {currentIndex + 1} OF {rules.length}</span>
                <div style={{ height: '4px', width: '100px', background: '#F3F4F6', margin: '12px auto', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${((currentIndex + 1) / rules.length) * 100}%`, background: '#EF4444', transition: 'width 0.3s ease' }} />
                </div>
            </div>

            <div 
                onClick={() => setFlipped(!flipped)}
                style={{ perspective: '1000px', cursor: 'pointer', height: '300px', marginBottom: '32px' }}
            >
                <motion.div
                    animate={{ rotateY: flipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
                    style={{ position: 'relative', transformStyle: 'preserve-3d', width: '100%', height: '100%' }}
                >
                    {/* Front */}
                    <div style={{
                        position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                        background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
                        borderRadius: '24px', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', padding: '40px',
                        boxShadow: '0 20px 40px rgba(239, 68, 68, 0.2)', color: 'white'
                    }}>
                        <BookOpen size={48} style={{ marginBottom: '20px', opacity: 0.8 }} />
                        <h3 style={{ fontSize: '24px', fontWeight: '800', margin: 0, textAlign: 'center' }}>Grammar Tip</h3>
                        <p style={{ marginTop: '12px', opacity: 0.7, fontSize: '14px' }}>Tap to reveal details</p>
                    </div>

                    {/* Back */}
                    <div style={{
                        position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)', background: 'white', borderRadius: '24px',
                        border: '2px solid #FEE2E2', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', padding: '40px', textAlign: 'center',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
                    }}>
                        <p style={{ fontSize: '18px', color: '#1F2937', fontWeight: '600', lineHeight: '1.6', margin: 0 }}>
                            {rules[currentIndex]}
                        </p>
                    </div>
                </motion.div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <button onClick={handlePrev} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', color: '#4B5563', cursor: 'pointer' }}>
                    <ChevronLeft size={20} />
                </button>
                <button onClick={handleNext} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', color: '#4B5563', cursor: 'pointer' }}>
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}

function RuleChallenge({ rules, onBack }) {
    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedOpt, setSelectedOpt] = useState(null);

    // Repurpose rules into "Is this a valid rule?" or similar if data is limited
    // For now, let's create a simple quiz based on the rules we have
    const mockQuestions = rules.map(r => ({
        rule: r,
        isCorrect: Math.random() > 0.3, // Mostly correct
        tampered: r.replace('carefully', 'quickly').replace('best', 'worst').replace('special', 'no')
    }));

    const handleAnswer = (choice) => {
        setSelectedOpt(choice);
        const correct = choice === mockQuestions[index].isCorrect;
        if (correct) setScore(s => s + 1);
        
        setTimeout(() => {
            if (index + 1 < mockQuestions.length) {
                setIndex(prev => prev + 1);
                setSelectedOpt(null);
            } else {
                setShowResult(true);
                saveModuleScore('grammar', Math.round(((score + (correct ? 1 : 0)) / rules.length) * 100), rules.length * 10);
            }
        }, 600);
    }

    if (showResult) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎯</div>
                <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#111827', margin: '0 0 8px' }}>Challenge Complete!</h2>
                <p style={{ color: '#6B7280', marginBottom: '32px' }}>You scored {score} out of {rules.length}</p>
                <button onClick={onBack} style={{ padding: '12px 24px', borderRadius: '12px', background: '#EF4444', color: 'white', fontWeight: '700', border: 'none', cursor: 'pointer' }}>Back to Modes</button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
             <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px', background: 'none', border: 'none', color: '#EF4444', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                <ChevronLeft size={16} /> All Modes
            </button>

            <div style={{ marginBottom: '32px' }}>
                <p style={{ fontSize: '14px', color: '#6B7280', fontWeight: '600', textTransform: 'uppercase' }}>Rule Verification</p>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginTop: '12px' }}>
                    Is this statement a valid grammar practice guideline?
                </h3>
            </div>

            <div style={{ padding: '32px', backgroundColor: '#F9FAFB', borderRadius: '20px', border: '2px solid #F3F4F6', marginBottom: '32px' }}>
                <p style={{ fontSize: '18px', color: '#374151', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>
                    "{mockQuestions[index].isCorrect ? mockQuestions[index].rule : mockQuestions[index].tampered}"
                </p>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
                <button 
                    onClick={() => handleAnswer(true)}
                    disabled={selectedOpt !== null}
                    style={{ flex: 1, padding: '16px', borderRadius: '12px', border: 'none', background: selectedOpt === true ? (mockQuestions[index].isCorrect ? '#22C55E' : '#EF4444') : '#F3F4F6', color: selectedOpt === true ? 'white' : '#4B5563', fontWeight: '700', cursor: 'pointer' }}
                >
                    True
                </button>
                <button 
                    onClick={() => handleAnswer(false)}
                    disabled={selectedOpt !== null}
                    style={{ flex: 1, padding: '16px', borderRadius: '12px', border: 'none', background: selectedOpt === false ? (!mockQuestions[index].isCorrect ? '#22C55E' : '#EF4444') : '#F3F4F6', color: selectedOpt === false ? 'white' : '#4B5563', fontWeight: '700', cursor: 'pointer' }}
                >
                    False
                </button>
            </div>
        </div>
    );
}

export default function Grammar() {
    const [questions, setQuestions] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [showResult, setShowResult] = useState(false)
    const [isCorrect, setIsCorrect] = useState(false)
    const [score, setScore] = useState({ correct: 0, total: 0 })
    const [loading, setLoading] = useState(true)
    const [showExplanation, setShowExplanation] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [activeTab, setActiveTab] = useState('practice'); // 'practice' | 'trainer'
    const [trainerMode, setTrainerMode] = useState(null); // null | 'flashcards' | 'quiz'
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

        const correct = String(selectedAnswer).trim().toLowerCase() === String(currentQuestion.correct_answer).trim().toLowerCase()
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
        if (correct && !completedQuestions.includes(currentIndex)) {
            setCompletedQuestions(prev => [...prev, currentIndex])
        }
    }

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1)
            setSelectedAnswer(null)
            setShowResult(false)
            setShowExplanation(false)
            setIsCorrect(false)
        }
    }

    const handleRestart = () => {
        setCurrentIndex(0)
        setSelectedAnswer(null)
        setShowResult(false)
        setShowExplanation(false)
        setIsCorrect(false)
        setScore({ correct: 0, total: 0 })
        setCompletedQuestions([])
    }

    const handleSelectExercise = (index) => {
        if (showResult && !isCorrect && currentIndex === index) return // Stay on wrong answer to see explanation
        setCurrentIndex(index)
        setSelectedAnswer(null)
        setShowResult(false)
        setShowExplanation(false)
        setIsCorrect(false)
    }

    const grammarRules = [
        "Read each sentence carefully and identify the grammatical error or the best completion.",
        "Select the single best answer from the options provided.",
        "You can retry an exercise at any time during the session, but your first attempt defines your score.",
        "Your score will be saved automatically once you complete all exercises in the session.",
        "Pay special attention to verb tense, subject-verb agreement, and proper preposition usage."
    ];

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
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                    <CheckSquare size={48} style={{ color: '#D1D5DB', marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>No questions available</h3>
                    <p style={{ color: '#6B7280', marginTop: '8px', margin: '8px 0 0 0' }}>Check back later for new grammar exercises.</p>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        <CheckSquare size={24} style={{ color: 'white' }} />
                    </div>
                    <div>
                        <h1 style={{ fontWeight: '700', color: '#111827', margin: 0 }}>
                            Grammar Practice
                        </h1>
                        <p style={{ color: '#6B7280', margin: 0 }}>
                            Master English grammar rules with interactive exercises
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    {/* Instructions Button */}
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
                                backgroundColor: activeTab === 'practice' ? '#EF4444' : 'transparent',
                                color: activeTab === 'practice' ? 'white' : '#6B7280',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <CheckSquare size={16} /> Practice
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
                                backgroundColor: activeTab === 'trainer' ? '#EF4444' : 'transparent',
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

                    {/* Score Badge */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                    <Star size={16} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                        {score.correct}/{score.total}
                    </span>
                    <span style={{ fontSize: '13px', color: '#9CA3AF' }}>•</span>
                    <span style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: scorePercent >= 70 ? '#16A34A' : '#EF4444',
                    }}>
                        {scorePercent}%
                    </span>
                </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'practice' ? (
                    <motion.div
                        key="practice"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid-sidebar"
                    >
                        {/* Exercises Sidebar */}
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
                                        key={q.id || idx}
                                        onClick={() => handleSelectExercise(idx)}
                                        whileHover={{ x: 4 }}
                                        style={{
                                            padding: '12px 16px',
                                            borderRadius: '10px',
                                            border: 'none',
                                            backgroundColor: currentIndex === idx ? '#FEF2F2' : 'transparent',
                                            borderLeft: currentIndex === idx ? '3px solid #EF4444' : '3px solid transparent',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ flex: 1 }}>
                                                <p style={{
                                                    fontSize: '14px',
                                                    fontWeight: currentIndex === idx ? '600' : '500',
                                                    color: currentIndex === idx ? '#991B1B' : '#374151',
                                                    margin: 0,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    maxWidth: '180px'
                                                }}>
                                                    {q.content?.substring(0, 30)}...
                                                </p>
                                                <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>
                                                    Exercise {idx + 1}
                                                </p>
                                            </div>
                                            {completedQuestions.includes(idx) && (
                                                <CheckCircle size={14} style={{ color: '#22C55E' }} />
                                            )}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Main Content */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                            {/* Question Card */}
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '16px',
                                    padding: '32px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                                    <Star size={16} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                                    <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: '500' }}>
                                        Difficulty: {currentQuestion.difficulty === 1 ? 'Easy' : currentQuestion.difficulty === 2 ? 'Medium' : 'Hard'}
                                    </span>
                                </div>

                                <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '32px', lineHeight: '1.6' }}>
                                    {currentQuestion.content}
                                </h2>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                                    {currentQuestion.options?.map((option, idx) => {
                                        const isSelected = selectedAnswer === option.value
                                        const isCorrectOption = option.value === currentQuestion.correct_answer
                                        const showCorrect = showResult && isCorrectOption
                                        const showWrong = showResult && isSelected && !isCorrectOption

                                        return (
                                            <motion.button
                                                key={idx}
                                                onClick={() => handleSelectAnswer(option.value)}
                                                whileHover={!showResult ? { x: 4 } : {}}
                                                style={{
                                                    width: '100%',
                                                    padding: '16px 20px',
                                                    borderRadius: '12px',
                                                    border: '2px solid',
                                                    borderColor: showCorrect ? '#22C55E' : showWrong ? '#EF4444' : isSelected ? '#EF4444' : '#F3F4F6',
                                                    backgroundColor: showCorrect ? '#F0FDF4' : showWrong ? '#FEF2F2' : isSelected ? '#FEF2F2' : 'white',
                                                    cursor: showResult ? 'default' : 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '16px',
                                                    textAlign: 'left',
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                <div style={{
                                                    width: '32px', height: '32px', borderRadius: '8px',
                                                    backgroundColor: showCorrect ? '#22C55E' : showWrong ? '#EF4444' : isSelected ? '#EF4444' : '#F3F4F6',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: (showCorrect || showWrong || isSelected) ? 'white' : '#6B7280',
                                                    fontWeight: '700', fontSize: '14px'
                                                }}>
                                                    {String.fromCharCode(65 + idx)}
                                                </div>
                                                <span style={{ fontSize: '16px', color: '#374151', fontWeight: isSelected ? '600' : '400' }}>
                                                    {option.text}
                                                </span>
                                                {showCorrect && <Check size={20} style={{ color: '#22C55E', marginLeft: 'auto' }} />}
                                                {showWrong && <X size={20} style={{ color: '#EF4444', marginLeft: 'auto' }} />}
                                            </motion.button>
                                        )
                                    })}
                                </div>

                                {showExplanation && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        style={{
                                            padding: '20px',
                                            backgroundColor: '#F0F9FF',
                                            borderRadius: '12px',
                                            borderLeft: '4px solid #3B82F6',
                                            marginBottom: '32px',
                                        }}
                                    >
                                        <p style={{ fontSize: '14px', fontWeight: '700', color: '#1E40AF', marginBottom: '8px' }}>Explanation</p>
                                        <p style={{ fontSize: '14px', color: '#1E3A8A', margin: 0, lineHeight: '1.6' }}>{currentQuestion.explanation}</p>
                                    </motion.div>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                    {!showResult ? (
                                        <button
                                            onClick={handleCheckAnswer}
                                            disabled={!selectedAnswer}
                                            style={{
                                                padding: '14px 32px',
                                                borderRadius: '10px',
                                                border: 'none',
                                                background: selectedAnswer ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' : '#E5E7EB',
                                                color: 'white',
                                                fontSize: '15px',
                                                fontWeight: '600',
                                                cursor: selectedAnswer ? 'pointer' : 'not-allowed',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
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
                                                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                                                color: 'white',
                                                fontSize: '15px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
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
                                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: '0 0 8px' }}>Grammar Trainer</h2>
                                <p style={{ color: '#6B7280', marginBottom: '32px' }}>Choose a specialized mode to master grammar rules.</p>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                                    <motion.button
                                        whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(239, 68, 68, 0.15)' }}
                                        onClick={() => setTrainerMode('flashcards')}
                                        style={{
                                            padding: '32px', textAlign: 'left', borderRadius: '20px', border: '2px solid #F3F4F6',
                                            backgroundColor: 'white', cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                                            <Zap size={24} style={{ color: '#EF4444' }} />
                                        </div>
                                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>Rule Flashcards</h3>
                                        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0, lineHeight: '1.5' }}>Review core grammar rules with interactive double-sided cards.</p>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(239, 68, 68, 0.15)' }}
                                        onClick={() => setTrainerMode('quiz')}
                                        style={{
                                            padding: '32px', textAlign: 'left', borderRadius: '20px', border: '2px solid #F3F4F6',
                                            backgroundColor: 'white', cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                                            <Award size={24} style={{ color: '#EF4444' }} />
                                        </div>
                                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>Rule Challenge</h3>
                                        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0, lineHeight: '1.5' }}>Test your knowledge of the rules you've reviewed in a rapid-fire quiz.</p>
                                    </motion.button>
                                </div>
                            </div>
                        ) : trainerMode === 'flashcards' ? (
                            <GrammarFlashcards rules={grammarRules} onBack={() => setTrainerMode(null)} />
                        ) : (
                            <RuleChallenge rules={grammarRules} onBack={() => setTrainerMode(null)} />
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
                                background: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px',
                                color: 'white',
                            }}>
                                <Award size={40} />
                            </div>

                            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0' }}>
                                Module Complete!
                            </h2>
                            <p style={{ color: '#6B7280', margin: '0 0 32px 0' }}>
                                You've finished the Grammar practice session.
                            </p>

                            <div style={{
                                marginBottom: '32px',
                                padding: '20px',
                                backgroundColor: '#F8FAFC',
                                borderRadius: '16px',
                            }}>
                                <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 4px 0' }}>Final accuracy</p>
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
                title="Grammar Rules"
                description="Follow these guidelines to master your grammar exercises:"
                rules={grammarRules}
            />
        </div>
    )
}
