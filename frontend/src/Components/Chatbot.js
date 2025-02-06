import React, { useState } from 'react';
import './Chatbot.css'; // Import CSS for styling

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      // Simulate a response from the chatbot
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `Capithero: You said "${input}"`, sender: 'bot' },
        ]);
      }, 1000);
      setInput('');
    }
  };

  return (
    <div className={`chatbot ${isOpen ? 'open' : ''}`}>
      <div className="chatbot-header" onClick={toggleChatbot}>
        <h3>Capithero</h3>
      </div>
      {isOpen && (
        <div className="chatbot-body">
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={msg.sender}>
                {msg.text}
              </div>
            ))}
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
        </div>
      )}
    </div>
  );
};

export default Chatbot;

