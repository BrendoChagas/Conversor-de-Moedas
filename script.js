document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://api.apilayer.com/exchangerates_data";
    const API_KEY = "";
  
    const amountInput = document.getElementById("amount");
    const fromCurrencySelect = document.getElementById("from-currency");
    const toCurrencySelect = document.getElementById("to-currency");
    const convertBtn = document.getElementById("convert-btn");
    const resultDiv = document.getElementById("result");
  
    const fetchRates = async () => {
      try {
        const response = await fetch(`${API_URL}/symbols`, {
          method: 'GET',
          headers: {
            'apikey': API_KEY
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || !data.symbols) {
          throw new Error("Dados inválidos recebidos da API");
        }
        
        const currencies = Object.keys(data.symbols);
        
        if (currencies.length === 0) {
          throw new Error("Nenhuma moeda recebida da API");
        }
        
        currencies.forEach(currency => {
          const optionFrom = document.createElement("option");
          optionFrom.value = currency;
          optionFrom.textContent = `${currency} - ${data.symbols[currency]}`;
          fromCurrencySelect.appendChild(optionFrom);
          
          const optionTo = document.createElement("option");
          optionTo.value = currency;
          optionTo.textContent = `${currency} - ${data.symbols[currency]}`;
          toCurrencySelect.appendChild(optionTo);
        });
        
        console.log("Moedas carregadas com sucesso");
      } catch (error) {
        console.error("Erro ao buscar taxas de câmbio:", error);
        resultDiv.textContent = `Erro ao carregar as moedas: ${error.message}. Por favor, verifique sua chave API e conexão com a internet.`;
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
        const response = await fetch(`${API_URL}/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`, {
          method: 'GET',
          headers: {
            'apikey': API_KEY
          }
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        
        if (!data || !data.result) {
          throw new Error("Dados inválidos recebidos da API");
        }
  
        const convertedAmount = data.result.toFixed(2);
        resultDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
      } catch (error) {
        console.error("Erro ao converter moeda:", error);
        resultDiv.textContent = `Erro ao converter moeda: ${error.message}. Por favor, verifique sua chave API e tente novamente mais tarde.`;
      }
    };
  
    convertBtn.addEventListener("click", convertCurrency);
    fetchRates();
  });