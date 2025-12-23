import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Stack,
    CircularProgress,
} from '@mui/material';

export default function PaymentPage() {
    const [amount, setAmount] = useState(9.99);
    const [description, setDescription] = useState('Booking payment');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Dynamically load external script
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => reject(new Error('Script load error'));
            document.body.appendChild(script);
        });
    }

    async function handlePay(ev) {
        ev.preventDefault();
        setLoading(true);
        try {
            // Load Razorpay script
            await loadScript('https://checkout.razorpay.com/v1/checkout.js');

            // Create order on the server. Razorpay expects amount in smallest currency unit (paise for INR)
            const payload = {
                amount: Math.round(Number(amount) * 100),
                currency: 'INR',
                notes: { description },
            };

            const response = await fetch('/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || 'Failed to create Razorpay order');
            }

            const data = await response.json();
            const transactionId = data.transactionId || null;

            if (!data || !data.id || !data.key) {
                throw new Error('Invalid order data from server');
            }

            const options = {
                key: data.key, // Enter the Key ID returned from the server
                amount: data.amount || payload.amount,
                currency: data.currency || payload.currency,
                name: 'Airbnb Clone',
                description: description,
                order_id: data.id,
                handler: async function (res) {
                    // On success: notify server to verify & update transaction, then navigate with state
                    try {
                        await fetch('/transactions/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                payment_id: res.razorpay_payment_id,
                                order_id: res.razorpay_order_id,
                                signature: res.razorpay_signature,
                                status: 'success',
                            }),
                        });

                        // navigate to success page passing state (reliable in React Router)
                        navigate('/payment/success', {
                            state: {
                                payment_id: res.razorpay_payment_id,
                                order_id: res.razorpay_order_id,
                                signature: res.razorpay_signature,
                                amount: data.amount || payload.amount,
                                transactionId,
                            },
                        });
                    } catch (e) {
                        console.error('Verification failed:', e);
                        navigate('/payment/failure', { state: { error: 'Payment verification failed', transactionId } });
                    }
                },
                modal: {
                    ondismiss: async function () {
                        // user closed the checkout -> mark transaction as cancelled
                        try {
                            await fetch('/transactions/verify', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    order_id: data.id,
                                    status: 'cancelled',
                                    error: 'Checkout was closed by user',
                                }),
                            });
                        } catch (e) {
                            console.error('Failed to mark transaction cancelled', e);
                        }

                        // navigate to failure page and pass cancellation reason
                        navigate('/payment/failure', { state: { error: 'Checkout was closed by user', transactionId } });
                    },
                },
                prefill: {
                    name: '',
                    email: '',
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            alert(err.message || 'Payment initialization failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box sx={{ maxWidth: 680, margin: '32px auto', px: 2 }}>
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
                <Stack spacing={2}>
                    <Box>
                        <Typography variant="h5" component="h1" gutterBottom>
                            Secure Checkout
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Enter payment amount and proceed to pay with Razorpay.
                        </Typography>
                    </Box>

                    <form onSubmit={handlePay}>
                        <Stack spacing={2}>
                            <TextField
                                label="Amount (INR)"
                                type="number"
                                inputProps={{ step: '0.01', min: 0 }}
                                value={Number(amount).toFixed(2)}
                                fullWidth
                                disabled
                            />

                            <TextField
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                                multiline
                                minRows={2}
                            />

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Button type="submit" variant="contained" disabled={loading} sx={{ mr: 2 }}>
                                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Pay now'}
                                </Button>
                            </Box>
                        </Stack>
                    </form>
                </Stack>
            </Paper>
        </Box>
    );
}
