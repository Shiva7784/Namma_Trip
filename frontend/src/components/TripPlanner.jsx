import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import ArrowDown from '../assets/Dinitha/arrow-dwon.json';
import Smile from '../assets/Dinitha/smile.json';

const TripPlanner = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Welcome to Namma Trip Companion! How can I assist you today? 😊`,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [sessionId, setSessionId] = useState(null); // ADD THIS STATE
  
  const messagesEndRef = useRef(null);
  const url=import.meta.env.BACKEND_URL;

  // Fetch user on component mount
  useEffect(() => {
    axios
      .get(url+'/api/user/profile', { withCredentials: true })
      .then((response) => {
        setUser(response.data);
        setLoadingUser(false);
        
        // GENERATE SESSION ID ONCE WHEN USER IS LOADED
        if (response.data && response.data.userId) {
          const newSessionId = `user_${response.data.userId}_${Date.now()}`;
          setSessionId(newSessionId);
          console.log('Generated session ID:', newSessionId);
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setLoadingUser(false);
        
        // GENERATE ANONYMOUS SESSION ID IF NO USER
        const anonSessionId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSessionId(anonSessionId);
        console.log('Generated anonymous session ID:', anonSessionId);
      });
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const formatMessage = (text) => {
    return text
      .split('\n')
      .map((line) => {
        if (line.startsWith('* ')) {
          const bulletText = line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          return `<li>${bulletText}</li>`;
        }
        return line
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>');
      })
      .join('<br />');
  };

  const sendMessage = async () => {
    if (!userInput.trim() || !sessionId) return; // ENSURE SESSION ID EXISTS

    const newMessage = { sender: 'user', text: userInput };
    setMessages((prev) => [...prev, newMessage]);
    const currentInput = userInput; // STORE CURRENT INPUT
    setUserInput('');
    setIsTyping(true);

    try {
      console.log('Sending request with sessionId:', sessionId); // DEBUG LOG
      
      const response = await axios.post(url+'/api/chat', {
        message: currentInput,
        userId: user?.userId || null,
        sessionId: sessionId // INCLUDE SESSION ID IN REQUEST
      });

      // UPDATE SESSION ID IF BACKEND PROVIDES A NEW ONE
      if (response.data.sessionId && response.data.sessionId !== sessionId) {
        console.log('Backend provided new sessionId:', response.data.sessionId);
        setSessionId(response.data.sessionId);
      }

      const botMessage = {
        sender: 'ai',
        text: formatMessage(response.data.response),
      };
      setMessages((prev) => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Chat error details:', error.response?.data || error);
      const errorMessage = {
        sender: 'ai',
        text: 'Error: Unable to get a response!',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    setShowScrollDown(scrollTop + clientHeight < scrollHeight);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleChat}
        className="fixed bottom-12 right-4 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 flex items-center space-x-2"
      >
        <Lottie animationData={Smile} loop={true} className="w-8" />
        <span className="text-lg font-semibold">Chat with me</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 shadow-lg flex flex-col bg-blue-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-100">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold">Namma Trip Companion</h2>
              {/* SHOW SESSION STATUS FOR DEBUGGING */}
              {sessionId && (
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Connected
                </span>
              )}
            </div>
            <button onClick={toggleChat} className="text-gray-600">
              X
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto max-h-80" onScroll={handleScroll}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`my-2 p-2 rounded ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white self-end'
                    : 'bg-white text-gray-800 self-start'
                }`}
              >
                <div dangerouslySetInnerHTML={{ __html: msg.text }} />
              </div>
            ))}
            {isTyping && (
              <div className="my-2 p-2 italic text-gray-500">Namma Trip Companion is typing...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {showScrollDown && (
            <button
              onClick={() => messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })}
              className="self-center p-2 transition duration-200 transform hover:scale-110"
            >
              <Lottie animationData={ArrowDown} loop={true} className="h-8 w-8" />
            </button>
          )}

          <div className="flex p-2 border-t">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={sessionId ? "Type your message..." : "Connecting..."}
              className="flex-1 p-2 border rounded"
              disabled={!sessionId} // DISABLE IF NO SESSION
            />
            <button
              onClick={sendMessage}
              className={`ml-2 ${
                userInput && sessionId ? 'bg-blue-500' : 'bg-gray-300 cursor-not-allowed'
              } text-white rounded p-2`}
              disabled={!userInput || !sessionId} // DISABLE IF NO SESSION
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripPlanner;
