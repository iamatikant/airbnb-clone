import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { PlacesPage } from "./PlacesPage";
import AccountNav from "./AccountNav";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../react-redux/actionCreators";

export default function ProfilePage() {
  const { user, ready } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [redirect, setRedirect] = useState(null);

  let params = useParams();
  console.log("params: ", params);
  let subpage = params?.subpage;

  if (subpage === undefined) {
    subpage = "profile";
  }

  if (!ready) {
    return "Loading...";
  }

  if (ready && !user && !redirect) {
    return <Navigate to="/login" />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  const logout = async () => {
    await fetch("/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    setRedirect("/");
    dispatch(updateUser({ user: null }));
  };

  return (
    <div>
      <AccountNav />
      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email}) <br />
          <button className="primary max-w-sm mt-2" onClick={logout}>
            Logout
          </button>
        </div>
      )}
      {subpage === "places" && <PlacesPage />}
    </div>
  );
}
