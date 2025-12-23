import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Box, Container } from "@mui/material";

export default function Layout() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      bgcolor="background.default"
    >
      <Header />
      <Container
        maxWidth="lg"
        sx={{
          flex: 1,
          py: 3,
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}