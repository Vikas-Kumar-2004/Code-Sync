import { useAppContext } from "@/context/AppContext";
import { useSocket } from "@/context/SocketContext";
import { SocketEvent } from "@/types/socket";
import { USER_STATUS } from "@/types/user";
import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import logo from "@/assets/logo.svg";

const FormComponent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const usernameRef = useRef(null);

    const { currentUser, setCurrentUser, status, setStatus, setUsers } = useAppContext();
    const { socket } = useSocket();

    const createNewRoomId = () => {
        setCurrentUser(prev => ({ ...prev, roomId: uuidv4() }));
        toast.success("Created a new Room ID");
        usernameRef.current?.focus();
    };

    const handleInputChanges = e => {
        const { name, value } = e.target;
        setCurrentUser(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!currentUser.username.trim()) return toast.error("Enter your username"), false;
        if (!currentUser.roomId.trim()) return toast.error("Enter a room ID"), false;
        if (currentUser.roomId.trim().length < 5) return toast.error("Room ID must be at least 5 characters"), false;
        if (currentUser.username.trim().length < 3) return toast.error("Username must be at least 3 characters"), false;
        return true;
    };

    const joinRoom = e => {
        e.preventDefault();
        if (status === USER_STATUS.ATTEMPTING_JOIN) return;
        if (!validateForm()) return;

        setStatus(USER_STATUS.ATTEMPTING_JOIN);
        const toastId = toast.loading("Joining room...");

        socket.emit(SocketEvent.JOIN_REQUEST, {
            username: currentUser.username,
            roomId: currentUser.roomId
        });

        socket.once(SocketEvent.JOIN_ACCEPTED, ({ user, users }) => {
            setCurrentUser(user);
            setUsers(users);
            setStatus(USER_STATUS.JOINED);
            toast.success("Joined room!", { id: toastId });
        });

        socket.once(SocketEvent.USERNAME_EXISTS, () => {
            setStatus(USER_STATUS.IDLE);
            toast.error("Username already exists", { id: toastId });
        });
    };

    useEffect(() => {
        if (location.state?.roomId) {
            setCurrentUser(prev => ({ ...prev, roomId: location.state.roomId }));
            if (!currentUser.username) toast.success("Enter your username");
        }
    }, [location.state?.roomId]);

    useEffect(() => {
        if (status === USER_STATUS.DISCONNECTED && !socket.connected) socket.connect();

        const isRedirect = sessionStorage.getItem("redirect") === "true";

        if (status === USER_STATUS.JOINED && !isRedirect) {
            sessionStorage.setItem("redirect", "true");
            navigate(`/editor/${currentUser.roomId}`, { state: { username: currentUser.username } });
        } else if (status === USER_STATUS.JOINED && isRedirect) {
            sessionStorage.removeItem("redirect");
            setStatus(USER_STATUS.DISCONNECTED);
            socket.disconnect();
            socket.connect();
        }
    }, [status, currentUser.roomId, currentUser.username, socket, navigate, setStatus]);

    return (
        <div className="flex w-full max-w-[500px] flex-col items-center justify-center gap-4 p-4 sm:w-[500px] sm:p-8">
            <div className="self-end text-sm text-gray-300">
                {status === USER_STATUS.ATTEMPTING_JOIN && "Joining room..."}
                {status === USER_STATUS.JOINED && "Welcome!"}
                {status === USER_STATUS.IDLE && ""}
            </div>

            <img src={logo} alt="Logo" className="w-full" />

            <form onSubmit={joinRoom} className="flex w-full flex-col gap-4">
                <input
                    type="text"
                    name="roomId"
                    placeholder="Room ID"
                    className="w-full rounded-md border border-gray-500 bg-darkHover px-3 py-3 focus:outline-none"
                    onChange={handleInputChanges}
                    value={currentUser.roomId}
                />
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="w-full rounded-md border border-gray-500 bg-darkHover px-3 py-3 focus:outline-none"
                    onChange={handleInputChanges}
                    value={currentUser.username}
                    ref={usernameRef}
                />
                <button type="submit" className="mt-2 w-full rounded-md bg-primary px-8 py-3 text-lg font-semibold text-black">
                    Join
                </button>
            </form>

            <button className="cursor-pointer select-none underline" onClick={createNewRoomId}>
                Generate Unique Room ID
            </button>
        </div>
    );
};

export default FormComponent;
