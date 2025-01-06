import { connectMetaMask, getChainId } from "../../utils/metamask";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const connectToMetaMask = createAsyncThunk(
  "metamask/connectToMetaMask",
  async (_, { rejectWithValue }) => {
    try {
      const account = await connectMetaMask();
      const network = await getChainId();
      return { account, chainId: network.chainId };
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);
