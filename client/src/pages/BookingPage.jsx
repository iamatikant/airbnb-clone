import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";
import { Box, Typography, Paper } from "@mui/material";

export default function BookingPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (id) {
      axios.get("/bookings").then((response) => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  if (!booking) {
    return "";
  }

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        {booking.place.title}
      </Typography>
      <Box my={1}>
        <AddressLink>{booking.place.address}</AddressLink>
      </Box>
      <Paper
        sx={{
          p: 3,
          my: 3,
          borderRadius: 3,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
        }}
        elevation={0}
        variant="outlined"
      >
        <Box>
          <Typography variant="h5" gutterBottom>
            Your booking information:
          </Typography>
          <BookingDates booking={booking} />
        </Box>
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "common.white",
            p: 3,
            borderRadius: 3,
            minWidth: 220,
          }}
        >
          <Typography variant="body2">Total price</Typography>
          <Typography variant="h4" fontWeight="bold">
            ${booking.price}
          </Typography>
        </Box>
      </Paper>
      <PlaceGallery place={booking.place} />
    </Box>
  );
}
