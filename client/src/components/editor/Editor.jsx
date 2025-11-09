import { useAppContext } from "@/context/AppContext"
import { useFileSystem } from "@/context/FileContext"
import { useSettings } from "@/context/SettingContext"
import { useSocket } from "@/context/SocketContext"
import usePageEvents from "@/hooks/usePageEvents"
import useResponsive from "@/hooks/useResponsive"
import { editorThemes } from "@/resources/Themes"
import { color } from "@uiw/codemirror-extensions-color"
import { hyperLink } from "@uiw/codemirror-extensions-hyper-link"
import { loadLanguage } from "@uiw/codemirror-extensions-langs"
import CodeMirror, { scrollPastEnd } from "@uiw/react-codemirror"
import { EditorView } from "@codemirror/view"
import { useEffect, useMemo, useState, useRef, useCallback } from "react"
import toast from "react-hot-toast"
import {
  collaborativeHighlighting,
  updateRemoteUsers,
} from "./collaborativeHighlighting"

const SocketEvent = {
  TYPING_START: "typing-start",
  FILE_UPDATED: "file-updated",
  TYPING_PAUSE: "typing-pause",
  CURSOR_MOVE: "cursor-move",
}

function Editor() {
  const { users, currentUser } = useAppContext()
  const { activeFile, setActiveFile } = useFileSystem()
  const { theme, language, fontSize } = useSettings()
  const { socket } = useSocket()
  const { viewHeight } = useResponsive()
  const [timeOut, setTimeOut] = useState(setTimeout(() => {}, 0))
  const filteredUsers = useMemo(
    () => users.filter((u) => u.username !== currentUser.username),
    [users, currentUser]
  )
  const [extensions, setExtensions] = useState([])
  const editorRef = useRef(null)
  const [lastCursorPosition, setLastCursorPosition] = useState(0)
  const [lastSelection, setLastSelection] = useState({})
  const cursorMoveTimeoutRef = useRef(null)

  // --- when local user types ---
  const onCodeChange = (code, view) => {
    if (!activeFile) return

    const file = { ...activeFile, content: code }
    setActiveFile(file)

    const selection = view.state?.selection?.main
    const cursorPosition = selection?.head || 0
    const selectionStart = selection?.from
    const selectionEnd = selection?.to

    socket.emit(SocketEvent.TYPING_START, {
      cursorPosition,
      selectionStart,
      selectionEnd,
    })
    socket.emit(SocketEvent.FILE_UPDATED, {
      fileId: activeFile.id,
      newContent: code,
    })

    clearTimeout(timeOut)
    const newTimeOut = setTimeout(
      () => socket.emit(SocketEvent.TYPING_PAUSE),
      1000
    )
    setTimeOut(newTimeOut)
  }

  // --- track cursor/selection moves ---
  const handleSelectionChange = useCallback(
    (view) => {
      if (!view.selectionSet) return
      const selection = view.state?.selection?.main
      const cursorPosition = selection?.head || 0
      const selectionStart = selection?.from
      const selectionEnd = selection?.to

      const cursorChanged = cursorPosition !== lastCursorPosition
      const selectionChanged =
        selectionStart !== lastSelection.start ||
        selectionEnd !== lastSelection.end

      if (cursorChanged || selectionChanged) {
        setLastCursorPosition(cursorPosition)
        setLastSelection({ start: selectionStart, end: selectionEnd })

        if (cursorMoveTimeoutRef.current) {
          clearTimeout(cursorMoveTimeoutRef.current)
        }

        cursorMoveTimeoutRef.current = setTimeout(() => {
          socket.emit(SocketEvent.CURSOR_MOVE, {
            cursorPosition,
            selectionStart,
            selectionEnd,
          })
        }, 100)
      }
    },
    [lastCursorPosition, lastSelection, socket]
  )

  usePageEvents()

  // --- setup editor extensions ---
  useEffect(() => {
    const exts = [
      color,
      hyperLink,
      collaborativeHighlighting(),
      EditorView.updateListener.of(handleSelectionChange),
      scrollPastEnd(),
    ]
    const langExt = loadLanguage(language.toLowerCase())
    if (langExt) {
      exts.push(langExt)
    } else {
      toast.error(
        "Syntax highlighting unavailable for this language. Try another.",
        { duration: 5000 }
      )
    }
    setExtensions(exts)
  }, [language, handleSelectionChange])

  // --- socket listeners ---
  useEffect(() => {
    if (!socket) return

    // File updates from other users
    socket.on(SocketEvent.FILE_UPDATED, ({ fileId, newContent }) => {
      if (activeFile && fileId === activeFile.id) {
        setActiveFile((prev) => ({ ...prev, content: newContent }))
      }
    })

    // Cursor / typing updates
    const applyRemoteUser = (user) => {
      if (editorRef.current?.view) {
        editorRef.current.view.dispatch({
          effects: updateRemoteUsers.of(
            filteredUsers.map((u) =>
              u.username === user.username ? { ...u, ...user } : u
            )
          ),
        })
      }
    }

    socket.on(SocketEvent.TYPING_START, ({ user }) => applyRemoteUser(user))
    socket.on(SocketEvent.CURSOR_MOVE, ({ user }) => applyRemoteUser(user))
    socket.on(SocketEvent.TYPING_PAUSE, ({ user }) =>
      applyRemoteUser({ ...user, typing: false })
    )

    return () => {
      socket.off(SocketEvent.FILE_UPDATED)
      socket.off(SocketEvent.TYPING_START)
      socket.off(SocketEvent.CURSOR_MOVE)
      socket.off(SocketEvent.TYPING_PAUSE)
    }
  }, [socket, activeFile, filteredUsers, setActiveFile])

  return (
    <CodeMirror
      ref={editorRef}
      theme={editorThemes[theme]}
      onChange={onCodeChange}
      value={activeFile?.content}
      extensions={extensions}
      minHeight="100%"
      maxWidth="100vw"
      style={{
        fontSize: fontSize + "px",
        height: viewHeight,
        position: "relative",
      }}
    />
  )
}

export default Editor
