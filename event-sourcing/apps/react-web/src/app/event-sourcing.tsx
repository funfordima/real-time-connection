import './event-sourcing.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface IMessageItem {
  message: string;
  id: number;
}

const EventSourcing = () => {
  const [messages, setMessages] = useState<IMessageItem[]>([]);
  const [value, setValue] = useState('');

  useEffect(() => {
    subscribe();
  }, []);

  const subscribe = () => {
      const eventSource = new EventSource('http://localhost:3333/api/connect');

      eventSource.onmessage = (event) => {
        const message = JSON.parse(event.data);

        setMessages((prev) => [message, ...prev]);
      };
  };

  const sendMessage = async () => {
    await axios.post('http://localhost:3333/api/new-messages', {
      message: value,
      id: Date.now(),
    });
  };

  return (
    <div className="center">
      <div>
        <div className="form">
          <input type="text" value={value} onChange={event => setValue(event.target.value)}/>
          <button onClick={sendMessage}>Send message!</button>
        </div>

        <div className="messages">
          { messages.map((item) =>
            <div className="message" key="{ item.id }">
              { item.message }
            </div>
          ) }
        </div>
      </div>
    </div>
  );
};

export default EventSourcing;
