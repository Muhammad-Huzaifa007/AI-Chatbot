import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import { Menu, X, ArrowRight, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";
import user from "../assets/user.png";
import { useNavigate, useParams, Link } from "react-router-dom";
import Markdown from "markdown-to-jsx";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";

const Chat = () => {
  const [toggle, setToggle] = useState(false);
  const [logout, setLogout] = useState(false);
  const [message, setMessage] = useState("");
  const [prompts, setPrompts] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();

  // /////////////////////////////  Fetching Prompts //////////////////////////////////////
  const fetchPrompts = async () => {
    if (!id) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/prompts/by-conversation/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPrompts(data.data);
      } else {
        console.error("Failed to fetch prompts");
      }
    } catch (error) {
      console.error("Error fetching prompts:", error);
    }
  };
  /////////////////  Fetching Conversations based on conversation_id || Routes in sidebar  ///////////////////
  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/conversations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.data);
      } else {
        console.error("Failed to fetch conversations");
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };
  // ///////////////////////////////   Create a new chat Button  //////////////////////////////////////////
  const createNewChat = async () => {
    // Step 1: Get the highest existing conversation_id
    const maxId = conversations.reduce((max, conv) => {
      const convId = parseInt(conv.id);
      return !isNaN(convId) && convId > max ? convId : max;
    }, 0);

    // Step 2: Create a new unique conversation_id
    const newConversationId = (maxId + 1).toString();

    // Step 3: Navigate to new chat (no backend request needed)
    navigate(`/chat/${newConversationId}`);
    setMessage(""); // Clear input
    setPrompts([]); // Clear chat messages
  };

  // //////////////////////////  generating prompts /////////////////////////////////////////////////
  const submitPrompt = async () => {
    if (message.trim() === "" || loading || !id) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/prompts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: message, conversation_id: id }),
      });

      if (response.ok) {
        setMessage("");
        await fetchPrompts();
        await fetchConversations();
      } else {
        console.error("Error saving prompt");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  // /////////////////////  Time Formatting //////////////////////////////////////////
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  /////////////////  Logout Button  ///////////////////////////////////
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  ////////////////////  Deleting a Conversation ///////////////////////////////////////////
  const deleteConversation = async (conversationId: string) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:8000/api/prompts/by-conversation/${conversationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        await fetchConversations();
        if (id === conversationId) {
          navigate("/"); // Optionally redirect if current chat is deleted
        }
      } else {
        console.error("Failed to delete conversation");
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };
/////////////////////////     Deleting a Prompt /////////////////////////////////////
const deletePrompt = async (promptId: string) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`http://localhost:8000/api/prompts/${promptId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      // Remove the deleted prompt from the local state
      setPrompts((prevPrompts) => prevPrompts.filter((p) => p.id !== promptId));
    } else {
      console.error("Failed to delete prompt");
    }
  } catch (error) {
    console.error("Error deleting prompt:", error);
  }
};

  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    fetchPrompts();
    fetchConversations();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [prompts]);

  return (
    <section className="bg-[#222222] h-screen w-full relative overflow-hidden">
      {/* Navbar */}
      <div>
        <nav className="flex items-center justify-between py-3 px-1 md:px-5 bg-[#272727] shadow-lg">
          <div className="flex items-center gap-x-5">
            <Menu
              onClick={() => setToggle(!toggle)}
              className="w-6 h-6 text-white cursor-pointer max-lg:hidden"
            />
            <div className="flex items-center gap-x-1">
              <img
                src={logo}
                className="h-10 cursor-pointer transform transition-transform duration-300 hover:scale-110"
                alt="Logo"
              />
              <h1 className="text-white text-xl font-bold">AI ChatBot</h1>
            </div>
          </div>
          <div>
            <img
              onClick={() => setLogout(!logout)}
              src={user}
              alt="User"
              className="rounded-full h-10 cursor-pointer"
            />
            <AnimatePresence>
              {logout && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-4 right-17 bg-[#303030] rounded-lg px-3 py-1"
                >
                  <button
                    onClick={handleLogout}
                    className="text-white font-semibold hover:text-blue-500 cursor-pointer"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Sidebar */}
        <AnimatePresence>
          {toggle && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 140, damping: 30 }}
              className="w-[40%] lg:w-[25%] h-screen absolute top-0 left-0 bg-[#141417] z-50 shadow-lg"
            >
              <div className="h-screen flex flex-col px-1 gap-y-3 lg:p-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center lg:gap-x-2">
                    <img src={logo} alt="Logo" className="h-5 lg:h-10" />
                    <h1 className="text-white font-semibold">AI Chatbot</h1>
                  </div>
                  <X
                    onClick={() => setToggle(false)}
                    className="w-6 h-6 text-white cursor-pointer"
                  />
                </div>
                <div>
                  <h2 className=" text-white text-xl font-semibold">
                    Your conversations
                  </h2>
                  <button
                    onClick={createNewChat}
                    className="mt-5 text-white ml-15 py-3 px-5 rounded-xl cursor-pointer bg-blue-500 hover:bg-blue-600"
                  >
                    Add a new chat
                  </button>
                </div>

                <div className="mt-4 flex flex-col gap-3 overflow-y-auto max-h-[80vh] pr-2 scroll-none">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => setToggle(true)}
                      className="flex items-center justify-between"
                    >
                      <Link
                        to={`/chat/${conv.id}`}
                        className={` w-[238px] bg-[#1e1e22] text-white p-3 rounded-lg shadow-sm hover:bg-[#333] transition-all ${
                          id === conv.id ? "border border-blue-500" : ""
                        }`}
                      >
                        <p className="truncate max-w-full">
                          {conv.title || "Untitled Chat"}
                        </p>
                      </Link>
                      <AlertDialog >
                        <AlertDialogTrigger>
                        <Trash2 className="w-5 h-5 text-red-500 ml-2 cursor-pointer hover:text-red-600"/></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your chat conversation.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={(e) => {
                          e.stopPropagation(); // Prevent navigation when clicking delete
                          deleteConversation(conv.id);
                        }}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat messages */}
      <div
        className={`absolute top-20 bottom-30 lg:bottom-32 overflow-y-auto px-5 pb-10 scroll-none transition-all duration-300 ${
          toggle ? "left-[25%] w-[75%]" : "left-0 right-0"
        }`}
      >
        <div className="flex flex-col gap-6">
        {prompts.map((prompt:any) => (
  <div key={prompt.id} className="flex flex-col gap-2">
    {/* Prompt with Trash Icon */}
    <div className="self-end max-w-[75%]">
      <div className="flex items-center bg-blue-500 text-white p-4 rounded-3xl rounded-br-none shadow-md">
        <button
          onClick={() => deletePrompt(prompt.id)}
          className="text-white hover:text-red-500 mr-2 cursor-pointer"
          title="Delete Prompt"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <span>{prompt.prompt}</span>
      </div>
    </div>
    <div className="self-end text-xs text-gray-400 pr-2">
      {formatTime(prompt.created_at)}
    </div>

    {/* Response */}
    <div className="self-start max-w-[75%] bg-[#303030] text-white p-4 rounded-3xl rounded-bl-none shadow-md">
      <Markdown>
        {prompt.response ||
          (loading && prompt === prompts[prompts.length - 1]
            ? "Generating Response..."
            : "")}
      </Markdown>
    </div>
    <div className="self-start text-xs text-gray-400 pr-2">
      {formatTime(prompt.created_at)}
    </div>
  </div>
))}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div
        className={`absolute bottom-5 lg:bottom-7 right-0 flex justify-center transition-all duration-300 ${
          toggle ? "left-85" : "lg:left-20 left-0"
        }`}
      >
        <div className="flex items-center bg-[#303030] text-white border border-gray-400 rounded-4xl px-5 w-full max-w-lg mx-5">
          <input
            value={loading ? "Generating response..." : message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            placeholder="Ask anything"
            className="w-full bg-[#303030] text-white border-none rounded-4xl pt-5 pb-5 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                e.preventDefault(); // Prevent the default action (form submission)
                submitPrompt(); // Trigger the submit prompt action
              }
            }}
          />
          <ArrowRight
            onClick={!loading ? submitPrompt : undefined}
            className={`w-8 h-8 text-black bg-white rounded-full p-2 cursor-pointer ${
              loading ? "bg-gray-400 text-gray-700 cursor-not-allowed" : ""
            }`}
          />
        </div>
      </div>
    </section>
  );
};

export default Chat;
