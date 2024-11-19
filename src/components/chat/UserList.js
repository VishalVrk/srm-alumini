import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';

function UserList({ setReceiverId, currentUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsersWithUnreadCount = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, name');

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      // Filter out the current user
      const filteredUsers = data.filter((user) => user.id !== currentUser?.id);

      // Fetch unread message count for each user
      const usersWithUnreadCount = await Promise.all(
        filteredUsers.map(async (user) => {
          const { count, error: unreadError } = await supabase
            .from('messages')
            .select('id', { count: 'exact' })
            .eq('sender_id', user.id)
            .eq('receiver_id', currentUser.id)
            .eq('is_read', false);

          if (unreadError) {
            console.error(`Error fetching unread count for user ${user.id}:`, unreadError);
          }

          return {
            ...user,
            unread_count: count || 0, // Default to 0 if there's an error or no unread messages
          };
        })
      );

      setUsers(usersWithUnreadCount);
    };

    fetchUsersWithUnreadCount();
  }, [currentUser]);

  return (
    <div className="w-1/4 p-4 bg-gray-800 border-r border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Users</h3>
      <div className="space-y-2">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => setReceiverId(user.id)}
            className="w-full text-left p-2 rounded-lg bg-gray-700 hover:bg-gray-600 relative"
          >
            {user.name}
            {user.unread_count > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '12px',
                  transform: 'translateY(-50%)',
                  width: '8px',
                  height: '8px',
                  backgroundColor: 'red',
                  borderRadius: '50%',
                  maxHeight: 'calc(100vh - 150px)'
                }}
              ></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default UserList;
