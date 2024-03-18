import "./App.css";

import { Route, Routes } from "react-router-dom";
// import Provide
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import ProfilePage from "./pages/ProfilePage";
import { PlacesPage } from "./pages/PlacesPage";
import PlacesFormPage from "./pages/PlacesFormPage";
import PlacePage from "./pages/PlacePage";
import BookingsPage from "./pages/BookingsPage";
import BookingPage from "./pages/BookingPage";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { updateUser } from "./react-redux/actionCreators";

export const baseUrl = "http://localhost:4000";

window.originalFetch = window.fetch;

window.fetch = async (url, options) => {
  const defaultOptions = {
    credentials: "include",
  };
  return window.originalFetch(`${baseUrl}${url}`, {
    ...defaultOptions,
    ...options,
  });
};

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      axios.get("/profile").then(({ data }) => {
        if (Object.keys(data).length > 0) {
          dispatch(updateUser({ user: data }));
        }
        dispatch(updateUser({ ready: true }));
      });
    }
  }, [user]);

  console.log("user reducer value: ", user);
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account" element={<ProfilePage />} />
        <Route path="/account/places" element={<PlacesPage />} />
        <Route path="/account/places/new" element={<PlacesFormPage />} />
        <Route path="/account/places/:id" element={<PlacesFormPage />} />
        <Route path="/place/:id" element={<PlacePage />} />
        <Route path="/account/bookings" element={<BookingsPage />} />
        <Route path="/account/bookings/:id" element={<BookingPage />} />
      </Route>
    </Routes>
  );
}

export default App;
