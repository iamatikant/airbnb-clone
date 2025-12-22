import { useContext, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import { PlacesPage } from "./PlacesPage";
import AccountNav from "./AccountNav";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

export default function ProfilePage() {
  const { user, ready, setUser } = useContext(UserContext);
  const [redirect, setRedirect] = useState<string | null>(null);

  const params = useParams<{ subpage: string }>();
  let subpage = params?.subpage;

  if (subpage === undefined) {
    subpage = "profile";
  }

  if (!ready) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "40vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
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
    setUser(null);
  };

  return (
    <Box>
      <AccountNav />
      {subpage === "profile" && user && (
        <Box
          sx={{
            maxWidth: 480,
            mx: "auto",
            mt: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="body1" gutterBottom>
            Logged in as <strong>{user.name}</strong> ({user.email})
          </Typography>
          <Button
            onClick={logout}
            sx={{ mt: 2, maxWidth: 240, width: "100%" }}
          >
            Logout
          </Button>
        </Box>
      )}
      {subpage === "places" && <PlacesPage />}
    </Box>
  );
}
