import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Box, Paper, Typography, Button, Stack } from '@mui/material';

export default function PaymentFail() {
    const { state } = useLocation();
    const error = state?.error || 'Payment failed or was cancelled.';

    return (
        <Box sx={{ maxWidth: 680, margin: '32px auto', px: 2 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Stack spacing={2}>
                    <Typography variant="h5">Payment Failed</Typography>
                    <Typography variant="body1" color="text.secondary">
                        {error}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button variant="contained" component={Link} to="/pay">Try again</Button>
                        <Button variant="outlined" component={Link} to="/">Return home</Button>
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
}
