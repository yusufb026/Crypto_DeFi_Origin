import { createSlice } from "@reduxjs/toolkit";
import { connectToMetaMask } from "./actions";
const PREFIX = "metaMask";

const initialState = {
  account: null,
  chainId: null as bigint | null,
  isLoading: false,
  error: null,
  accountBalance: null as bigint | null,
};

const metaMaskSlice = createSlice({
  name: PREFIX,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(connectToMetaMask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(connectToMetaMask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.account = action.payload.account;
        state.chainId = action.payload.chainId;
        state.accountBalance = action.payload.accountBalance;
      })
      .addCase(connectToMetaMask.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export default metaMaskSlice.reducer;
