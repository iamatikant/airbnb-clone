import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Paper,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Header() {
  const { user } = useContext(UserContext);

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Brand / Logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
            gap: 1,
          }}
        >
          <Box
            component="span"
            sx={{
              width: 32,
              height: 32,
              transform: "rotate(-90deg)",
              display: "inline-flex",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </Box>
          <Typography variant="h6" fontWeight="bold">
            airbnb
          </Typography>
        </Box>

        {/* Search bar */}
        <Paper
          elevation={2}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            px: 2,
            py: 1,
            borderRadius: 999,
          }}
        >
          <Typography variant="body2">Anywhere</Typography>
          <Box
            sx={{
              width: 1,
              height: 24,
              borderLeft: "1px solid",
              borderColor: "divider",
            }}
          />
          <Typography variant="body2">Any week</Typography>
          <Box
            sx={{
              width: 1,
              height: 24,
              borderLeft: "1px solid",
              borderColor: "divider",
            }}
          />
          <Typography variant="body2">Add guests</Typography>
          <IconButton
            size="small"
            sx={{
              bgcolor: "primary.main",
              color: "common.white",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            <SearchIcon fontSize="small" />
          </IconButton>
        </Paper>

        {/* User menu */}
        <Button
          component={Link}
          to={user ? "/account" : "/login"}
          variant="outlined"
          sx={{
            borderRadius: 999,
            px: 2,
            py: 0.5,
            textTransform: "none",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <MenuIcon fontSize="small" />
          <AccountCircleIcon />
          {!!user && (
            <Typography variant="body2" noWrap>
              {user.name}
            </Typography>
          )}
        </Button>
      </Toolbar>
    </AppBar>
  );
}
