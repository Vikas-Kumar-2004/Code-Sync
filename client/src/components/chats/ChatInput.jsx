import { useAppContext } from "@/context/AppContext"
import { useChatRoom } from "@/context/ChatContext"
import { useSocket } from "@/context/SocketContext"
import { formatDate } from "@/utils/formateDate"
import { useRef } from "react"
import { LuSendHorizontal } from "react-icons/lu"

import { v4 as uuidV4 } from "uuid"
import { SocketEvent } from "@/types/socket"

export default function ChatInput() {
  const { currentUser } = useAppContext()
  const { socket } = useSocket()
  const { setMessages, setIsNewMessage } = useChatRoom()
  const inputRef = useRef(null)

  const handleSendMessage = (e) => {
    e.preventDefault()
    const text = inputRef.current?.value.trim()
    if (!text) return

    const message = {
      id: uuidV4(),
      username: currentUser.username,
      message: text,
      timestamp: formatDate(new Date().toISOString()),
    }

    // Send message to the server
    socket.emit(SocketEvent.SEND_MESSAGE, { message })

    // Update local chat instantly (so user sees their message immediately)
    setMessages((prev) => [...prev, message])
    setIsNewMessage(true)

    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <form
      onSubmit={handleSendMessage}
      className="flex justify-between rounded-md border border-primary"
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter a message..."
        className="w-full flex-grow rounded-md border-none bg-dark p-2 outline-none"
      />
      <button
        type="submit"
        className="flex items-center justify-center rounded-r-md bg-primary p-2 text-black"
      >
        <LuSendHorizontal size={24} />
      </button>
    </form>
  )
}
