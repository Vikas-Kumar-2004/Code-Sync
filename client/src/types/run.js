/**
 * @typedef {Object} Language
 * @property {string} language - Programming language name
 * @property {string} version - Language version
 * @property {string[]} aliases - Array of language aliases
 */

/**
 * @typedef {Object} RunContext
 * @property {Function} setInput - Function to set code input
 * @property {string} output - Code execution output
 * @property {boolean} isRunning - Flag indicating if code is running
 * @property {Language[]} supportedLanguages - Array of supported languages
 * @property {Language} selectedLanguage - Currently selected language
 * @property {Function} setSelectedLanguage - Function to set selected language
 * @property {Function} runCode - Function to execute code
 */

// Export empty object since we can't export types in JS
// These are now just documentation via JSDoc
export {}