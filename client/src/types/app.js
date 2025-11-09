import { USER_STATUS } from "./user"

/**
 * @typedef {import("@tldraw/tldraw").StoreSnapshot | null} DrawingData
 */

/**
 * Activity states for the application
 */
const ACTIVITY_STATE = {
    CODING: "coding",
    DRAWING: "drawing",
}

/**
 * @typedef {Object} AppContext
 * @property {import("./user").RemoteUser[]} users - Array of remote users
 * @property {Function} setUsers - Function to update users array
 * @property {import("./user").User} currentUser - Current user object
 * @property {Function} setCurrentUser - Function to update current user
 * @property {import("./user").USER_STATUS} status - Current user status
 * @property {Function} setStatus - Function to update status
 * @property {ACTIVITY_STATE} activityState - Current activity state
 * @property {Function} setActivityState - Function to update activity state
 * @property {DrawingData} drawingData - Drawing data from tldraw
 * @property {Function} setDrawingData - Function to update drawing data
 */

export { ACTIVITY_STATE }