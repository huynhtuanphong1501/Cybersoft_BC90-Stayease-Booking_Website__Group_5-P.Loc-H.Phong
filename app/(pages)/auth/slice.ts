import api from "@/app/service/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { TApiResponse, InitState, TUser, AuthUser } from "@/app/type"
import type { AxiosError } from "axios";

const initialState: InitState<TUser> = {
    loading: false,
    data: null,
    error: null
}

export const fetchAuth = createAsyncThunk("auth/fetchAuth", async (user: AuthUser, { rejectWithValue }) => {
    try {
        const response = await api.post<TApiResponse<TUser>>("auth/signin", user);
        // console.log(response.data.content);
        return response.data.content;
     }catch(error: any) {
        return rejectWithValue(error.response.data);
    }
})


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => { 
        builder
          .addCase(fetchAuth.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchAuth.fulfilled, (state, action) => { 
            state.data = action.payload;
            state.loading = false;
          })
          .addCase(fetchAuth.rejected, (state, action) => {
            state.error = (action.payload as AxiosError<any>) || action.error;
            state.loading = false;
          });
    }
})

export default authSlice.reducer;