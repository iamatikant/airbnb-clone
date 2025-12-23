import React, { useEffect, useState } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import { Box, Paper, Typography, Button, Stack, CircularProgress } from '@mui/material';

export default function PaymentSuccess() {
    const { state } = useLocation();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [transaction, setTransaction] = useState(null);

    // state expected: { payment_id, order_id, signature, amount, transactionId }
    const paymentId = state?.payment_id;
    const orderId = state?.order_id;
    const signature = state?.signature;
    const amount = state?.amount;
    const transactionId = state?.transactionId || searchParams.get('transactionId');

    useEffect(() => {
        let mounted = true;
        const fetchTransaction = async () => {
            if (!transactionId) return;
            setLoading(true);
            try {
                const res = await fetch(`/transactions/${transactionId}`);
                if (!res.ok) throw new Error('Failed to fetch transaction');
                const data = await res.json();
                if (mounted) setTransaction(data);
            } catch (e) {
                console.error(e);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        // only fetch if we don't already have payment/order details in state
        if (!paymentId && transactionId) fetchTransaction();
        return () => { mounted = false };
    }, [transactionId]);

    const shownPaymentId = paymentId || transaction?.payment_id;
    const shownOrderId = orderId || transaction?.order_id;
    const shownSignature = signature || transaction?.signature;
    const shownAmount = amount || transaction?.amount;

    return (
        <Box sx={{ maxWidth: 680, margin: '32px auto', px: 2 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Stack spacing={2}>
                    <Typography variant="h5">Payment Successful</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Your payment was completed successfully.
                    </Typography>

                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <>
                            {shownAmount && (
                                <Typography>
                                    <strong>Amount:</strong> {Number(shownAmount) / 100} INR
                                </Typography>
                            )}

                            {shownPaymentId && (
                                <Typography>
                                    <strong>Payment ID:</strong> {shownPaymentId}
                                </Typography>
                            )}
                            {shownOrderId && (
                                <Typography>
                                    <strong>Order ID:</strong> {shownOrderId}
                                </Typography>
                            )}
                            {shownSignature && (
                                <Typography>
                                    <strong>Signature:</strong> {shownSignature}
                                </Typography>
                            )}
                        </>
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
