import { useAppContext } from "@/context/AppContext"
import { useChatRoom } from "@/context/ChatContext"
import { useEffect, useRef } from "react"

export default function ChatList() {
  const { currentUser } = useAppContext()
  const {
    messages,
    isNewMessage,
    setIsNewMessage,
    lastScrollHeight,
    setLastScrollHeight,
  } = useChatRoom()
  const containerRef = useRef(null)

  const handleScroll = (e) => setLastScrollHeight(e.target.scrollTop)

  // Scroll to bottom when new message arrives
  useEffect(() => {
    if (!containerRef.current) return
    if (isNewMessage) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
      setIsNewMessage(false)
    } else {
      containerRef.current.scrollTop = lastScrollHeight
    }
  }, [messages, isNewMessage, lastScrollHeight, setIsNewMessage])

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-grow overflow-auto rounded-md bg-darkHover p-2"
    >
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`mb-2 w-[80%] break-words rounded-md px-3 py-2 ${
            msg.username === currentUser.username ? "ml-auto bg-dark" : "bg-darkHover"
          }`}
        >
          <div className="flex justify-between">
            <span className="text-xs text-primary">{msg.username}</span>
            <span className="text-xs text-white">{msg.timestamp}</span>
          </div>
          <p className="py-1">{msg.message}</p>
        </div>
      ))}
    </div>
  )
}
