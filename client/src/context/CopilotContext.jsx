import { createContext, useContext, useState } from "react"
import toast from "react-hot-toast"
import axiosInstance from "../api/pollinationsApi"

const CopilotContext = createContext(null)

// Custom hook
export const useCopilot = () => {
  const context = useContext(CopilotContext)
  if (!context) {
    throw new Error("useCopilot must be used within a CopilotContextProvider")
  }
  return context
}

const CopilotContextProvider = ({ children }) => {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)

 
const generateCode = async () => {
    if (!input.trim()) {
        toast.error("Please write a prompt");
        return;
    }

    const toastId = toast.loading("Generating code...");
    setIsRunning(true);
    setOutput(""); // clear previous output

    try {
        const response = await axiosInstance.post("/", {
            messages: [
                {
                    role: "system",
                    content:
                        "You are a code generator copilot for project named Code Sync. Generate code based on the given prompt without explanation. Return only the code, formatted in Markdown using the appropriate language syntax. If you don't know the answer, respond with 'I don't know'.",
                },
                { role: "user", content: input },
            ],
            model: "mistral",
            private: true,
        });

        // Debug the response
        console.log("Copilot API response:", response.data);

        if (response.data) {
            setOutput(response.data); // <-- use response.data directly
            toast.success("Code generated successfully", { id: toastId });
        } else {
            toast.error("No code returned from API", { id: toastId });
        }
    } catch (error) {
        console.error("Error generating code:", error);
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        }
        toast.error("Failed to generate code", { id: toastId });
    } finally {
        setIsRunning(false);
        toast.dismiss();
    }
};



  return (
    <CopilotContext.Provider
      value={{
        input,
        setInput,
        output,
        isRunning,
        generateCode,
      }}
    >
      {children}
    </CopilotContext.Provider>
  )
}

export { CopilotContextProvider }
export default CopilotContext
