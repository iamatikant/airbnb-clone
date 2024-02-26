import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("sujesh@gmail.com");
  const [password, setPassword] = useState("password");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const jsonResponse = await response.json();
      if (response.ok) {
        setUser(jsonResponse);
        alert("Login successful");
        setRedirect(true);
      } else throw new Error(jsonResponse);
    } catch (e) {
      alert(e);
    }

    //using axios

    // try {
    //   const { data } = await axios.post("/login", {
    //     email,
    //     password,
    //   });
    //   alert("login successful");
    //   setUser(data);
    //   setRedirect(true);
    // } catch (e) {
    //   alert("login failed");
    // }
  };

  if (redirect) {
    // setRedirect(false);
    return <Navigate to={"/"} />;
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
            {/* eslint-disable-next-line react/no-unescaped-entities*/}
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
