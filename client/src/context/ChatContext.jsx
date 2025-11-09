import { SocketEvent } from "@/types/socket"
import { createContext, useContext, useEffect, useState } from "react"
import { useSocket } from "./SocketContext"

const ChatContext = createContext(null)

export const useChatRoom = () => {
    const context = useContext(ChatContext)
    if (!context) {
        throw new Error("useChatRoom must be used within a ChatContextProvider")
    }
    return context
}

function ChatContextProvider({ children }) {
    const { socket } = useSocket()
    const [messages, setMessages] = useState([])
    const [isNewMessage, setIsNewMessage] = useState(false)
    const [lastScrollHeight, setLastScrollHeight] = useState(0)

  useEffect(() => {
  const handleReceiveMessage = ({ message }) => {
    console.log("Received message:", message)
    setMessages(prev => [...prev, message])
    setIsNewMessage(true)
  }

  socket.on(SocketEvent.RECEIVE_MESSAGE, handleReceiveMessage)

  return () => {
    socket.off(SocketEvent.RECEIVE_MESSAGE, handleReceiveMessage)
  }
}, [socket])


    return (
        <ChatContext.Provider
            value={{
                messages,
                setMessages,
                isNewMessage,
                setIsNewMessage,
                lastScrollHeight,
                setLastScrollHeight,
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export { ChatContextProvider }
export default ChatContext
