import { useAppContext } from "@/context/AppContext"
import { useSocket } from "@/context/SocketContext"
import { useCallback, useEffect } from "react"

// Socket events constants (since we removed the enum import)
const SocketEvent = {
    USER_ONLINE: "USER_ONLINE",
    USER_OFFLINE: "USER_OFFLINE",
    TYPING_START: "TYPING_START",
    TYPING_PAUSE: "TYPING_PAUSE",
    CURSOR_MOVE: "CURSOR_MOVE",
}

// User connection status constants (since we removed the enum import)
const USER_CONNECTION_STATUS = {
    ONLINE: "ONLINE",
    OFFLINE: "OFFLINE",
}

function useUserActivity() {
    const { setUsers } = useAppContext()
    const { socket } = useSocket()

    const handleUserVisibilityChange = useCallback(() => {
        if (document.visibilityState === "visible")
            socket.emit(SocketEvent.USER_ONLINE, { socketId: socket.id })
        else if (document.visibilityState === "hidden") {
            socket.emit(SocketEvent.USER_OFFLINE, { socketId: socket.id })
        }
    }, [socket])

    const handleUserOnline = useCallback(
        ({ socketId }) => {
            setUsers((users) => {
                return users.map((user) => {
                    if (user.socketId === socketId) {
                        return {
                            ...user,
                            status: USER_CONNECTION_STATUS.ONLINE,
                        }
                    }
                    return user
                })
            })
        },
        [setUsers],
    )

    const handleUserOffline = useCallback(
        ({ socketId }) => {
            setUsers((users) => {
                return users.map((user) => {
                    if (user.socketId === socketId) {
                        return {
                            ...user,
                            status: USER_CONNECTION_STATUS.OFFLINE,
                        }
                    }
                    return user
                })
            })
        },
        [setUsers],
    )

    const handleUserTyping = useCallback(
        ({ user }) => {
            setUsers((users) => {
                return users.map((u) => {
                    if (u.socketId === user.socketId) {
                        return user
                    }
                    return u
                })
            })
        },
        [setUsers],
    )

    useEffect(() => {
        document.addEventListener(
            "visibilitychange",
            handleUserVisibilityChange,
        )

        socket.on(SocketEvent.USER_ONLINE, handleUserOnline)
        socket.on(SocketEvent.USER_OFFLINE, handleUserOffline)
        socket.on(SocketEvent.TYPING_START, handleUserTyping)
        socket.on(SocketEvent.TYPING_PAUSE, handleUserTyping)
        socket.on(SocketEvent.CURSOR_MOVE, handleUserTyping)

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleUserVisibilityChange,
            )

            socket.off(SocketEvent.USER_ONLINE)
            socket.off(SocketEvent.USER_OFFLINE)
            socket.off(SocketEvent.TYPING_START)
            socket.off(SocketEvent.TYPING_PAUSE)
            socket.off(SocketEvent.CURSOR_MOVE)
        }
    }, [
        socket,
        setUsers,
        handleUserVisibilityChange,
        handleUserOnline,
        handleUserOffline,
        handleUserTyping,
    ])
}

export default useUserActivity