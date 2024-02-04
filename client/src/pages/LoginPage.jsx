import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState("sujesh@gmail.com");
  const [password, setPassword] = useState("password");
  const [redirect, setRedirect] = useState(false);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    // try {
    //   const response = await fetch('/login', {
    //     method: 'POST',
    //     body: JSON.stringify({ email, password }),
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   })
    //   alert('Login successful', await response.json());
    //   setRedirect(true);
    // } catch(e) {
    //   alert('Login failed', e);
    // }
    try {
      await axios.post('http://localhost:4000/login', {email, password});
      alert('login successful');
      setRedirect(true);
    } catch(e) {
      alert('login failed');
    }
  }

  if(redirect) {
    // setRedirect(false);
    return <Navigate to={'/'} />
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
          <input
            type="email"
            placeholder="youremail@email.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <button className="primary">Login</button>
          <div className="text-gray-300 py-4 text-center">
            Don't have an account yet?{" "}
            <Link to="/register" className="underline text-black">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
