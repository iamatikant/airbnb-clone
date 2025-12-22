import AccountNav from "./AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceImg from "../PlaceImg";
import { Link } from "react-router-dom";
import BookingDates from "../BookingDates";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get("/bookings").then((response) => {
      setBookings(response.data);
    });
  }, []);

  return (
    <Box>
      <AccountNav />
      <Box mt={2}>
        <Grid container spacing={2}>
          {bookings?.length > 0 &&
            bookings.map((booking) => (
              <Grid item xs={12} key={booking._id}>
                <Card>
                  <CardActionArea
                    component={Link}
                    to={`/account/bookings/${booking._id}`}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        p: 2,
                        alignItems: "stretch",
                      }}
                    >
                      <Box sx={{ width: 192, flexShrink: 0 }}>
                        <PlaceImg
                          className="h-full"
                          place={booking.place}
                        />
                      </Box>
                      <CardContent sx={{ p: 0, flexGrow: 1 }}>
                        <Typography variant="h6">
                          {booking.place.title}
                        </Typography>
                        <Box mt={1}>
                          <BookingDates
                            booking={booking}
                            className="mb-2 mt-4 text-gray-500"
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 1,
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            width={32}
                            height={32}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                            />
                          </svg>
                          <Typography variant="h6">
                            Total price: ${booking.price}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>
    </Box>
  );
}
