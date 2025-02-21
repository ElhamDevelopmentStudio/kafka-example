// frontend/src/App.tsx
import React, { useEffect, useState } from 'react';

const App: React.FC = () => {
  // Local state for the message input, status, and list of consumed messages.
  const [message, setMessage] = useState('');
  const [producingStatus, setProducingStatus] = useState<string | null>(null);
  const [consumedMessages, setConsumedMessages] = useState<string[]>([]);

  // Function to call the backend and produce a message to Kafka.
  const produceMessage = async () => {
    try {
      setProducingStatus('Sending...');
      const response = await fetch('http://localhost:3000/kafka/produce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      setProducingStatus(data.status);
      setMessage('');
      // Refresh the consumed messages list
      fetchConsumedMessages();
    } catch (error) {
      console.error('Error producing message:', error);
      setProducingStatus('Error sending message');
    }
  };

  // Function to fetch the list of consumed messages from the backend.
  const fetchConsumedMessages = async () => {
    try {
      const response = await fetch('http://localhost:3000/kafka/messages');
      const data = await response.json();
      setConsumedMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Poll for new messages every 5 seconds.
  useEffect(() => {
    const interval = setInterval(fetchConsumedMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Kafka with NestJS & React (Intermediate Example)</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={message}
          placeholder="Enter message"
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: '300px', marginRight: '10px' }}
        />
        <button onClick={produceMessage}>Produce Message</button>
      </div>
      {producingStatus && <p>Status: {producingStatus}</p>}
      <div>
        <h2>Consumed Messages (from Kafka):</h2>
        {consumedMessages.length === 0 ? (
          <p>No messages consumed yet.</p>
        ) : (
          <ul>
            {consumedMessages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;
