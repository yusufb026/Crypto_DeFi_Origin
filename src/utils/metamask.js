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
