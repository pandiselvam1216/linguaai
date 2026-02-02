import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    BookOpen, Plus, Edit2, Trash2, X, Check, Search,
    Headphones, Mic, FileText, PenTool, CheckSquare
} from 'lucide-react'
import api from '../../services/api'

const moduleIcons = {
    listening: Headphones,
    speaking: Mic,
    reading: FileText,
    writing: PenTool,
    grammar: CheckSquare,
}

const moduleColors = {
    listening: '#3B82F6',
    speaking: '#22C55E',
    reading: '#8B5CF6',
    writing: '#F97316',
    grammar: '#EF4444',
}

export default function QuestionManagement() {
    const [activeModule, setActiveModule] = useState('grammar')
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingQuestion, setEditingQuestion] = useState(null)
    const [search, setSearch] = useState('')
    const [formData, setFormData] = useState({
        content: '',
        difficulty: 1,
        options: [{ text: '', value: 'A' }, { text: '', value: 'B' }, { text: '', value: 'C' }, { text: '', value: 'D' }],
        correct_answer: 'A',
        explanation: ''
    })

    useEffect(() => {
        fetchQuestions()
    }, [activeModule])

    const fetchQuestions = async () => {
        setLoading(true)
        try {
            let endpoint = `/${activeModule}/questions`
            let dataKey = 'questions'

            if (['speaking', 'writing'].includes(activeModule)) {
                endpoint = `/${activeModule}/prompts`
                dataKey = 'prompts'
            }

            const response = await api.get(endpoint)
            const items = response.data[dataKey] || []

            // Normalize data
            const normalized = items.map(item => ({
                id: item.id,
                content: item.content || item.title, // Handle prompts having title
                prompt_content: item.content, // Store original content if needed
                difficulty: item.difficulty || 1,
                options: item.options,
                correct_answer: item.correct_answer,
                type: ['speaking', 'writing'].includes(activeModule) ? 'prompt' : 'mcq'
            }))

            setQuestions(normalized)
        } catch (error) {
            console.error('Failed to fetch questions:', error)
            setQuestions([])
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = (question = null) => {
        if (question) {
            setEditingQuestion(question)
            setFormData({
                content: question.content,
                difficulty: question.difficulty,
                options: question.options || [{ text: '', value: 'A' }, { text: '', value: 'B' }, { text: '', value: 'C' }, { text: '', value: 'D' }],
                correct_answer: question.correct_answer,
                explanation: question.explanation || ''
            })
        } else {
            setEditingQuestion(null)
            setFormData({
                content: '',
                difficulty: 1,
                options: [{ text: '', value: 'A' }, { text: '', value: 'B' }, { text: '', value: 'C' }, { text: '', value: 'D' }],
                correct_answer: 'A',
                explanation: ''
            })
        }
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setEditingQuestion(null)
    }

    const handleOptionChange = (index, text) => {
        const newOptions = [...formData.options]
        newOptions[index] = { ...newOptions[index], text }
        setFormData(p => ({ ...p, options: newOptions }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        alert('Question saved! (API integration pending)')
        handleCloseModal()
    }

    const handleDelete = async (questionId) => {
        if (!window.confirm('Are you sure you want to delete this question?')) return
        alert('Question deleted! (API integration pending)')
    }

    const filteredQuestions = questions.filter(q =>
        q.content.toLowerCase().includes(search.toLowerCase())
    )

    const modules = [
        { key: 'grammar', label: 'Grammar' },
        { key: 'listening', label: 'Listening' },
        { key: 'speaking', label: 'Speaking' },
        { key: 'reading', label: 'Reading' },
        { key: 'writing', label: 'Writing' },
    ]

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
                            Question Management
                        </h1>
                        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
                            Manage questions for all learning modules
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    style={{
                        padding: '12px 24px',
                        borderRadius: '10px',
                        border: 'none',
                        background: `linear-gradient(135deg, ${moduleColors[activeModule]} 0%, ${moduleColors[activeModule]}99 100%)`,
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: `0 4px 14px ${moduleColors[activeModule]}66`,
                    }}
                >
                    <Plus size={18} />
                    Add Question
                </button>
            </div>

            {/* Module Tabs */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '24px',
                backgroundColor: 'white',
                padding: '8px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
                {modules.map((module) => {
                    const Icon = moduleIcons[module.key]
                    const isActive = activeModule === module.key
                    return (
                        <button
                            key={module.key}
                            onClick={() => setActiveModule(module.key)}
                            style={{
                                flex: 1,
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: isActive ? moduleColors[module.key] : 'transparent',
                                color: isActive ? 'white' : '#6B7280',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.2s',
                            }}
                        >
                            <Icon size={18} />
                            {module.label}
                        </button>
                    )
                })}
            </div>

            {/* Search */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
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
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search questions..."
                        style={{
                            width: '100%',
                            padding: '12px 14px 12px 44px',
                            borderRadius: '10px',
                            border: '2px solid #E5E7EB',
                            fontSize: '14px',
                            outline: 'none',
                        }}
                    />
                </div>
            </div>

            {/* Questions List */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
                {loading ? (
                    <div style={{ padding: '48px', textAlign: 'center' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            border: '4px solid #E5E7EB',
                            borderTop: `4px solid ${moduleColors[activeModule]}`,
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto',
                        }} />
                    </div>
                ) : filteredQuestions.length === 0 ? (
                    <div style={{ padding: '48px', textAlign: 'center' }}>
                        <BookOpen size={48} style={{ color: '#D1D5DB', marginBottom: '16px' }} />
                        <p style={{ fontSize: '16px', color: '#6B7280' }}>No questions found</p>
                    </div>
                ) : (
                    <div>
                        {filteredQuestions.map((question, idx) => (
                            <motion.div
                                key={question.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                style={{
                                    padding: '20px 24px',
                                    borderTop: idx > 0 ? '1px solid #F3F4F6' : 'none',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    gap: '16px',
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            backgroundColor: question.difficulty === 1 ? '#F0FDF4' : question.difficulty === 2 ? '#FEF3C7' : '#FEE2E2',
                                            color: question.difficulty === 1 ? '#166534' : question.difficulty === 2 ? '#D97706' : '#991B1B',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                        }}>
                                            {question.difficulty === 1 ? 'Easy' : question.difficulty === 2 ? 'Medium' : 'Hard'}
                                        </span>
                                        <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                                            Answer: {question.correct_answer}
                                        </span>
                                    </div>
                                    <p style={{
                                        fontSize: '15px',
                                        color: '#111827',
                                        margin: 0,
                                        lineHeight: '1.5',
                                    }}>
                                        {question.content}
                                    </p>
                                    {question.options && (
                                        <div style={{
                                            display: 'flex',
                                            gap: '12px',
                                            marginTop: '12px',
                                            flexWrap: 'wrap',
                                        }}>
                                            {question.options.map((opt) => (
                                                <span
                                                    key={opt.value}
                                                    style={{
                                                        padding: '6px 12px',
                                                        borderRadius: '6px',
                                                        backgroundColor: opt.value === question.correct_answer ? '#EFF6FF' : '#F9FAFB',
                                                        border: opt.value === question.correct_answer ? '1px solid #3B82F6' : '1px solid #E5E7EB',
                                                        fontSize: '13px',
                                                        color: opt.value === question.correct_answer ? '#1D4ED8' : '#374151',
                                                    }}
                                                >
                                                    <strong>{opt.value}.</strong> {opt.text}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => handleOpenModal(question)}
                                        style={{
                                            padding: '8px',
                                            borderRadius: '8px',
                                            border: '1px solid #E5E7EB',
                                            backgroundColor: 'white',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <Edit2 size={16} style={{ color: '#6B7280' }} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(question.id)}
                                        style={{
                                            padding: '8px',
                                            borderRadius: '8px',
                                            border: '1px solid #FECACA',
                                            backgroundColor: '#FEF2F2',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <Trash2 size={16} style={{ color: '#EF4444' }} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            padding: '20px',
                        }}
                        onClick={handleCloseModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                padding: '32px',
                                width: '100%',
                                maxWidth: '600px',
                                maxHeight: '90vh',
                                overflowY: 'auto',
                                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '24px',
                            }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', margin: 0 }}>
                                    {editingQuestion ? 'Edit Question' : 'Add New Question'}
                                </h2>
                                <button
                                    onClick={handleCloseModal}
                                    style={{
                                        padding: '8px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: '#F3F4F6',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <X size={18} style={{ color: '#6B7280' }} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                        Question
                                    </label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))}
                                        required
                                        rows={3}
                                        style={{
                                            width: '100%',
                                            padding: '12px 14px',
                                            borderRadius: '10px',
                                            border: '2px solid #E5E7EB',
                                            fontSize: '14px',
                                            outline: 'none',
                                            resize: 'vertical',
                                            fontFamily: 'inherit',
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                        Difficulty
                                    </label>
                                    <select
                                        value={formData.difficulty}
                                        onChange={(e) => setFormData(p => ({ ...p, difficulty: parseInt(e.target.value) }))}
                                        style={{
                                            width: '100%',
                                            padding: '12px 14px',
                                            borderRadius: '10px',
                                            border: '2px solid #E5E7EB',
                                            fontSize: '14px',
                                            backgroundColor: 'white',
                                        }}
                                    >
                                        <option value={1}>Easy</option>
                                        <option value={2}>Medium</option>
                                        <option value={3}>Hard</option>
                                    </select>
                                </div>

                                {['grammar', 'listening', 'reading'].includes(activeModule) && (
                                    <>
                                        <div style={{ marginBottom: '20px' }}>
                                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '12px' }}>
                                                Answer Options
                                            </label>
                                            {formData.options.map((opt, idx) => (
                                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                                                    <span style={{
                                                        width: '32px',
                                                        height: '32px',
                                                        borderRadius: '8px',
                                                        backgroundColor: '#F3F4F6',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: '600',
                                                        fontSize: '14px',
                                                        color: '#374151',
                                                    }}>
                                                        {opt.value}
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={opt.text}
                                                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                                                        placeholder={`Option ${opt.value}`}
                                                        style={{
                                                            flex: 1,
                                                            padding: '10px 14px',
                                                            borderRadius: '8px',
                                                            border: '2px solid #E5E7EB',
                                                            fontSize: '14px',
                                                            outline: 'none',
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div style={{ marginBottom: '20px' }}>
                                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                                Correct Answer
                                            </label>
                                            <select
                                                value={formData.correct_answer}
                                                onChange={(e) => setFormData(p => ({ ...p, correct_answer: e.target.value }))}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 14px',
                                                    borderRadius: '10px',
                                                    border: '2px solid #E5E7EB',
                                                    fontSize: '14px',
                                                    backgroundColor: 'white',
                                                }}
                                            >
                                                <option value="A">A</option>
                                                <option value="B">B</option>
                                                <option value="C">C</option>
                                                <option value="D">D</option>
                                            </select>
                                        </div>
                                    </>
                                )}

                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                        Explanation (optional)
                                    </label>
                                    <textarea
                                        value={formData.explanation}
                                        onChange={(e) => setFormData(p => ({ ...p, explanation: e.target.value }))}
                                        rows={2}
                                        placeholder="Explain why this is the correct answer..."
                                        style={{
                                            width: '100%',
                                            padding: '12px 14px',
                                            borderRadius: '10px',
                                            border: '2px solid #E5E7EB',
                                            fontSize: '14px',
                                            outline: 'none',
                                            resize: 'vertical',
                                            fontFamily: 'inherit',
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            borderRadius: '10px',
                                            border: '1px solid #E5E7EB',
                                            backgroundColor: 'white',
                                            color: '#374151',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            borderRadius: '10px',
                                            border: 'none',
                                            background: `linear-gradient(135deg, ${moduleColors[activeModule]} 0%, ${moduleColors[activeModule]}99 100%)`,
                                            color: 'white',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                        }}
                                    >
                                        <Check size={16} />
                                        {editingQuestion ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
