/**
 * User connection status constants
 */
const USER_CONNECTION_STATUS = {
    OFFLINE: "offline",
    ONLINE: "online",
}

/**
 * User status constants
 */
const USER_STATUS = {
    INITIAL: "initial",
    CONNECTING: "connecting",
    ATTEMPTING_JOIN: "attempting-join",
    JOINED: "joined",
    CONNECTION_FAILED: "connection-failed",
    DISCONNECTED: "disconnected",
}

/**
 * @typedef {Object} User
 * @property {string} username - User's display name
 * @property {string} roomId - Room identifier
 */

/**
 * @typedef {Object} RemoteUser
 * @property {string} username - User's display name
 * @property {string} roomId - Room identifier
 * @property {USER_CONNECTION_STATUS} status - User connection status
 * @property {number} cursorPosition - Current cursor position
 * @property {boolean} typing - Whether user is currently typing
 * @property {string} currentFile - Currently active file
 * @property {string} socketId - Socket connection ID
 * @property {number} [selectionStart] - Text selection start position
 * @property {number} [selectionEnd] - Text selection end position
 */

export { USER_CONNECTION_STATUS, USER_STATUS }