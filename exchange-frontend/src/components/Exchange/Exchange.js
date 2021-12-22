import {useCallback, useEffect, useState} from "react";
import {Typography, Container, Grid, TextField} from "@mui/material";

import { Dropdown} from "../Dropdown";


const CURRENCIES = ["USD", "EUR", "ILS"];

const Exchange = () => {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [amount, setAmount] = useState("");

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const onChangeFrom = useCallback((event) => {
        setError(false);
        setResult(null);
        setFrom(event.target.value)
    }, []);

    const onChangeTo = useCallback((event) => {
        setError(false);
        setResult(null);
        setTo(event.target.value)
    }, []);

    const onChangeAmount = useCallback((event) => {
        setError(false);
        setResult(null);
        setAmount(event.target.value)
    }, []);

    useEffect(() => {
        if (from && to && amount) {
            (async () => {
                const url = `/api/quote?from_currency_code=${from}&to_currency_code=${to}&amount=${amount}`;
                setLoading(true);
                let data;
                try {
                    const response = await fetch(url);
                    data = await response.json();
                    setResult(data);
                } catch (e) {
                    setError(true);
                }
                setLoading(false);
            })()
        }
    }, [from, to, amount]);

    return (
        <Container maxWidth="md">
            <Typography variant="h3" align="center" gutterBottom>
                Exchange Rate
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Dropdown id="from" label="From" value={from} items={CURRENCIES} onChange={onChangeFrom}
                              disabled={loading}/>
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Amount"
                        type="number"
                        value={amount}
                        onChange={onChangeAmount}
                        disabled={loading}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Dropdown id="to" label="To" value={to} items={CURRENCIES} onChange={onChangeTo}
                              disabled={loading}/>
                </Grid>
            </Grid>
            {loading && (
                <Typography variant="h6" align="center">
                    Loading...
                </Typography>
            )}
            {error && (
                <Typography variant="h6" align="center" color="red">
                    Something went wrong...
                </Typography>
            )}
            {result && (
                <>
                    <Typography variant="h4" align="center">
                        {result.amount} {to}
                    </Typography>
                    <Typography variant="h6" align="center" color="primary">
                        1 {from} - {result.exchange_rate} {to}
                    </Typography>
                </>
            )}
        </Container>
    )
}


export { Exchange };