

import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
// this is s mock commit
import { UserContextProvider } from "./UserContext";
import ProfilePage from "./pages/ProfilePage";
import { PlacesPage } from "./pages/PlacesPage";
import PlacesFormPage from "./pages/PlacesFormPage";
import PlacePage from "./pages/PlacePage";
import BookingsPage from "./pages/BookingsPage";
import BookingPage from "./pages/BookingPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFail from "./pages/PaymentFail";
import TransactionsPage from "./pages/TransactionsPage";
import TransactionDetails from "./pages/TransactionDetails";

export const baseUrl = "http://localhost:4000";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).originalFetch = window.fetch;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.fetch = async (url: RequestInfo | URL, options?: RequestInit) => {
  const defaultOptions = {
    credentials: "include" as const,
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).originalFetch(`${baseUrl}${url}`, {
    ...defaultOptions,
    ...options,
  });
};

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

// user: booking
// MongoDBpassword: abhishek

function App() {
  return (
    <UserContextProvider>
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
          <Route path="/pay" element={<PaymentPage />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failure" element={<PaymentFail />} />
          <Route path="/account/transactions" element={<TransactionsPage />} />
          <Route path="/account/transactions/:id" element={<TransactionDetails />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
