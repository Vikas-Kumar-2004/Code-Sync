/**
 * @typedef {string} Id - Unique identifier
 * @typedef {string} FileName - File or directory name
 * @typedef {string} FileContent - File content as string
 */

/**
 * @typedef {Object} FileSystemItem
 * @property {string} id - Unique identifier
 * @property {FileName} name - File or directory name
 * @property {"file"|"directory"} type - Item type
 * @property {FileSystemItem[]} [children] - Child items (for directories)
 * @property {FileContent} [content] - File content (for files)
 * @property {boolean} [isOpen] - Whether directory is open
 */

/**
 * @typedef {Object} FileContext
 * @property {FileSystemItem} fileStructure - Root file structure
 * @property {FileSystemItem[]} openFiles - Array of currently open files
 * @property {FileSystemItem|null} activeFile - Currently active file
 * @property {Function} setActiveFile - Set the active file
 * @property {Function} closeFile - Close a file by ID
 * @property {Function} toggleDirectory - Toggle directory open/closed
 * @property {Function} collapseDirectories - Collapse all directories
 * @property {Function} createDirectory - Create new directory, returns ID
 * @property {Function} updateDirectory - Update directory children
 * @property {Function} renameDirectory - Rename a directory
 * @property {Function} deleteDirectory - Delete a directory
 * @property {Function} createFile - Create new file, returns ID
 * @property {Function} updateFileContent - Update file content
 * @property {Function} openFile - Open a file by ID
 * @property {Function} renameFile - Rename a file, returns success boolean
 * @property {Function} deleteFile - Delete a file
 * @property {Function} downloadFilesAndFolders - Download all files and folders
 */

// Export empty object since we can't export types in JS
// These are now just documentation via JSDoc
export {}