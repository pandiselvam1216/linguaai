import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PenTool, Send, Clock, CheckCircle, ChevronRight, XCircle, Award, RotateCcw, AlertCircle, Info, FileText, Sparkles, Dumbbell, Zap, ChevronLeft } from 'lucide-react'
import api from '../../services/api'
import { getModuleQuestions } from '../../services/questionService'
import { evaluateWriting, saveModuleScore } from '../../utils/localScoring'
import { getAIWritingFeedback } from '../../services/aiService'
import ModuleRulesModal from '../../components/common/ModuleRulesModal'

// --- Trainer Sub-components ---
function SpeedWritingTrainer({ onBack }) {
    const [essay, setEssay] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isActive, setIsActive] = useState(false);
    const [currentPrompt, setCurrentPrompt] = useState("Explain why learning a second language is beneficial in the modern world.");

    useEffect(() => {
        let timer;
        if (isActive && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0) {
            evaluate();
        }
        return () => clearInterval(timer);
    }, [isActive, timeLeft]);

    const startSession = () => {
        setIsActive(true);
        setEssay('');
        setFeedback(null);
        setTimeLeft(60);
    };

    const evaluate = () => {
        setIsActive(false);
        const words = essay.trim() ? essay.trim().split(/\s+/).length : 0;
        const wpm = words; // Since it's 1 minute
        const score = Math.min(Math.floor((wpm / 40) * 100), 100);
        
        setFeedback({
            wpm,
            score,
            tips: wpm > 30 ? "Great speed! Keep practicing to maintain flow." : "Focus on connecting your thoughts faster."
        });
        saveModuleScore('writing', score, 60);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px', background: 'none', border: 'none', color: '#22C55E', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                <ChevronLeft size={16} /> All Modes
            </button>

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <Zap size={40} style={{ color: '#F59E0B', marginBottom: '16px' }} />
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', margin: 0 }}>Speed Writing</h2>
                <p style={{ color: '#6B7280' }}>Write as much as you can in 60 seconds.</p>
            </div>

            <div style={{ padding: '24px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>PROMPT</h3>
                <p style={{ fontSize: '18px', fontWeight: '600', color: '#1E293B' }}>{currentPrompt}</p>
            </div>

            {!isActive && !feedback ? (
                <div style={{ textAlign: 'center' }}>
                    <button onClick={startSession} style={{ padding: '16px 32px', borderRadius: '12px', background: '#22C55E', color: 'white', fontWeight: '700', fontSize: '16px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)' }}>
                        Start 60s Sprint
                    </button>
                </div>
            ) : (
                <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-60px', right: '0', display: 'flex', alignItems: 'center', gap: '8px', color: timeLeft < 10 ? '#EF4444' : '#111827', fontWeight: '800', fontSize: '24px' }}>
                        <Clock size={24} /> 00:{timeLeft.toString().padStart(2, '0')}
                    </div>
                    
                    <textarea
                        value={essay}
                        onChange={(e) => setEssay(e.target.value)}
                        disabled={!isActive}
                        placeholder="Type here..."
                        style={{ width: '100%', minHeight: '300px', padding: '24px', borderRadius: '16px', border: '2px solid #E2E8F0', fontSize: '16px', lineHeight: '1.6', outline: 'none' }}
                    />

                    {feedback && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '24px', padding: '32px', background: 'white', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                                <div style={{ textAlign: 'center', padding: '20px', background: '#F0FDF4', borderRadius: '16px' }}>
                                    <p style={{ fontSize: '14px', color: '#166534', fontWeight: '600', marginBottom: '4px' }}>Words Per Minute</p>
                                    <p style={{ fontSize: '32px', fontWeight: '800', color: '#166534', margin: 0 }}>{feedback.wpm}</p>
                                </div>
                                <div style={{ textAlign: 'center', padding: '20px', background: '#EFF6FF', borderRadius: '16px' }}>
                                    <p style={{ fontSize: '14px', color: '#1E40AF', fontWeight: '600', marginBottom: '4px' }}>Trainer Score</p>
                                    <p style={{ fontSize: '32px', fontWeight: '800', color: '#1E40AF', margin: 0 }}>{feedback.score}%</p>
                                </div>
                            </div>
                            <p style={{ textAlign: 'center', color: '#64748B', fontWeight: '500' }}>{feedback.tips}</p>
                            <button onClick={startSession} style={{ marginTop: '24px', width: '100%', padding: '14px', borderRadius: '12px', background: '#F3F4F6', color: '#4B5563', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
                                Try Another Sprint
                            </button>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
}

const writingRules = [
    "**Choose a Prompt:** Select a writing prompt from the list to begin.",
    "**Write Your Essay:** Type your essay in the provided text area. Aim to meet the word count requirement.",
    "**Submit for Feedback:** Once you're done, click 'Submit' to receive instant feedback on your grammar, spelling, and style.",
    "**Review AI Feedback:** An AI will also provide additional insights and suggestions to improve your writing.",
    "**Practice Regularly:** The more you write and review feedback, the better your writing skills will become!"
];

export default function Writing() {
    const [prompts, setPrompts] = useState([])
    const [selectedPrompt, setSelectedPrompt] = useState(null)
    const [essay, setEssay] = useState('')
    const [feedback, setFeedback] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [timeElapsed, setTimeElapsed] = useState(0)
    const [showPopup, setShowPopup] = useState(false);
    const [showRules, setShowRules] = useState(false);
    const [activeTab, setActiveTab] = useState('practice'); // 'practice' | 'trainer'
    const [trainerMode, setTrainerMode] = useState(null); // null | 'speed'
    const [completedTopics, setCompletedTopics] = useState([]);

    // No localStorage - all data stored in backend

    useEffect(() => {
        fetchPrompts()
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            if (!feedback) {
                setTimeElapsed(prev => prev + 1)
            }
        }, 1000)
        return () => clearInterval(timer)
    }, [feedback])

    const fetchPrompts = async () => {
        try {
            const questions = await getModuleQuestions('writing')
            const mapped = questions.map(q => ({
                id: q.id,
                title: q.title || q.content?.substring(0, 60) || 'Writing Prompt',
                content: q.content,
                word_limit: q.word_limit || 150,
            }))
            setPrompts(mapped)
            if (mapped.length > 0) setSelectedPrompt(mapped[0])
        } catch (error) {
            console.error('Failed to fetch prompts:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSelectPrompt = (prompt) => {
        setSelectedPrompt(prompt)
        setEssay('')
        setFeedback(null)
        setTimeElapsed(0)
    }

    const handleSubmit = async () => {
        if (!essay.trim() || submitting) return

        setSubmitting(true)
        try {
            // Local grammar evaluation
            const result = await evaluateWriting(essay, timeElapsed)
            // Enhance with AI feedback
            const aiFeedback = await getAIWritingFeedback(
                essay,
                selectedPrompt?.title || 'General Writing',
                result.suggestions?.length || 0
            )
            if (aiFeedback) {
                result.aiFeedback = aiFeedback
            }
            setFeedback(result)
            if (!completedTopics.includes(selectedPrompt?.id)) {
                setCompletedTopics(prev => [...prev, selectedPrompt.id])
            }
        } catch (error) {
            console.error('Failed to submit:', error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleReset = () => {
        setEssay('')
        setFeedback(null)
        setTimeElapsed(0)
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0
    const minWords = 150
    const progress = Math.min((wordCount / minWords) * 100, 100)

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

    if (!prompts.length) {
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
                    <PenTool size={48} style={{ color: '#D1D5DB', marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', margin: 0 }}>No writing prompts available</h3>
                    <p style={{ color: '#6B7280', marginTop: '8px', margin: '8px 0 0 0' }}>Check back later for new essay topics.</p>
                </div>
            </div>
        )
    }

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
                    <PenTool size={24} style={{ color: 'white' }} />
                </div>
                <div>
                    <h1 style={{ fontWeight: '700', color: '#111827', margin: 0 }}>
                        Writing Practice
                    </h1>
                    <p style={{ color: '#6B7280', margin: 0 }}>
                        Develop your essay writing skills with AI feedback
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
                        <PenTool size={16} /> Practice
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

                {/* Timer */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}>
                    <Clock size={16} style={{ color: '#6B7280' }} />
                    <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#111827',
                        fontFamily: 'monospace',
                    }}>
                        {formatTime(timeElapsed)}
                    </span>
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
                                Topics
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {prompts.map((prompt) => (
                                    <motion.button
                                        key={prompt.id}
                                        onClick={() => handleSelectPrompt(prompt)}
                                        whileHover={{ x: 4 }}
                                        style={{
                                            padding: '14px 16px',
                                            borderRadius: '10px',
                                            border: 'none',
                                            backgroundColor: selectedPrompt?.id === prompt.id ? '#F0FDF4' : 'transparent',
                                            borderLeft: selectedPrompt?.id === prompt.id ? '3px solid #22C55E' : '3px solid transparent',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                        }}
                                    >
                                        <p style={{
                                            fontSize: '14px',
                                            fontWeight: selectedPrompt?.id === prompt.id ? '600' : '500',
                                            color: selectedPrompt?.id === prompt.id ? '#166534' : '#374151',
                                            margin: 0,
                                            marginBottom: '4px',
                                        }}>
                                            {prompt.title}
                                        </p>
                                        <p style={{
                                            fontSize: '12px',
                                            color: '#9CA3AF',
                                            margin: 0,
                                        }}>
                                            {prompt.word_limit || minWords}+ words
                                        </p>
                                        {completedTopics.includes(prompt.id) && (
                                            <CheckCircle size={16} style={{ color: '#22C55E', position: 'absolute', right: '12px', top: '12px' }} />
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Main Content */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '32px' }}>
                            {/* Prompt Card */}
                            {selectedPrompt && (
                                <motion.div
                                    key={selectedPrompt.id}
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
                                            {selectedPrompt.title}
                                        </h2>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '6px 12px',
                                            backgroundColor: '#F0FDF4',
                                            borderRadius: '20px',
                                        }}>
                                            <FileText size={14} style={{ color: '#22C55E' }} />
                                            <span style={{ fontSize: '13px', color: '#166534', fontWeight: '500' }}>
                                                {selectedPrompt.word_limit || minWords} words limit
                                            </span>
                                        </div>
                                    </div>
                                    <p style={{
                                        fontSize: '15px',
                                        color: '#4B5563',
                                        lineHeight: '1.6',
                                        margin: 0,
                                    }}>
                                        {selectedPrompt.content}
                                    </p>
                                </motion.div>
                            )}

                            {/* Writing Area */}
                            <div style={{
                                borderRadius: '16px',
                                overflow: 'hidden',
                            }}>
                                {/* Word Count Bar */}
                                <div style={{
                                    padding: '16px 0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: '16px'
                                }}>
                                    <div style={{ flex: 1, marginRight: '20px' }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '6px',
                                        }}>
                                            <span style={{ fontSize: '13px', color: '#6B7280' }}>
                                                {wordCount} words
                                            </span>
                                            <span style={{
                                                fontSize: '13px',
                                                color: wordCount >= minWords ? '#22C55E' : '#6B7280'
                                            }}>
                                                Min: {minWords} words
                                            </span>
                                        </div>
                                        <div style={{
                                            height: '6px',
                                            backgroundColor: '#E5E7EB',
                                            borderRadius: '3px',
                                            overflow: 'hidden',
                                        }}>
                                            <motion.div
                                                animate={{ width: `${progress}%` }}
                                                style={{
                                                    height: '100%',
                                                    background: wordCount >= minWords
                                                        ? 'linear-gradient(90deg, #22C55E 0%, #4ADE80 100%)'
                                                        : 'linear-gradient(90deg, #F97316 0%, #FB923C 100%)',
                                                    borderRadius: '3px',
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '6px 12px',
                                        backgroundColor: wordCount >= minWords ? '#F0FDF4' : '#FFF7ED',
                                        borderRadius: '20px',
                                    }}>
                                        {wordCount >= minWords ? (
                                            <CheckCircle size={14} style={{ color: '#22C55E' }} />
                                        ) : (
                                            <AlertCircle size={14} style={{ color: '#F97316' }} />
                                        )}
                                        <span style={{
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            color: wordCount >= minWords ? '#166534' : '#C2410C',
                                        }}>
                                            {wordCount >= minWords ? 'Ready to submit' : `${minWords - wordCount} more needed`}
                                        </span>
                                    </div>
                                </div>

                                {/* Textarea */}
                                <div style={{ padding: '0 0 24px 0' }}>
                                    <textarea
                                        value={essay}
                                        onChange={(e) => setEssay(e.target.value)}
                                        disabled={!!feedback}
                                        placeholder="Start writing your essay here..."
                                        style={{
                                            width: '100%',
                                            minHeight: '300px',
                                            padding: '20px',
                                            borderRadius: '12px',
                                            border: '2px solid #E5E7EB',
                                            backgroundColor: feedback ? '#F9FAFB' : 'white',
                                            fontSize: '15px',
                                            lineHeight: '1.8',
                                            outline: 'none',
                                            resize: 'vertical',
                                            fontFamily: 'inherit',
                                            transition: 'all 0.2s',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                        }}
                                        onFocus={(e) => {
                                            if (!feedback) e.target.style.borderColor = '#22C55E'
                                        }}
                                        onBlur={(e) => {
                                            if (!feedback) e.target.style.borderColor = '#E5E7EB'
                                        }}
                                    />
                                </div>

                                {/* Actions */}
                                <div style={{
                                    padding: '0',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '12px',
                                    flexWrap: 'wrap'
                                }}>
                                    <button
                                        onClick={handleReset}
                                        disabled={!essay && !feedback}
                                        style={{
                                            padding: '12px 20px',
                                            borderRadius: '10px',
                                            border: '1px solid #E5E7EB',
                                            backgroundColor: 'white',
                                            color: '#374151',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            cursor: (!essay && !feedback) ? 'not-allowed' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            opacity: (!essay && !feedback) ? 0.5 : 1,
                                        }}
                                    >
                                        <RotateCcw size={16} />
                                        Reset
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={wordCount < minWords || submitting || !!feedback}
                                        style={{
                                            padding: '12px 24px',
                                            borderRadius: '10px',
                                            border: 'none',
                                            background: (wordCount >= minWords && !feedback)
                                                ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
                                                : '#E5E7EB',
                                            color: (wordCount >= minWords && !feedback) ? 'white' : '#9CA3AF',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            cursor: (wordCount >= minWords && !submitting && !feedback) ? 'pointer' : 'not-allowed',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            boxShadow: (wordCount >= minWords && !feedback) ? '0 4px 14px rgba(34, 197, 94, 0.4)' : 'none',
                                        }}
                                    >
                                        {submitting ? (
                                            <>Analyzing...</>
                                        ) : (
                                            <>
                                                <Sparkles size={16} />
                                                Analyze Writing
                                            </>
                                        )}
                                    </button>

                                    {feedback && (
                                        <button
                                            onClick={() => setShowPopup(true)}
                                            style={{
                                                padding: '12px 24px',
                                                borderRadius: '10px',
                                                border: 'none',
                                                background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                                                color: 'white',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)',
                                            }}
                                        >
                                            <Award size={16} />
                                            Final Submit
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Feedback */}
                            <AnimatePresence>
                                {feedback && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
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
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: '24px',
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                            }}>
                                                <Sparkles size={20} style={{ color: '#22C55E' }} />
                                                <h3 style={{
                                                    fontSize: '18px',
                                                    fontWeight: '600',
                                                    color: '#111827',
                                                    margin: 0,
                                                }}>
                                                    AI Feedback
                                                </h3>
                                            </div>
                                            <div style={{
                                                padding: '10px 20px',
                                                backgroundColor: feedback.score >= 70 ? '#F0FDF4' : '#FEF3C7',
                                                borderRadius: '20px',
                                            }}>
                                                <span style={{
                                                    fontSize: '18px',
                                                    fontWeight: '700',
                                                    color: feedback.score >= 70 ? '#166534' : '#D97706',
                                                }}>
                                                    {feedback.score}/100
                                                </span>
                                            </div>
                                        </div>

                                        {/* Feedback Categories */}
                                        <div className="grid-2col" style={{ marginBottom: '24px' }}>
                                            {Object.entries(feedback.feedback || {}).map(([key, value]) => (
                                                <div
                                                    key={key}
                                                    style={{
                                                        padding: '16px',
                                                        backgroundColor: '#F9FAFB',
                                                        borderRadius: '12px',
                                                    }}
                                                >
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        marginBottom: '8px',
                                                    }}>
                                                        <CheckCircle size={16} style={{ color: '#22C55E' }} />
                                                        <span style={{
                                                            fontSize: '14px',
                                                            fontWeight: '600',
                                                            color: '#374151',
                                                            textTransform: 'capitalize',
                                                        }}>
                                                            {key}
                                                        </span>
                                                    </div>
                                                    <p style={{
                                                        fontSize: '14px',
                                                        color: '#6B7280',
                                                        margin: 0,
                                                        lineHeight: '1.5',
                                                    }}>
                                                        {value}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Suggestions */}
                                        {feedback.suggestions && (
                                            <div>
                                                <h4 style={{
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    color: '#374151',
                                                    marginBottom: '12px',
                                                }}>
                                                    Suggestions for Improvement
                                                </h4>
                                                <ul style={{
                                                    margin: 0,
                                                    paddingLeft: '20px',
                                                }}>
                                                    {feedback.suggestions.map((suggestion, idx) => (
                                                        <li
                                                            key={idx}
                                                            style={{
                                                                fontSize: '14px',
                                                                color: '#6B7280',
                                                                marginBottom: '8px',
                                                                lineHeight: '1.5',
                                                            }}
                                                        >
                                                            {suggestion}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
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
                                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: '0 0 8px' }}>Writing Trainer</h2>
                                <p style={{ color: '#6B7280', marginBottom: '32px' }}>Fine-tune your writing speed and precision.</p>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                                    <motion.button
                                        whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(34, 197, 94, 0.15)' }}
                                        onClick={() => setTrainerMode('speed')}
                                        style={{
                                            padding: '32px', textAlign: 'left', borderRadius: '20px', border: '2px solid #F3F4F6',
                                            backgroundColor: 'white', cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                                            <Zap size={24} style={{ color: '#22C55E' }} />
                                        </div>
                                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>Speed Writing</h3>
                                        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0, lineHeight: '1.5' }}>Rapid-fire prompts to improve your typing speed and phrasing flow.</p>
                                    </motion.button>
                                </div>
                            </div>
                        ) : (
                            <SpeedWritingTrainer onBack={() => setTrainerMode(null)} />
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
                                background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
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
                                You've finished the Writing practice session.
                            </p>

                            <div style={{
                                marginBottom: '32px',
                                padding: '20px',
                                backgroundColor: '#F8FAFC',
                                borderRadius: '16px',
                            }}>
                                <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '4px' }}>Draft Score</p>
                                <p style={{ fontSize: '36px', fontWeight: '800', color: '#22C55E', margin: 0 }}>
                                    {feedback?.score || 0}%
                                </p>
                            </div>

                            <div style={{ display: 'grid', gap: '12px' }}>
                                <button
                                    onClick={() => {
                                        setShowPopup(false);
                                        setEssay('');
                                        setFeedback(null);
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
                                        setSelectedPrompt(null);
                                        setEssay('');
                                        setFeedback(null);
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
                                        background: (prompts.findIndex(p => p.id === selectedPrompt?.id) < prompts.length - 1) ? '#F3F4F6' : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                                        color: (prompts.findIndex(p => p.id === selectedPrompt?.id) < prompts.length - 1) ? '#374151' : 'white',
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
                title="Writing Rules"
                description="Follow these guidelines to improve your writing skills:"
                rules={writingRules}
            />
        </div>
    )
}
