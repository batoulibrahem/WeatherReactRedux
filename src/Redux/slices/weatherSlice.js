import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Action لجلب الطقس حسب اسم المدينة
export const fetchWeatherAction = createAsyncThunk(
  "weather/fetch",
  async (city, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${
          import.meta.env.VITE_APP_OPEN_WEATHER_KEY
        }&units=metric`
      );
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWeatherAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchWeatherAction.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(fetchWeatherAction.rejected, (state, action) => {
      state.loading = false;
      state.data = null;
      state.error = action.payload;
    });
  },
});

export default weatherSlice.reducer;
