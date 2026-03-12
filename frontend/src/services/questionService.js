import api from './api'

/**
 * Fetch questions for a given module from backend API only.
 * No local storage - always fetches fresh data from server.
 * @param {string} module - 'grammar' | 'listening' | 'reading' | 'writing' | 'speaking'
 * @returns {Promise<Array>} array of question objects
 */
export async function getModuleQuestions(module) {
    // Helper to format API data consistently
    const formatData = (items) => items.map(item => ({
        id: item.id,
        content: item.content || item.passage_text || '',
        title: item.title || item.content?.substring(0, 60) || 'Untitled',
        difficulty: item.difficulty || 1,
        options: item.options || null,
        correct_answer: item.correct_answer || null,
        explanation: item.explanation || null,
        time_limit: item.time_limit || 60,
        word_limit: item.word_limit || 150,
        audio_data: item.audio_data || item.audio_link || item.media_url || null,
    }));

    // Always fetch fresh data from API - no caching
    try {
        const response = await api.get(`/${module}/questions`);
        const data = response.data.questions || response.data.prompts || [];

        if (data && data.length > 0) {
            return formatData(data);
        }
    } catch (error) {
        console.error(`Failed to fetch ${module} questions from API:`, error);
    }
    
    return [];
}
