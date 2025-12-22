import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Stack
} from "@mui/material";
import { Place } from "./types";

interface BookingWidgetProps {
  place: Place;
}

export default function BookingWidget({ place }: BookingWidgetProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  async function bookThisPlace() {
    const response = await axios.post("/bookings", {
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      place: place._id,
      price: numberOfNights * place.price,
    });
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <Paper elevation={1} sx={{ p: 2, borderRadius: 4 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Price: ${place.price} / per night
      </Typography>
      <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 4, overflow: 'hidden', mt: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }}>
          <Box sx={{ p: 2, width: '100%' }}>
            <TextField
              label="Check in"
              type="date"
              fullWidth
              variant="standard"
              InputLabelProps={{ shrink: true }}
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </Box>
          <Box sx={{
            p: 2,
            width: '100%',
            borderLeft: { sm: 1 },
            borderTop: { xs: 1, sm: 0 },
            borderColor: 'divider'
          }}>
            <TextField
              label="Check out"
              type="date"
              fullWidth
              variant="standard"
              InputLabelProps={{ shrink: true }}
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </Box>
        </Stack>
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <TextField
            label="Number of guests"
            type="number"
            fullWidth
            variant="standard"
            value={numberOfGuests}
            onChange={(ev) => setNumberOfGuests(Number(ev.target.value))}
          />
        </Box>
        {numberOfNights > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Stack spacing={2}>
              <TextField
                label="Your full name"
                type="text"
                fullWidth
                variant="standard"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
              />
              <TextField
                label="Phone number"
                type="tel"
                fullWidth
                variant="standard"
                value={phone}
                onChange={(ev) => setPhone(ev.target.value)}
              />
            </Stack>
          </Box>
        )}
      </Box>
      <Button
        onClick={bookThisPlace}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2, borderRadius: 4 }}
      >
        Book this place
        {numberOfNights > 0 && <span>&nbsp;${numberOfNights * place.price}</span>}
      </Button>
    </Paper>
  );
}
