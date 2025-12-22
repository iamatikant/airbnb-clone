import { Link } from "@mui/material"; // Import Link from @mui/material
import LocationOnIcon from '@mui/icons-material/LocationOn'; // Import LocationOn icon
import { ReactNode } from "react";

interface AddressLinkProps {
  children: ReactNode;
  className?: string; // Change to optional string (undefined)
}

export default function AddressLink({ children, className }: AddressLinkProps) {
  // Define styles using sx prop


  // We need to handle the incoming className if it's meant to override or append.
  // Tailwind logic: className = "my-3 block".
  // The original code appended strings.
  // We will prioritize the传入 className if it exists, otherwise defaults.
  // But wait, the original logic: "if (!className) className = 'my-3 block'; className += ' flex ...'"
  // So it ALWAYS adds flex gap font-semibold etc.

  return (
    <Link
      className={className} // Keep className for any residual global styles or if user passed one
      target="_blank"
      href={"https://maps.google.com/?q=" + children}
      underline="always" // already underline in original
      color="inherit" // Default to inherit color to match surrounding text or theme
      sx={{
        display: 'flex',
        gap: 0.5,
        fontWeight: 600,
        ...(!className && { my: 1.5, display: 'flex' }), // my-3 is 0.75rem ~ 12px. 1.5 * 8 = 12px.
        // If className IS provided, the original code DID NOT add my-3 block.
        // It ONLY added "flex gap-1 font-semibold underline".
      }}
    >
      <LocationOnIcon fontSize="small" sx={{ width: 24, height: 24 }} />
      {children}
    </Link>
  );
}
