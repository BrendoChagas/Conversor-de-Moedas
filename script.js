document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://api.apilayer.com/exchangerates_data/latest?base=USD";
  const API_KEY = "b6b6bfa7b4b5d5b150a86df8b5181b16";

  const amountInput = document.getElementById("amount");
  const fromCurrencySelect = document.getElementById("from-currency");
  const toCurrencySelect = document.getElementById("to-currency");
  const convertBtn = document.getElementById("convert-btn");
  const resultDiv = document.getElementById("result");

  const fetchRates = async () => {
      try {
          const response = await fetch(API_URL, {
              headers: {
                  "apikey": API_KEY
              }
          });
          const data = await response.json();
          const currencies = Object.keys(data.rates);
          
          currencies.forEach(currency => {
              const optionFrom = document.createElement("option");
              optionFrom.value = currency;
              optionFrom.textContent = currency;
              fromCurrencySelect.appendChild(optionFrom);
              
              const optionTo = document.createElement("option");
              optionTo.value = currency;
              optionTo.textContent = currency;
              toCurrencySelect.appendChild(optionTo);
          });
      } catch (error) {
          console.error("Erro ao buscar taxas de câmbio:", error);
      }
  };

  const convertCurrency = async () => {
      const amount = parseFloat(amountInput.value);
      const fromCurrency = fromCurrencySelect.value;
      const toCurrency = toCurrencySelect.value;

      if (isNaN(amount) || !fromCurrency || !toCurrency) {
          resultDiv.textContent = "Por favor, insira todos os valores.";
          return;
      }

      try {
          const response = await fetch(`${API_URL}&symbols=${toCurrency}`, {
              headers: {
                  "apikey": API_KEY
              }
          });
          const data = await response.json();
          const rate = data.rates[toCurrency];
          const convertedAmount = (amount * rate).toFixed(2);

          resultDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
      } catch (error) {
          console.error("Erro ao converter moeda:", error);
      }
  };

  convertBtn.addEventListener("click", convertCurrency);
  fetchRates();
});
