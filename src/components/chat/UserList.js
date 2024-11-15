import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';

function UserList({ setReceiverId, currentUser }) {
  const [users, setUsers] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('profiles').select('id, username');
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        // Filter out the current user
        const filteredUsers = data.filter((user) => user.id !== currentUser?.id);
        setUsers(filteredUsers);
      }
    };

    const fetchUnreadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('sender_id, is_read')
        .eq('receiver_id', currentUser.id)
        .eq('is_read', false);

      if (error) {
        console.error('Error fetching unread messages:', error);
      } else {
        // Group unread messages by sender
        const unreadCounts = data.reduce((acc, message) => {
          acc[message.sender_id] = (acc[message.sender_id] || 0) + 1;
          return acc;
        }, {});
        setUnreadMessages(unreadCounts);
      }
    };

    fetchUsers();
    fetchUnreadMessages();
  }, [currentUser]);

  return (
    <div className="w-1/4 p-4 bg-gray-800 border-r border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Users</h3>
      <div className="space-y-2">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => setReceiverId(user.id)}
            className="w-full text-left p-2 rounded-lg bg-gray-700 hover:bg-gray-600 flex justify-between items-center"
          >
            {user.username}
            {unreadMessages[user.id] && (
              <span className="w-2 h-2 bg-red-500 rounded-full ml-2"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default UserList;
