import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, TextField, Button, MenuItem, Stack, InputAdornment, Grid, IconButton, Tooltip, Collapse } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState(null);
    const [loading, setLoading] = useState(true);

    // Filters
    const [q, setQ] = useState('');
    const [status, setStatus] = useState('');
    const [provider, setProvider] = useState('');
    const [minAmount, setMinAmount] = useState(''); // in rupees
    const [maxAmount, setMaxAmount] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);

    const fetchTransactions = (params = {}) => {
        setLoading(true);
        const searchParams = new URLSearchParams();
        if (params.q) searchParams.set('q', params.q);
        if (params.order_id) searchParams.set('order_id', params.order_id);
        if (params.payment_id) searchParams.set('payment_id', params.payment_id);
        if (params.status) searchParams.set('status', params.status);
        if (params.provider) searchParams.set('provider', params.provider);
        if (params.minAmount !== undefined && params.minAmount !== null && params.minAmount !== '') searchParams.set('minAmount', params.minAmount);
        if (params.maxAmount !== undefined && params.maxAmount !== null && params.maxAmount !== '') searchParams.set('maxAmount', params.maxAmount);
        if (params.from) searchParams.set('from', params.from);
        if (params.to) searchParams.set('to', params.to);

        const queryStr = searchParams.toString();
        const url = `/transactions${queryStr ? `?${queryStr}` : ''}`;

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch transactions');
                return res.json();
            })
            .then(data => setTransactions(data))
            .catch(err => {
                console.error(err);
                setTransactions([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        // initial load
        fetchTransactions({});
    }, []);

    const applyFilters = () => {
        // convert rupees to paise for server-side matching
        const qTrim = (q || '').trim();
        const params = {
            q: qTrim || undefined,
            status: status || undefined,
            provider: provider || undefined,
            minAmount: minAmount ? Math.round(Number(minAmount) * 100) : undefined,
            maxAmount: maxAmount ? Math.round(Number(maxAmount) * 100) : undefined,
            from: from || undefined,
            to: to || undefined,
        };

        // If the search looks like an exact order or payment id, send it as such for exact matching
        if (qTrim) {
            const lower = qTrim.toLowerCase();
            if (lower.startsWith('order_')) params.order_id = qTrim;
            else if (lower.startsWith('pay_') || lower.startsWith('payment_') || lower.startsWith('pay')) params.payment_id = qTrim;
        }

        fetchTransactions(params);
    };

    const clearFilters = () => {
        setQ('');
        setStatus('');
        setProvider('');
        setMinAmount('');
        setMaxAmount('');
        setFrom('');
        setTo('');
        fetchTransactions({});
    };

    return (
        <Box sx={{ maxWidth: 1000, margin: '32px auto', px: 2 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>Transactions</Typography>

                <Paper variant="outlined" sx={{ p: 2, mb: 2, backgroundColor: 'background.paper' }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                        <TextField
                            label="Search (order/payment id)"
                            size="small"
                            value={q}
                            onChange={e => setQ(e.target.value)}
                            sx={{ flex: 1 }}
                            placeholder="order_xxx or pay_xxx"
                        />

                        <TextField select size="small" label="Status" value={status} onChange={e => setStatus(e.target.value)} sx={{ minWidth: 160 }}>
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="success">Success</MenuItem>
                            <MenuItem value="failure">Failure</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                        </TextField>

                        <TextField select size="small" label="Provider" value={provider} onChange={e => setProvider(e.target.value)} sx={{ minWidth: 140 }}>
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="razorpay">Razorpay</MenuItem>
                        </TextField>

                        <Box sx={{ ml: 'auto', display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Button size="small" variant="text" onClick={() => setShowAdvanced(v => !v)} startIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}>Advanced</Button>
                            <Tooltip title="Clear filters">
                                <IconButton onClick={clearFilters} color="primary" size="small">Clear</IconButton>
                            </Tooltip>
                            <Button variant="contained" onClick={applyFilters}>Apply</Button>
                        </Box>
                    </Stack>

                    {/* Active filters */}
                    <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 1, flexWrap: 'wrap' }}>
                        {q && <Chip label={`q: ${q}`} size="small" onDelete={() => { setQ(''); applyFilters(); }} />}
                        {status && <Chip label={`status: ${status}`} size="small" onDelete={() => { setStatus(''); applyFilters(); }} />}
                        {provider && <Chip label={`provider: ${provider}`} size="small" onDelete={() => { setProvider(''); applyFilters(); }} />}
                        {(minAmount || maxAmount) && <Chip label={`amount: ${minAmount || 0} - ${maxAmount || '∞'} INR`} size="small" onDelete={() => { setMinAmount(''); setMaxAmount(''); applyFilters(); }} />}
                        {(from || to) && <Chip label={`date: ${from || '-'} → ${to || '-'}`} size="small" onDelete={() => { setFrom(''); setTo(''); applyFilters(); }} />}
                    </Stack>

                    <Collapse in={showAdvanced}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={3} md={2}>
                                <TextField type="date" size="small" label="From" value={from} onChange={e => setFrom(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
                            </Grid>
                            <Grid item xs={12} sm={3} md={2}>
                                <TextField type="date" size="small" label="To" value={to} onChange={e => setTo(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
                            </Grid>
                            <Grid item xs={12} sm={3} md={2}>
                                <TextField size="small" label="Min (INR)" value={minAmount} onChange={e => setMinAmount(e.target.value)} fullWidth InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} />
                            </Grid>
                            <Grid item xs={12} sm={3} md={2}>
                                <TextField size="small" label="Max (INR)" value={maxAmount} onChange={e => setMaxAmount(e.target.value)} fullWidth InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} />
                            </Grid>
                        </Grid>
                    </Collapse>
                </Paper>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Created</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Provider</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions && transactions.length ? transactions.map(t => (
                                    <TableRow key={t._id}>
                                        <TableCell>{new Date(t.createdAt).toLocaleString()}</TableCell>
                                        <TableCell>{(t.amount || 0) / 100} {t.currency || 'INR'}</TableCell>
                                        <TableCell>{t.provider}</TableCell>
                                        <TableCell>
                                            <Chip label={t.status} color={t.status === 'success' ? 'success' : (t.status === 'pending' ? 'warning' : 'default')} />
                                        </TableCell>
                                        <TableCell style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.order_id}</TableCell>
                                        <TableCell>
                                            <Link to={`/account/transactions/${t._id}`}>View</Link>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow><TableCell colSpan={6}>No transactions found.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </Box>
    );
}
