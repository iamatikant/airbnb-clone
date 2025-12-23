import { Link } from "react-router-dom";
import AccountNav from "./AccountNav";
import { useEffect, useState } from "react";
import PlaceImg from "../PlaceImg";
import {
  Box,
  Button,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Grid,
} from "@mui/material";

export const PlacesPage = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      const response = await fetch("/user-places", {
        method: "GET",
      });
      if (!response.ok) {
        console.log(await response.json());
      }

      if (response.ok) {
        const fetchedPlaces = await response.json();
        setPlaces(fetchedPlaces);
      }
    };
    fetchPlaces();
  }, []);

  return (
    <Box>
      <AccountNav />
      <Box textAlign="center" mt={2} mb={2}>
        <Button
          component={Link}
          to="/account/places/new"
          startIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              width={24}
              height={24}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          }
        >
          Add new place
        </Button>
      </Box>

      <Box mt={3}>
        <Grid container spacing={2}>
          {places.length > 0 &&
            places.map((place) => (
              <Grid item xs={12} key={place._id}>
                <Card>
                  <CardActionArea component={Link} to={`/account/places/${place._id}`}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        p: 2,
                        alignItems: "stretch",
                      }}
                    >
                      <Box
                        sx={{
                          width: 128,
                          height: 128,
                          bgcolor: "grey.300",
                          flexShrink: 0,
                          borderRadius: 2,
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <PlaceImg place={place} />
                      </Box>
                      <CardContent sx={{ p: 0, flexGrow: 1 }}>
                        <Typography variant="h6">{place.title}</Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          {place.description}
                        </Typography>
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
};
