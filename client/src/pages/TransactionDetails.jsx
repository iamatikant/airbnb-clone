import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Paper, Typography, Stack, Divider, Button, CircularProgress } from '@mui/material';

export default function TransactionDetails() {
    const { id } = useParams();
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        fetch(`/transactions/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch transaction');
                return res.json();
            })
            .then(data => mounted && setTransaction(data))
            .catch(err => {
                console.error(err);
                if (mounted) setTransaction(null);
            })
            .finally(() => mounted && setLoading(false));

        return () => { mounted = false };
    }, [id]);

    if (loading) return (
        <Box sx={{ maxWidth: 800, margin: '32px auto', px: 2 }}>
            <Paper sx={{ p: 3 }}><Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box></Paper>
        </Box>
    );

    if (!transaction) return (
        <Box sx={{ maxWidth: 800, margin: '32px auto', px: 2 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6">Transaction not found or you are not authorized.</Typography>
                <Box sx={{ mt: 2 }}>
                    <Button component={Link} to="/account/transactions" variant="outlined">Back to transactions</Button>
                </Box>
            </Paper>
        </Box>
    );

    return (
        <Box sx={{ maxWidth: 800, margin: '32px auto', px: 2 }}>
            <Paper sx={{ p: 3 }}>
                <Stack spacing={2}>
                    <Typography variant="h5">Transaction Details</Typography>

                    <Typography><strong>ID:</strong> {transaction._id}</Typography>
                    <Typography><strong>Created:</strong> {new Date(transaction.createdAt).toLocaleString()}</Typography>
                    <Typography><strong>Status:</strong> {transaction.status}</Typography>
                    <Typography><strong>Provider:</strong> {transaction.provider}</Typography>
                    <Typography><strong>Amount:</strong> {(transaction.amount || 0) / 100} {transaction.currency}</Typography>
                    <Typography><strong>Order ID:</strong> {transaction.order_id}</Typography>
                    <Typography><strong>Payment ID:</strong> {transaction.payment_id || '-'}</Typography>
                    <Typography><strong>Signature:</strong> {transaction.signature || '-'}</Typography>

                    <Divider />

                    <Typography variant="subtitle1">Raw Data</Typography>
                    <Paper variant="outlined" sx={{ p: 2, whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: 300 }}>
                        <code>{JSON.stringify(transaction.raw || {}, null, 2)}</code>
                    </Paper>

                    {transaction.error && (
                        <Typography color="error"><strong>Error:</strong> {transaction.error}</Typography>
                    )}

                    <Box>
                        <Button component={Link} to="/account/transactions" variant="outlined">Back</Button>
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
}
