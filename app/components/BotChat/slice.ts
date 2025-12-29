import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  dataBotChat: null,
  error: null,
};

export const fetchChatBot = createAsyncThunk(
  "botChat/fetchChatBot",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://68e90f09f2707e6128cd5c12.mockapi.io/api/cinema"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const botChatSlice = createSlice({
  name: "botChat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatBot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatBot.fulfilled, (state, action) => {
        state.loading = false;
        state.dataBotChat = action.payload;
      })
      .addCase(fetchChatBot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default botChatSlice.reducer;
