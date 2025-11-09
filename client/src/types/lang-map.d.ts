// Example usage of lang-map in JavaScript
import langMap from "lang-map"

// Get languages for a file extension
export const getLanguagesForExtension = (extension) => {
    try {
        return langMap.languages(extension) || []
    } catch (error) {
        console.warn(`No languages found for extension: ${extension}`)
        return []
    }
}

// Get extensions for a language
export const getExtensionsForLanguage = (language) => {
    try {
        return langMap.extensions(language) || []
    } catch (error) {
        console.warn(`No extensions found for language: ${language}`)
        return []
    }
}

// Get all language mappings
export const getAllLanguageMappings = () => {
    try {
        const mappings = langMap()
        return {
            languages: mappings.languages || {},
            extensions: mappings.extensions || {}
        }
    } catch (error) {
        console.error('Error getting language mappings:', error)
        return { languages: {}, extensions: {} }
    }
}

// Utility function to detect language from filename
export const detectLanguageFromFilename = (filename) => {
    const extension = filename.split('.').pop()
    if (!extension) return null
    
    const languages = getLanguagesForExtension(`.${extension}`)
    return languages.length > 0 ? languages[0] : null
}

// Utility function to get primary extension for a language
export const getPrimaryExtensionForLanguage = (language) => {
    const extensions = getExtensionsForLanguage(language)
    return extensions.length > 0 ? extensions[0] : null
}

// Example usage in comments:
/*
// Detect language from file extension
const languages = getLanguagesForExtension('.js')  // ['JavaScript']
const extensions = getExtensionsForLanguage('JavaScript')  // ['.js', '.jsx', '.mjs', ...]

// Detect language from filename
const detectedLang = detectLanguageFromFilename('example.py')  // 'Python'

// Get all mappings
const allMappings = getAllLanguageMappings()
console.log(allMappings.languages['.ts'])  // ['TypeScript']
*/