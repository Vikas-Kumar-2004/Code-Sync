/**
 * View constants
 */
const VIEWS = {
    FILES: "FILES",
    CHATS: "CHATS",
    CLIENTS: "CLIENTS",
    RUN: "RUN",
    COPILOT: "COPILOT",
    SETTINGS: "SETTINGS",
}

/**
 * @typedef {Object} ViewContext
 * @property {VIEWS} activeView - Currently active view
 * @property {Function} setActiveView - Function to set active view
 * @property {boolean} isSidebarOpen - Whether sidebar is open
 * @property {Function} setIsSidebarOpen - Function to toggle sidebar
 * @property {Object} viewComponents - JSX components for each view
 * @property {Object} viewIcons - JSX icons for each view
 */

export { VIEWS }