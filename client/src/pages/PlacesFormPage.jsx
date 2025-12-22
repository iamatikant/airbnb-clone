import { useEffect, useState } from "react";
import PhotosUploader from "../PhotosUploader";
import Perks from "../Perks";
import AccountNav from "./AccountNav";
import { Navigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
} from "@mui/material";

export default function PlacesFormPage() {
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);

  const params = useParams();
  const id = params.id;

  useEffect(() => {
    const getPlace = async () => {
      const response = await fetch("/places/" + id, {
        method: "GET",
      });
      if (!response.ok) {
        console.log(response);
      }
      const data = await response.json();
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    };
    if (id) {
      getPlace();
    }
  }, [id]);

  function inputHeader(text) {
    return (
      <Typography variant="h6" sx={{ mt: 3 }}>
        {text}
      </Typography>
    );
  }
  function inputDescription(text) {
    return (
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    );
  }
  function preInput(header, description) {
    return (
      <Box mt={2}>
        {inputHeader(header)}
        {inputDescription(description)}
      </Box>
    );
  }

  async function savePlace(ev) {
    ev.preventDefault();
    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };

    if (id) {
      try {
        const response = await fetch("/places", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, ...placeData }),
        });
        if (!response.ok) {
          throw new Error(await response.json());
        }
        setRedirect(true);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const response = await fetch("/places", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(placeData),
        });
        if (!response.ok) {
          throw new Error(await response.json());
        }
      } catch (e) {
        console.log(e);
      }
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to="/account/places" />;
  }

  return (
    <Box>
      <AccountNav />
      <Paper sx={{ p: 3, mt: 2 }}>
        <Box component="form" onSubmit={savePlace}>
          {preInput(
            "Title",
            "Title for your place. should be short and catchy as in advertisement"
          )}
          <TextField
            fullWidth
            margin="normal"
            label="Title"
            type="text"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
            placeholder="My lovely apt"
          />

          {preInput("Address", "Address to this place")}
          <TextField
            fullWidth
            margin="normal"
            label="Address"
            type="text"
            value={address}
            onChange={(ev) => setAddress(ev.target.value)}
            placeholder="Address"
          />

          {preInput("Photos", "more = better")}
          <Box mt={1}>
            <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
          </Box>

          {preInput("Description", "Description of the place")}
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            multiline
            minRows={3}
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
          />

          {preInput("Perks", "Select all the perks of your place")}
          <Box mt={1}>
            <Perks selected={perks} onChange={setPerks} />
          </Box>

          {preInput("Extra info", "House rules, etc")}
          <TextField
            fullWidth
            margin="normal"
            label="Extra info"
            multiline
            minRows={3}
            value={extraInfo}
            onChange={(ev) => setExtraInfo(ev.target.value)}
          />

          {preInput(
            "Check in & out times",
            "Add check in and out times, remember to have some time window for cleaning the room between guests"
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                margin="dense"
                label="Check in time"
                type="text"
                value={checkIn}
                onChange={(ev) => setCheckIn(ev.target.value)}
                placeholder="14"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                margin="dense"
                label="Check out time"
                type="text"
                value={checkOut}
                onChange={(ev) => setCheckOut(ev.target.value)}
                placeholder="11"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                margin="dense"
                label="Max number of guests"
                type="number"
                value={maxGuests}
                onChange={(ev) => setMaxGuests(ev.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                margin="dense"
                label="Price per night"
                type="number"
                value={price}
                onChange={(ev) => setPrice(ev.target.value)}
              />
            </Grid>
          </Grid>

          <Button type="submit" sx={{ mt: 3 }}>
            Save
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
