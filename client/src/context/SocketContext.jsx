import { createContext, useContext, useCallback, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
import { useAppContext } from "./AppContext";

const SocketContext = createContext(null);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) throw new Error("useSocket must be used within a SocketProvider");
    return context;
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const SocketEvent = {
    USERNAME_EXISTS: "USERNAME_EXISTS",
    JOIN_ACCEPTED: "JOIN_ACCEPTED",
    USER_DISCONNECTED: "USER_DISCONNECTED",
    REQUEST_DRAWING: "REQUEST_DRAWING",
    SYNC_DRAWING: "SYNC_DRAWING",
};

const SocketProvider = ({ children }) => {
    const { setUsers, setStatus, setCurrentUser, drawingData, setDrawingData } = useAppContext();

    const socket = useMemo(
        () => io(BACKEND_URL, { reconnectionAttempts: 2 }),
        []
    );

    const handleError = useCallback((err) => {
        console.error("Socket error:", err);
        setStatus("CONNECTION_FAILED");
        toast.dismiss();
        toast.error("Failed to connect to the server");
    }, [setStatus]);

    const handleUsernameExist = useCallback(() => {
        toast.dismiss();
        setStatus("IDLE");
        toast.error("Username already exists in the room. Choose a different one.");
    }, [setStatus]);

    const handleJoinAccepted = useCallback(
        ({ user, users }) => {
            setCurrentUser(user);
            setUsers(users);
            toast.dismiss();
            setStatus("JOINED");

            if (users.length > 1) toast.loading("Syncing data...");
        },
        [setCurrentUser, setUsers, setStatus]
    );

    const handleUserLeft = useCallback(
        ({ user }) => {
            toast.success(`${user.username} left the room`);
            setUsers(prevUsers => prevUsers.filter(u => u.username !== user.username));
        },
        [setUsers]
    );

    const handleRequestDrawing = useCallback(
        ({ socketId }) => socket.emit(SocketEvent.SYNC_DRAWING, { socketId, drawingData }),
        [drawingData, socket]
    );

    const handleDrawingSync = useCallback(
        ({ drawingData }) => setDrawingData(drawingData),
        [setDrawingData]
    );

    useEffect(() => {
        socket.on("connect_error", handleError);
        socket.on("connect_failed", handleError);
        socket.on(SocketEvent.USERNAME_EXISTS, handleUsernameExist);
        socket.on(SocketEvent.JOIN_ACCEPTED, handleJoinAccepted);
        socket.on(SocketEvent.USER_DISCONNECTED, handleUserLeft);
        socket.on(SocketEvent.REQUEST_DRAWING, handleRequestDrawing);
        socket.on(SocketEvent.SYNC_DRAWING, handleDrawingSync);

        return () => {
            socket.off("connect_error");
            socket.off("connect_failed");
            socket.off(SocketEvent.USERNAME_EXISTS);
            socket.off(SocketEvent.JOIN_ACCEPTED);
            socket.off(SocketEvent.USER_DISCONNECTED);
            socket.off(SocketEvent.REQUEST_DRAWING);
            socket.off(SocketEvent.SYNC_DRAWING);
        };
    }, [handleError, handleUsernameExist, handleJoinAccepted, handleUserLeft, handleRequestDrawing, handleDrawingSync, socket]);

    return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export { SocketProvider };
export default SocketContext;
