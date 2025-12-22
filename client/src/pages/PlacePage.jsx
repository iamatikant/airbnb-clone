import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";
import BookingWidget from "../BookingWidget";
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Divider,
} from "@mui/material";

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);

  useEffect(() => {
    if (!id) return;
    axios.get(`/places/${id}`).then((response) => {
      setPlace(response.data);
    });
  }, [id]);

  if (!place) return "";

  return (
    <Box sx={{ mt: 4, bgcolor: "grey.100", mx: -2, px: 2, pt: 2 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          {place.title}
        </Typography>

        <Box mb={2}>
          <AddressLink>{place.address}</AddressLink>
        </Box>

        <Box mb={4}>
          <PlaceGallery place={place} />
        </Box>

        <Grid container spacing={4} mb={4}>
          <Grid item xs={12} md={8}>
            <Box mb={2}>
              <Typography variant="h5" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1">{place.description}</Typography>
            </Box>
            <Typography variant="body2">
              Check-in: {place.checkIn}
              <br />
              Check-out: {place.checkOut}
              <br />
              Max number of guests: {place.maxGuests}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <BookingWidget place={place} />
          </Grid>
        </Grid>

        <Paper sx={{ mx: -2, px: 2, py: 3 }} variant="outlined">
          <Typography variant="h5" gutterBottom>
            Extra info
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            {place.extraInfo}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
