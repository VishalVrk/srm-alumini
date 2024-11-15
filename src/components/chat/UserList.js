import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';

function UserList({ setReceiverId, currentUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('profiles').select('id, email');
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        // Filter out the current user
        const filteredUsers = data.filter((user) => user.id !== currentUser?.id);
        setUsers(filteredUsers);
      }
    };

    fetchUsers();
  }, [currentUser]);

  return (
    <div className="w-1/4 p-4 bg-gray-800 border-r border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Users</h3>
      <div className="space-y-2">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => setReceiverId(user.id)}
            className="w-full text-left p-2 rounded-lg bg-gray-700 hover:bg-gray-600"
          >
            {user.email}
          </button>
        ))}
      </div>
    </div>
  );
}

export default UserList;
