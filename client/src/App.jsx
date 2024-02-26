import "./App.css";

import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import AccountPage from "./pages/AccountPage";

export const baseUrl = "http://localhost:4000";

window.originalFetch = window.fetch;

window.fetch = async (url, options) => {
  const defaultOptions = { credentials: "include" };
  return window.originalFetch(`${baseUrl}${url}`, {
    ...defaultOptions,
    ...options,
  });
};

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

// user: booking
// MongoDBkey: DCcAqsnXmhLiesbe

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account/:subpage?" element={<AccountPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
