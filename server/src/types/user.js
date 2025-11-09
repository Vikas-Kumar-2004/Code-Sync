/**
 * User connection status constants
 */
const USER_CONNECTION_STATUS = {
	OFFLINE: "offline",
	ONLINE: "online",
}

/**
 * @typedef {Object} User
 * @property {string} username - User's display name
 * @property {string} roomId - Room identifier
 * @property {USER_CONNECTION_STATUS} status - User connection status
 * @property {number} cursorPosition - Current cursor position
 * @property {boolean} typing - Whether user is currently typing
 * @property {string|null} currentFile - Currently active file
 * @property {string} socketId - Socket connection ID
 * @property {number} [selectionStart] - Text selection start position
 * @property {number} [selectionEnd] - Text selection end position
 */

export { USER_CONNECTION_STATUS }