import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Image from "../Image";
import {
  Box,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import { Place } from "../types";

export default function IndexPage() {
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const getPlaces = async () => {
      try {
        const response = await fetch("/places", {
          method: "GET",
          headers: {
            ContentType: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(await response.json());
        }
        const data = await response.json();
        setPlaces(data);
      } catch (err) {
        console.log(err);
      }
    };
    getPlaces();
  }, []);

  return (
    <Box mt={4}>
      <Grid container spacing={3}>
        {places.length > 0 &&
          places.map((place) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={place._id}>
              <Card>
                <CardActionArea component={Link} to={`/place/${place._id}`}>
                  {place.photos?.[0] && (
                    <Box sx={{ position: "relative", paddingTop: "100%" }}>
                      <Image
                        src={place.photos[0]}
                        alt={place.title}
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  )}
                  <CardContent>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      noWrap
                    >
                      {place.address}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      noWrap
                      sx={{ mt: 0.5 }}
                    >
                      {place.title}
                    </Typography>
                    <Box mt={1}>
                      <Typography variant="body2">
                        <Box component="span" fontWeight="bold">
                          ${place.price}
                        </Box>{" "}
                        per night
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}
