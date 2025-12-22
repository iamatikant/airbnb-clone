/* eslint-disable react/prop-types */
import { useState } from "react";

export default function Image({ src, ...rest }) {
  const [imageError, setImageError] = useState(false);
  
  if (!src) {
    return (
      <div className="bg-gray-200 flex items-center justify-center" {...rest}>
        <span className="text-gray-400">No image</span>
      </div>
    );
  }

  const imageSrc =
    src && src.includes("https://")
      ? src
      : "http://localhost:4000/uploads/" + src;

  if (imageError) {
    return (
      <div className="bg-gray-200 flex items-center justify-center" {...rest}>
        <span className="text-gray-400 text-sm">Image not found</span>
      </div>
    );
  }

  return (
    <img
      {...rest}
      src={imageSrc}
      alt=""
      onError={() => {
        console.warn(`Image failed to load: ${imageSrc}`);
        setImageError(true);
      }}
    />
  );
}
