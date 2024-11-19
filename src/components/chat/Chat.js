import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';
import UserList from './UserList';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiverId, setReceiverId] = useState(null);
  const [user, setUser] = useState(null);
  const [isChatEmpty, setIsChatEmpty] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  const fetchMessages = async () => {
    if (!user?.id || !receiverId) return;

    try {
      const { data: sentMessages, error: sentError } = await supabase
        .from('messages')
        .select('*')
        .eq('sender_id', user.id)
        .eq('receiver_id', receiverId)
        .order('created_at', { ascending: true });

      if (sentError) throw sentError;

      const { data: receivedMessages, error: receivedError } = await supabase
        .from('messages')
        .select('*')
        .eq('sender_id', receiverId)
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: true });

      if (receivedError) throw receivedError;

      const allMessages = [...sentMessages, ...receivedMessages].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );

      setMessages(allMessages);
      setIsChatEmpty(allMessages.length === 0);

      // Mark received messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', receiverId)
        .eq('receiver_id', user.id)
        .eq('is_read', false); // Only update unread messages
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user?.id, receiverId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !user || !user.id || !receiverId) return;

    const { error } = await supabase
      .from('messages')
      .insert([
        {
          sender_id: user.id,
          receiver_id: receiverId,
          content: newMessage,
          is_read: false // Ensure new messages are unread by default
        },
      ]);

    if (error) {
      console.error('Error sending message:', error);
      return;
    }

    setNewMessage('');
    fetchMessages(); // Refresh messages after sending a new one
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#1a202c', color: 'white' }}>
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <UserList setReceiverId={setReceiverId} currentUser={user} />
        {receiverId ? (
          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <div
              style={{
                flexGrow: 1,
                padding: '16px',
                overflowY: 'auto',
                backgroundColor: '#2d3748',
                borderRadius: '8px',
                maxHeight: 'calc(100vh - 150px)', // Adjust based on your layout
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>Chat</h3>
              <div style={{ gap: '8px' }}>
                {isChatEmpty ? (
                  <p style={{ color: '#718096', textAlign: 'center' }}>No messages yet. Start the conversation!</p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        justifyContent: msg.sender_id === user.id ? 'flex-end' : 'flex-start',
                        marginBottom: '8px',
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: msg.sender_id === user.id ? '#3182ce' : '#4a5568',
                          color: 'white',
                          padding: '8px',
                          borderRadius: '8px',
                          maxWidth: '60%',
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div
              style={{
                marginTop: '4px',
                padding: '16px',
                backgroundColor: '#1a202c',
                borderTop: '1px solid #4a5568',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
                style={{
                  flexGrow: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  backgroundColor: '#4a5568',
                  color: 'white',
                  marginRight: '16px',
                  border: 'none',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleSendMessage}
                style={{
                  backgroundColor: '#3182ce',
                  color: 'white',
                  fontWeight: '600',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1, color: '#718096' }}>
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
  

export default Chat;
