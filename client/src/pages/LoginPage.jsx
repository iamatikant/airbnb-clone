import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";

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
  };

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <Box
      sx={{
        mt: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleLoginSubmit}>
          <Stack spacing={2}>
            <TextField
              type="email"
              label="Email"
              placeholder="youremail@email.com"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              fullWidth
            />
            <TextField
              type="password"
              label="Password"
              placeholder="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              fullWidth
            />
            <Button type="submit" fullWidth>
              Login
            </Button>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
            >
              {/* eslint-disable-next-line react/no-unescaped-entities*/}
              Don't have an account yet?{" "}
              <Link to="/register" style={{ color: "#000", textDecoration: "underline" }}>
                Register
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
