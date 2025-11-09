// File System Access API constants and utilities
// This replaces the TypeScript interface definitions

// File System Handle kinds
export const FILE_SYSTEM_KIND = {
    FILE: "file",
    DIRECTORY: "directory"
}

// Default options for file operations
export const DEFAULT_FILE_OPTIONS = {
    create: false
}

export const DEFAULT_DIRECTORY_OPTIONS = {
    create: false
}

export const DEFAULT_REMOVE_OPTIONS = {
    recursive: false
}

// Utility functions for type checking (optional)
export const isFileSystemHandle = (handle) => {
    return handle && 
           typeof handle === 'object' && 
           'kind' in handle && 
           'name' in handle &&
           (handle.kind === FILE_SYSTEM_KIND.FILE || handle.kind === FILE_SYSTEM_KIND.DIRECTORY)
}

export const isFileHandle = (handle) => {
    return isFileSystemHandle(handle) && 
           handle.kind === FILE_SYSTEM_KIND.FILE &&
           typeof handle.getFile === 'function'
}

export const isDirectoryHandle = (handle) => {
    return isFileSystemHandle(handle) && 
           handle.kind === FILE_SYSTEM_KIND.DIRECTORY &&
           typeof handle.getFileHandle === 'function' &&
           typeof handle.getDirectoryHandle === 'function'
}

// Check if File System Access API is supported
export const isFileSystemAccessSupported = () => {
    return 'showDirectoryPicker' in window
}

// Example usage in comments:
/*
// Check if API is supported
if (isFileSystemAccessSupported()) {
    const directoryHandle = await window.showDirectoryPicker()
    
    // Verify it's a directory handle
    if (isDirectoryHandle(directoryHandle)) {
        // Safe to use directory methods
        const fileHandle = await directoryHandle.getFileHandle('example.txt', DEFAULT_FILE_OPTIONS)
    }
}
*/