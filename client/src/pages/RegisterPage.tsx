import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function registerUser(event: FormEvent) {
    event.preventDefault();
    if (name === "" || email === "" || password === "") {
      alert("Please fill all the required fields");
      return;
    }
    try {
      const response = await fetch("/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(await response.json());
      }
      alert("User registered successfully");
    } catch (e) {
      alert("Some error occurred, make sure your email is unique");
    }
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
          Register
        </Typography>
        <Box component="form" onSubmit={registerUser}>
          <Stack spacing={2}>
            <TextField
              type="text"
              label="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              fullWidth
            />
            <TextField
              type="email"
              label="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="youremail@email.com"
              fullWidth
            />
            <TextField
              type="password"
              label="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="password"
              fullWidth
            />
            <Button type="submit" fullWidth>
              Register
            </Button>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
            >
              Already registered?{" "}
              <Link to="/login" style={{ color: "#000", textDecoration: "underline" }}>
                Login
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
