import { useState } from "react";
import { Box, BoxProps, Typography } from "@mui/material";

interface ImageProps extends BoxProps {
  src?: string;
  alt?: string;
}

export default function Image({ src, ...rest }: ImageProps) {
  const [imageError, setImageError] = useState(false);

  if (!src) {
    return (
      <Box sx={{ bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center' }} {...rest}>
        <Typography color="text.secondary">No image</Typography>
      </Box>
    );
  }

  const imageSrc = src;

  if (imageError) {
    return (
      <Box sx={{ bgcolor: 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center' }} {...rest}>
        <Typography variant="body2" color="text.secondary">Image not found</Typography>
      </Box>
    );
  }

  return (
    <Box
      component="img"
      {...rest}
      src={imageSrc}
      alt=""
      onError={() => {
        console.warn(`Image failed to load: ${imageSrc}`);
        setImageError(true);
      }}
      sx={{
        ...(rest.sx), // Allow sx from props to override or merge if passed
        // Note: 'rest' might contain className if not filtered, but Box handles it.
      }}
    />
  );
}
