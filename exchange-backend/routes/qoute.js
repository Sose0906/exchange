const express = require('express');
const axios = require('axios');

const router = express.Router();

const ACCESS_KEY = "22b9c84d671a5b006839208f8f98968c";
const cache = {};

/* GET users listing. */
router.get('/', async function (req, res, next) {
    const requestFromCurrencyCode = req.query.from_currency_code;
    const requestAmount = req.query.amount;
    const requestToCurrencyCode = req.query.to_currency_code;

    try {
        const url = `http://api.exchangeratesapi.io/v1/latest?access_key=${ACCESS_KEY}&base=${requestFromCurrencyCode}`;

        let apiResponse;
        if (cache[requestFromCurrencyCode]) {
            apiResponse = cache[requestFromCurrencyCode];
        } else {
            apiResponse = await axios.get(url);
            cache[requestFromCurrencyCode] = apiResponse;
            setTimeout(function () {
                delete cache[requestFromCurrencyCode];
            }, 10000);
        }

        const rates = apiResponse.data.rates;
        const exchangeRate = rates[requestToCurrencyCode];
        const exchangeRateFormatted = Number(exchangeRate.toFixed(3));

        const responseExchangeRate = exchangeRateFormatted;
        const responseCurrencyCode = requestToCurrencyCode;
        const responseAmount = Number((requestAmount * exchangeRateFormatted).toFixed(3));

        const response = {
            exchange_rate: responseExchangeRate,
            currency_code: responseCurrencyCode,
            amount: responseAmount
        };

        const responseBody = JSON.stringify(response);

        res.send(responseBody);
    } catch (error) {
        res.status(400).send("Something went wrong");
    }
});

module.exports = router;
