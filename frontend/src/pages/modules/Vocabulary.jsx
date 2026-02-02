import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search, BookmarkPlus, Volume2, Trash2, Book,
    Sparkles, ArrowRight, BookmarkCheck, X
} from 'lucide-react'
import api from '../../services/api'

export default function Vocabulary() {
    const [searchWord, setSearchWord] = useState('')
    const [searchResult, setSearchResult] = useState(null)
    const [savedWords, setSavedWords] = useState([])
    const [searching, setSearching] = useState(false)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('search') // 'search' or 'saved'

    useEffect(() => {
        fetchSavedWords()
    }, [])

    const fetchSavedWords = async () => {
        try {
            const res = await api.get('/vocabulary/saved')
            setSavedWords(res.data.words || [])
        } catch (error) {
            console.error('Failed to fetch saved words:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!searchWord.trim()) return

        setSearching(true)
        setSearchResult(null)
        setActiveTab('search')

        try {
            const res = await api.get(`/vocabulary/search?word=${encodeURIComponent(searchWord)}`)
            setSearchResult(res.data)
        } catch (error) {
            setSearchResult({ error: 'Word not found' })
        } finally {
            setSearching(false)
        }
    }

    const saveWord = async (word) => {
        try {
            await api.post('/vocabulary/saved', { word })
            // Optimistic update
            const newSavedWord = {
                id: Date.now(),
                word: searchResult.word,
                definition: searchResult.meanings?.[0]?.definitions?.[0]?.definition,
                part_of_speech: searchResult.meanings?.[0]?.part_of_speech
            }
            setSavedWords([newSavedWord, ...savedWords])

            // Re-fetch to confirm
            fetchSavedWords()
        } catch (error) {
            console.error('Failed to save word:', error)
        }
    }

    const deleteWord = async (wordId) => {
        try {
            await api.delete(`/vocabulary/saved/${wordId}`)
            setSavedWords(savedWords.filter(w => w.id !== wordId))
        } catch (error) {
            console.error('Failed to delete word:', error)
        }
    }

    const playAudio = (url) => {
        if (url) {
            new Audio(url).play()
        }
    }

    const isWordSaved = (word) => {
        return savedWords.some(w => w.word.toLowerCase() === word.toLowerCase())
    }

    return (
        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '32px 24px',
            minHeight: 'calc(100vh - 80px)'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '32px'
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
                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)'
                        }}>
                            <Book size={24} style={{ color: 'white' }} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', margin: 0 }}>
                                Vocabulary Builder
                            </h1>
                            <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
                                Expand your lexicon with definitions, synonyms, and pronunciation
                            </p>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        backgroundColor: 'white',
                        padding: '4px',
                        borderRadius: '12px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        border: '1px solid #E5E7EB'
                    }}>
                        <button
                            onClick={() => setActiveTab('search')}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: activeTab === 'search' ? '#8B5CF6' : 'transparent',
                                color: activeTab === 'search' ? 'white' : '#6B7280',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <Search size={16} /> Search
                        </button>
                        <button
                            onClick={() => setActiveTab('saved')}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: activeTab === 'saved' ? '#8B5CF6' : 'transparent',
                                color: activeTab === 'saved' ? 'white' : '#6B7280',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <BookmarkCheck size={16} /> Saved ({savedWords.length})
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                    {/* Search Section */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'search' ? (
                            <motion.div
                                key="search"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div style={{
                                    backgroundColor: 'white',
                                    borderRadius: '16px',
                                    padding: '32px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                                    marginBottom: '24px',
                                    border: '1px solid #F3F4F6'
                                }}>
                                    <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: searchResult ? '40px' : '0' }}>
                                        <input
                                            type="text"
                                            value={searchWord}
                                            onChange={(e) => setSearchWord(e.target.value)}
                                            placeholder="Type a word to define..."
                                            style={{
                                                width: '100%',
                                                padding: '24px 24px 24px 64px',
                                                borderRadius: '16px',
                                                border: '2px solid #E5E7EB',
                                                fontSize: '18px',
                                                outline: 'none',
                                                backgroundColor: '#F9FAFB',
                                                transition: 'all 0.2s'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#8B5CF6'}
                                            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                                        />
                                        <Search
                                            size={24}
                                            style={{
                                                position: 'absolute',
                                                left: '24px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                color: '#9CA3AF'
                                            }}
                                        />
                                        <button
                                            type="submit"
                                            disabled={searching || !searchWord.trim()}
                                            style={{
                                                position: 'absolute',
                                                right: '16px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                padding: '12px 24px',
                                                borderRadius: '10px',
                                                border: 'none',
                                                background: searching ? '#D1D5DB' : 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                                                color: 'white',
                                                fontWeight: '600',
                                                fontSize: '14px',
                                                cursor: searching ? 'default' : 'pointer',
                                                transition: 'all 0.2s',
                                                boxShadow: searching ? 'none' : '0 4px 12px rgba(139, 92, 246, 0.3)'
                                            }}
                                        >
                                            {searching ? 'Searching...' : 'Search'}
                                        </button>
                                    </form>

                                    {/* Empty State */}
                                    {!searchResult && !searching && (
                                        <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.6 }}>
                                            <Sparkles size={48} style={{ color: '#DDD6FE', marginBottom: '16px' }} />
                                            <p style={{ fontSize: '16px', color: '#6B7280' }}>
                                                Enter a word above to see its definition, pronunciation, and more.
                                            </p>
                                        </div>
                                    )}

                                    {/* Results */}
                                    {searchResult && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {searchResult.error ? (
                                                <div style={{
                                                    padding: '24px',
                                                    borderRadius: '12px',
                                                    backgroundColor: '#FEF2F2',
                                                    color: '#EF4444',
                                                    textAlign: 'center',
                                                    fontWeight: '500'
                                                }}>
                                                    {searchResult.error}
                                                </div>
                                            ) : (
                                                <div>
                                                    <div style={{
                                                        display: 'flex',
                                                        alignItems: 'flex-start',
                                                        justifyContent: 'space-between',
                                                        marginBottom: '32px',
                                                        paddingBottom: '24px',
                                                        borderBottom: '1px solid #E5E7EB'
                                                    }}>
                                                        <div>
                                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                                                                <h2 style={{ fontSize: '42px', fontWeight: '800', color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>
                                                                    {searchResult.word}
                                                                </h2>
                                                                {searchResult.phonetic && (
                                                                    <span style={{ fontSize: '18px', color: '#6B7280', fontFamily: 'monospace' }}>
                                                                        {searchResult.phonetic}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {searchResult.audio_url && (
                                                                <button
                                                                    onClick={() => playAudio(searchResult.audio_url)}
                                                                    style={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '8px',
                                                                        marginTop: '12px',
                                                                        padding: '8px 16px',
                                                                        borderRadius: '20px',
                                                                        border: '1px solid #E5E7EB',
                                                                        backgroundColor: 'white',
                                                                        color: '#4B5563',
                                                                        fontSize: '14px',
                                                                        fontWeight: '500',
                                                                        cursor: 'pointer',
                                                                        transition: 'all 0.2s'
                                                                    }}
                                                                    onMouseEnter={(e) => {
                                                                        e.currentTarget.style.backgroundColor = '#F3F4F6';
                                                                        e.currentTarget.style.borderColor = '#D1D5DB';
                                                                    }}
                                                                    onMouseLeave={(e) => {
                                                                        e.currentTarget.style.backgroundColor = 'white';
                                                                        e.currentTarget.style.borderColor = '#E5E7EB';
                                                                    }}
                                                                >
                                                                    <Volume2 size={16} /> Listen
                                                                </button>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => isWordSaved(searchResult.word) ? deleteWord(savedWords.find(w => w.word === searchResult.word)?.id) : saveWord(searchResult.word)}
                                                            style={{
                                                                width: '48px',
                                                                height: '48px',
                                                                borderRadius: '12px',
                                                                border: 'none',
                                                                backgroundColor: isWordSaved(searchResult.word) ? '#8B5CF6' : '#F3F4F6',
                                                                color: isWordSaved(searchResult.word) ? 'white' : '#6B7280',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                transition: 'all 0.2s',
                                                                boxShadow: isWordSaved(searchResult.word) ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none'
                                                            }}
                                                        >
                                                            {isWordSaved(searchResult.word) ? <BookmarkCheck size={24} /> : <BookmarkPlus size={24} />}
                                                        </button>
                                                    </div>

                                                    <div style={{ display: 'grid', gap: '32px' }}>
                                                        {searchResult.meanings?.map((meaning, i) => (
                                                            <div key={i} style={{
                                                                backgroundColor: '#F9FAFB',
                                                                borderRadius: '16px',
                                                                padding: '24px'
                                                            }}>
                                                                <span style={{
                                                                    display: 'inline-block',
                                                                    padding: '4px 12px',
                                                                    borderRadius: '20px',
                                                                    backgroundColor: '#EDE9FE',
                                                                    color: '#7C3AED',
                                                                    fontSize: '13px',
                                                                    fontWeight: '600',
                                                                    textTransform: 'uppercase',
                                                                    letterSpacing: '0.05em',
                                                                    marginBottom: '16px'
                                                                }}>
                                                                    {meaning.part_of_speech}
                                                                </span>

                                                                {meaning.definitions?.map((def, j) => (
                                                                    <div key={j} style={{ marginBottom: j !== meaning.definitions.length - 1 ? '20px' : 0 }}>
                                                                        <div style={{ display: 'flex', gap: '12px' }}>
                                                                            <span style={{
                                                                                fontWeight: '700',
                                                                                color: '#9CA3AF',
                                                                                minWidth: '20px'
                                                                            }}>{j + 1}.</span>
                                                                            <div>
                                                                                <p style={{
                                                                                    fontSize: '16px',
                                                                                    color: '#1F2937',
                                                                                    margin: '0 0 8px 0',
                                                                                    lineHeight: '1.5'
                                                                                }}>
                                                                                    {def.definition}
                                                                                </p>
                                                                                {def.example && (
                                                                                    <p style={{
                                                                                        fontSize: '15px',
                                                                                        color: '#6B7280',
                                                                                        fontStyle: 'italic',
                                                                                        margin: 0,
                                                                                        paddingLeft: '12px',
                                                                                        borderLeft: '2px solid #E5E7EB'
                                                                                    }}>
                                                                                        "{def.example}"
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {meaning.synonyms?.length > 0 && (
                                                                    <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
                                                                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#4B5563', marginRight: '8px' }}>Synonyms:</span>
                                                                        <span style={{ fontSize: '14px', color: '#6B7280' }}>
                                                                            {meaning.synonyms.slice(0, 5).join(', ')}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="saved"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Saved Words Grid */}
                                {loading ? (
                                    <div style={{ textAlign: 'center', padding: '48px' }}>Loading...</div>
                                ) : savedWords.length > 0 ? (
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                        gap: '20px'
                                    }}>
                                        {savedWords.map((word, idx) => (
                                            <motion.div
                                                key={word.id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: idx * 0.05 }}
                                                style={{
                                                    backgroundColor: 'white',
                                                    borderRadius: '16px',
                                                    padding: '24px',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                                    border: '1px solid #F3F4F6',
                                                    position: 'relative',
                                                    transition: 'all 0.2s',
                                                    cursor: 'pointer'
                                                }}
                                                whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
                                                onClick={() => {
                                                    setSearchWord(word.word)
                                                    handleSearch({ preventDefault: () => { } })
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', margin: 0 }}>
                                                        {word.word}
                                                    </h3>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            deleteWord(word.id)
                                                        }}
                                                        style={{
                                                            padding: '6px',
                                                            borderRadius: '8px',
                                                            border: 'none',
                                                            backgroundColor: 'transparent',
                                                            color: '#9CA3AF',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor = '#FEF2F2';
                                                            e.currentTarget.style.color = '#EF4444';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor = 'transparent';
                                                            e.currentTarget.style.color = '#9CA3AF';
                                                        }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>

                                                {word.part_of_speech && (
                                                    <span style={{
                                                        display: 'inline-block',
                                                        fontSize: '12px',
                                                        fontWeight: '600',
                                                        color: '#7C3AED',
                                                        backgroundColor: '#F5F3FF',
                                                        padding: '2px 8px',
                                                        borderRadius: '12px',
                                                        marginBottom: '12px'
                                                    }}>
                                                        {word.part_of_speech}
                                                    </span>
                                                )}

                                                {word.definition && (
                                                    <p style={{
                                                        fontSize: '14px',
                                                        color: '#4B5563',
                                                        margin: 0,
                                                        lineHeight: '1.5',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 3,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}>
                                                        {word.definition}
                                                    </p>
                                                )}

                                                <div style={{
                                                    marginTop: '16px',
                                                    paddingTop: '16px',
                                                    borderTop: '1px solid #F3F4F6',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    color: '#8B5CF6',
                                                    fontSize: '13px',
                                                    fontWeight: '500'
                                                }}>
                                                    View Details <ArrowRight size={14} />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.6 }}>
                                        <BookmarkPlus size={48} style={{ color: '#DDD6FE', marginBottom: '16px' }} />
                                        <p style={{ fontSize: '16px', color: '#6B7280' }}>
                                            No saved words yet. Search for words and bookmark them to build your collection.
                                        </p>
                                        <button
                                            onClick={() => setActiveTab('search')}
                                            style={{
                                                marginTop: '24px',
                                                padding: '10px 20px',
                                                borderRadius: '8px',
                                                border: '1px solid #8B5CF6',
                                                backgroundColor: 'white',
                                                color: '#8B5CF6',
                                                fontWeight: '600',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Find Words
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    )
}
