/**
 * @typedef {Object} Settings
 * @property {string} theme - Application theme
 * @property {string} language - Programming language setting
 * @property {number} fontSize - Editor font size
 * @property {string} fontFamily - Editor font family
 * @property {boolean} showGitHubCorner - Whether to show GitHub corner
 */

/**
 * @typedef {Object} SettingsContext
 * @property {string} theme - Application theme
 * @property {string} language - Programming language setting
 * @property {number} fontSize - Editor font size
 * @property {string} fontFamily - Editor font family
 * @property {boolean} showGitHubCorner - Whether to show GitHub corner
 * @property {Function} setTheme - Function to update theme
 * @property {Function} setLanguage - Function to update language
 * @property {Function} setFontSize - Function to update font size
 * @property {Function} setFontFamily - Function to update font family
 * @property {Function} setShowGitHubCorner - Function to toggle GitHub corner
 * @property {Function} resetSettings - Function to reset all settings
 */

// Export empty object since we can't export types in JS
// These are now just documentation via JSDoc
export {}