import { useState } from "react";
import Image from "./Image";
import { Box, Typography, Button, Grid } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CollectionsIcon from '@mui/icons-material/Collections';
import { Place } from "./types";

interface PlaceGalleryProps {
  place: Place;
}

export default function PlaceGallery({ place }: PlaceGalleryProps) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  if (showAllPhotos) {
    return (
      <Box sx={{
        position: 'absolute',
        inset: 0,
        bgcolor: 'black',
        color: 'white',
        minHeight: '100vh',
        zIndex: 9999 // Ensure it's on top
      }}>
        <Box sx={{ bgcolor: 'black', p: 4, display: 'grid', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ mr: 6 }}>Photos of {place.title}</Typography>
            <Button
              onClick={() => setShowAllPhotos(false)}
              variant="contained"
              sx={{
                position: 'fixed',
                right: 48,
                top: 32,
                bgcolor: 'white',
                color: 'black',
                '&:hover': { bgcolor: 'grey.300' },
                borderRadius: 4,
                gap: 1
              }}
            >
              <CloseIcon />
              Close photos
            </Button>
          </Box>
          {place?.photos?.length > 0 &&
            place.photos.map((photo) => (
              <Box key={photo} sx={{ m: '0 auto', maxWidth: '100%' }}>
                <Image src={photo} alt="" sx={{ width: '100%', display: 'block' }} />
              </Box>
            ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Grid container spacing={1} sx={{ borderRadius: 6, overflow: 'hidden' }}>
        <Grid size={8}>
          {place.photos?.[0] && (
            <Box onClick={() => setShowAllPhotos(true)} sx={{ cursor: 'pointer', height: '100%' }}>
              <Image
                sx={{
                  aspectRatio: '1/1',
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%'
                }}
                src={place.photos[0]}
                alt=""
              />
            </Box>
          )}
        </Grid>
        <Grid size={4} container direction="column" spacing={1}>
          <Grid size={6}>
            {place.photos?.[1] && (
              <Image
                onClick={() => setShowAllPhotos(true)}
                sx={{
                  aspectRatio: '1/1',
                  cursor: 'pointer',
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%'
                }}
                src={place.photos[1]}
                alt=""
              />
            )}
          </Grid>
          <Grid size={6}>
            {place.photos?.[2] && (
              <Image
                onClick={() => setShowAllPhotos(true)}
                sx={{
                  aspectRatio: '1/1',
                  cursor: 'pointer',
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                }}
                src={place.photos[2]}
                alt=""
              />
            )}
          </Grid>
        </Grid>
      </Grid>
      <Button
        onClick={() => setShowAllPhotos(true)}
        variant="contained"
        startIcon={<CollectionsIcon />}
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          bgcolor: 'white',
          color: 'black',
          '&:hover': { bgcolor: 'grey.300' },
          borderRadius: 4,
          boxShadow: 3
        }}
      >
        Show more photos
      </Button>
    </Box>
  );
}
