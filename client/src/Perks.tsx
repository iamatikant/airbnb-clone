import { Checkbox, Box, Typography } from "@mui/material";
import WifiIcon from '@mui/icons-material/Wifi';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TvIcon from '@mui/icons-material/Tv';
import RadioIcon from '@mui/icons-material/Radio';
import PetsIcon from '@mui/icons-material/Pets';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import { ChangeEvent } from "react";

interface PerksProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function Perks({ selected, onChange }: PerksProps) {
  function handleCbClick(ev: ChangeEvent<HTMLInputElement>) {
    const { checked, name } = ev.target;
    if (checked) {
      onChange([...selected, name]);
    } else {
      onChange([...selected.filter((selectedName) => selectedName !== name)]);
    }
  }

  const perksList = [
    { name: 'wifi', label: 'Wifi', icon: <WifiIcon /> },
    { name: 'parking', label: 'Free parking spot', icon: <DirectionsCarIcon /> },
    { name: 'tv', label: 'TV', icon: <TvIcon /> },
    { name: 'radio', label: 'Radio', icon: <RadioIcon /> },
    { name: 'pets', label: 'Pets', icon: <PetsIcon /> },
    { name: 'entrance', label: 'Private entrance', icon: <MeetingRoomIcon /> },
  ];

  return (
    <>
      {perksList.map((perk) => (
        <Box
          key={perk.name}
          component="label"
          sx={{
            border: 1,
            borderColor: 'divider',
            p: 2,
            borderRadius: 4,
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'grid-template-columns 0.1s',
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <Checkbox
            checked={selected.includes(perk.name)}
            name={perk.name}
            onChange={handleCbClick}
          />
          {perk.icon}
          <Typography>{perk.label}</Typography>
        </Box>
      ))}
    </>
  );
}
