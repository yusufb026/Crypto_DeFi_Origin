const ethers = require("ethers");

export const checkMetaMaskAvailability = () => {
  if (window.ethereum) {
    return true;
  } else {
    console.error("MetaMask is not installed!");
    return false;
  }
};

export const connectMetaMask = async () => {
  if (checkMetaMaskAvailability()) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      return account;
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      alert("Error connecting to MetaMask:", error);
      throw error;
    }
  } else {
    alert("MetaMask is not installed! Install to connect");
  }
};

export const getProvider = () => {
  if (checkMetaMaskAvailability()) {
    return new ethers.BrowserProvider(window.ethereum);
  }
};

export const getSigner = () => {
  const provider = getProvider();
  return provider.getSigner();
};

export const getChainId = async () => {
  const provider = getProvider();
  return await provider.getNetwork();
};

export const getAccountBalance = async (account) => {
  const provider = getProvider();
  return await provider.getBalance(account);
};

export const getFormattedBalance = (balanceInWei) => {
  return ethers.formatEther(balanceInWei); // Convert Wei to Ether
};

// Function to fetch Ethereum price in a specific fiat currency (USD, INR, EUR, etc.)
export const getEthereumPriceInFiat = async (currency) => {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${currency}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.ethereum[currency]; // Returns price in selected currency (USD, INR, etc.)
  } catch (error) {
    console.error("Error fetching price:", error);
    return null;
  }
};

// Function to get balance in fiat currency
export const getFiatBalance = async (balanceInWei, currency) => {
  const ethPriceInFiat = await getEthereumPriceInFiat(currency.toLowerCase());
  if (ethPriceInFiat) {
    const fiatBalance = parseFloat(balanceInWei) * ethPriceInFiat;
    return fiatBalance.toFixed(2); // Return fiat balance with 2 decimal points
  } else {
    return null;
  }
};
