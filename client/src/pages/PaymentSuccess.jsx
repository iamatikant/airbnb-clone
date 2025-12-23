import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Box, Paper, Typography, Button, Stack } from '@mui/material';

export default function PaymentSuccess() {
    const { state } = useLocation();
    // state expected: { payment_id, order_id, signature, amount }
    const paymentId = state?.payment_id;
    const orderId = state?.order_id;
    const signature = state?.signature;
    const amount = state?.amount;

    return (
        <Box sx={{ maxWidth: 680, margin: '32px auto', px: 2 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Stack spacing={2}>
                    <Typography variant="h5">Payment Successful</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Your payment was completed successfully.
                    </Typography>

                    {amount && (
                        <Typography>
                            <strong>Amount:</strong> {Number(amount) / 100} INR
                        </Typography>
                    )}

                    {paymentId && (
                        <Typography>
                            <strong>Payment ID:</strong> {paymentId}
                        </Typography>
                    )}
                    {orderId && (
                        <Typography>
                            <strong>Order ID:</strong> {orderId}
                        </Typography>
                    )}
                    {signature && (
                        <Typography>
                            <strong>Signature:</strong> {signature}
                        </Typography>
                    )}

                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button variant="contained" component={Link} to="/">Return home</Button>
                        <Button variant="outlined" component={Link} to="/account/bookings">View bookings</Button>
                        {transactionId && (
                            <Button variant="text" component={Link} to={`/account/transactions/${transactionId}`}>View transaction</Button>
                        )}
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
}
