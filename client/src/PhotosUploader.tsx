import { useState, ChangeEvent, MouseEvent, Dispatch, SetStateAction } from "react";
import Image from "./Image";
import {
  Box,
  Button,
  TextField,
  IconButton,
  Grid
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface PhotosUploaderProps {
  addedPhotos: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
}

export default function PhotosUploader({ addedPhotos, onChange }: PhotosUploaderProps) {
  const [photoLink, setPhotoLink] = useState("");
  const addPhotoByLink = async (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    const response = await fetch("/upload-by-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        link: photoLink,
      }),
    });
    if (!response.ok) {
      return;
    }
    const fileName = await response.json();
    onChange((prev) => {
      return [...prev, fileName];
    });
    setPhotoLink("");
  };

  const uploadPhoto = async (ev: ChangeEvent<HTMLInputElement>) => {
    const files = ev.target.files;
    if (!files) return;
    const data = new FormData();
    for (let index = 0; index < files.length; index++) {
      data.append("photos", files[index]);
    }

    const response = await fetch("/upload", {
      method: "POST",
      body: data,
    });

    const fileNames = await response.json();
    onChange((prev) => {
      return [...prev, ...fileNames];
    });
  };

  function removePhoto(ev: MouseEvent<HTMLButtonElement>, filename: string) {
    ev.preventDefault();
    onChange([...addedPhotos.filter((photo) => photo !== filename)]);
  }
  function selectAsMainPhoto(ev: MouseEvent<HTMLButtonElement>, filename: string) {
    ev.preventDefault();
    onChange([filename, ...addedPhotos.filter((photo) => photo !== filename)]);
  }
  return (
    <>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          value={photoLink}
          onChange={(ev) => setPhotoLink(ev.target.value)}
          placeholder="Add using a link ....jpg"
          fullWidth
          size="small"
        />
        <Button
          onClick={addPhotoByLink}
          variant="contained"
          sx={{ whiteSpace: 'nowrap', borderRadius: 4, px: 4 }}
        >
          Add&nbsp;photo
        </Button>
      </Box>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {addedPhotos.length > 0 &&
          addedPhotos.map((link) => (
            <Grid size={{ xs: 4, md: 3, lg: 2 }} key={link}>
              <Box sx={{ height: 128, display: 'flex', position: 'relative' }}>
                <Image
                  className="rounded-2xl w-full object-cover"
                  src={link}
                  alt=""
                  sx={{ borderRadius: 4, width: '100%', objectFit: 'cover' }}
                />
                <IconButton
                  onClick={(ev) => removePhoto(ev, link)}
                  sx={{
                    position: 'absolute',
                    bottom: 4,
                    right: 4,
                    color: 'white',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                  }}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  onClick={(ev) => selectAsMainPhoto(ev, link)}
                  sx={{
                    position: 'absolute',
                    bottom: 4,
                    left: 4,
                    color: 'white',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                  }}
                  size="small"
                >
                  {link === addedPhotos[0] ? <StarIcon /> : <StarBorderIcon />}
                </IconButton>
              </Box>
            </Grid>
          ))}
        <Grid size={{ xs: 4, md: 3, lg: 2 }}>
          <Box
            component="label"
            sx={{
              height: 128,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 1,
              borderColor: 'grey.300',
              borderRadius: 4,
              p: 2,
              color: 'text.secondary',
              backgroundColor: 'transparent',
              gap: 1
            }}
          >
            <input
              type="file"
              multiple
              className="hidden" // we can leave this class or use sx={{ display: 'none' }}
              style={{ display: 'none' }}
              onChange={uploadPhoto}
            />
            <CloudUploadIcon sx={{ width: 32, height: 32 }} />
            <Box component="span">Upload</Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
