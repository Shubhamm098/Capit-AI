import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css'; // Import CSS for styling

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 300, height: 400 });
  const [isResizing, setIsResizing] = useState(false);
  const chatbotRef = useRef(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setIsLoading(true);
      
      try {
        const response = await fetch('http://localhost:5000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input }),
        });
        
        const data = await response.json();
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.response, sender: 'bot' },
        ]);
      } catch (error) {
        console.error('Error:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Sorry, there was an error processing your request.', sender: 'bot' },
        ]);
      }
      
      setIsLoading(false);
      setInput('');
    }
  };

  const startResize = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleResize = (e) => {
      if (isResizing && chatbotRef.current) {
        // Get the right edge position of the chatbot
        const chatbotRect = chatbotRef.current.getBoundingClientRect();
        const rightEdge = chatbotRect.right;
        
        // Calculate width based on the distance from the mouse to the right edge
        // This allows resizing from the left corner while maintaining the right edge position
        const width = Math.max(300, rightEdge - e.clientX);
        const height = Math.max(400, e.clientY - chatbotRect.top);
        
        setDimensions({ width, height });
      }
    };

    const stopResize = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', stopResize);
    }

    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', stopResize);
    };
  }, [isResizing]);

  return (
    <div 
      ref={chatbotRef}
      className={`chatbot ${isOpen ? 'open' : ''}`} 
      style={{ 
        width: `${dimensions.width}px`,
        height: isOpen ? `${dimensions.height}px` : 'auto',
        maxHeight: isOpen ? `${dimensions.height}px` : '60px' // Limit header height when closed
      }}
    >
      <div className="chatbot-header" onClick={toggleChatbot}>
        <h3>Capithero</h3>
      </div>
      {isOpen && (
        <div className="chatbot-body" style={{ 
          height: `${dimensions.height - 50}px`, 
          maxHeight: `${dimensions.height - 50}px` 
        }}>
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={msg.sender}>
                {msg.text}
              </div>
            ))}
            {isLoading && <div className="bot">Thinking...</div>}
          </div>
          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
          <div className="resize-handle" onMouseDown={startResize}></div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;

