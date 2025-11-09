/**
 * @typedef {Object} ChatMessage
 * @property {string} id - Unique message identifier
 * @property {string} message - Message content
 * @property {string} username - Username of sender
 * @property {string} timestamp - Message timestamp
 */

/**
 * @typedef {Object} ChatContext
 * @property {ChatMessage[]} messages - Array of chat messages
 * @property {Function} setMessages - Function to update messages array
 * @property {boolean} isNewMessage - Flag indicating if there's a new message
 * @property {Function} setIsNewMessage - Function to update new message flag
 * @property {number} lastScrollHeight - Last scroll position
 * @property {Function} setLastScrollHeight - Function to update scroll position
 */

// Export empty object since we can't export types in JS
// These are now just documentation via JSDoc
export {}