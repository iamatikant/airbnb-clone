import { differenceInCalendarDays, format } from "date-fns";
import { Box, Stack } from "@mui/material";
import NightlightIcon from '@mui/icons-material/Nightlight';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Booking } from "./types";

interface BookingDatesProps {
  booking: Booking;
  className?: string;
}

export default function BookingDates({ booking, className }: BookingDatesProps) {
  return (
    <Box className={className} sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
      <NightlightIcon sx={{ width: 24, height: 24 }} />
      {differenceInCalendarDays(
        new Date(booking.checkOut),
        new Date(booking.checkIn)
      )}{" "}
      nights:
      <Stack direction="row" gap={0.5} alignItems="center" ml={1}>
        <CalendarTodayIcon sx={{ width: 20, height: 20 }} />
        {format(new Date(booking.checkIn), "yyyy-MM-dd")}
      </Stack>
      <ArrowForwardIcon fontSize="small" />
      <Stack direction="row" gap={0.5} alignItems="center">
        <CalendarTodayIcon sx={{ width: 20, height: 20 }} />
        {format(new Date(booking.checkOut), "yyyy-MM-dd")}
      </Stack>
    </Box>
  );
}
