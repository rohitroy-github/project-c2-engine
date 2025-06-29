import { useState } from 'react';
import { createUser } from '../api';

export default function CreateUserForm() {
  const [username, setUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createUser(username);
    alert(`User ${username} created!`);
    setUsername('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <input
        className="border p-2 mr-2 font-montserrat"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer font-montserrat">Create New User</button>
    </form>
  );
}
