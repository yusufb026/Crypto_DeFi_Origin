import {
  connectMetaMask,
  getAccountBalance,
  getChainId,
} from "../../utils/metamask";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const connectToMetaMask = createAsyncThunk(
  "metamask/connectToMetaMask",
  async (_, { rejectWithValue }) => {
    try {
      const account = await connectMetaMask();
      const network = await getChainId();
      const balance = await getAccountBalance(account);
      return { account, chainId: network.chainId, accountBalance: balance };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
