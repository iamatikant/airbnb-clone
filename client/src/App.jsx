import "./App.css";

import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";

export const baseUrl = "http://127.0.0.1:4000";

window.originalFetch = window.fetch;

window.fetch = async (url, options) => {
  const defaultOptions = {credentials: 'include'};
  return window.originalFetch(`${baseUrl}${url}`, {...defaultOptions, ...options});
};


// user: booking
// MongoDBkey: DCcAqsnXmhLiesbe

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
}

export default App;
