import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getPiDigits = createAsyncThunk(
  "PiSlice/getPiDigits",
  async (numDigits, { dispatch, rejectWithValue }) => {
    try {
      const url = "https://api.pi.delivery/v1/pi?start=1&numberOfDigits=";
      const fetchData = fetch(url + numDigits)
        .then((response) => response.json())
        .then((response) => response.content);
      return fetchData;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const indexOfSubstrings = function* (str, searchValue) {
  let i = 0;
  while (true) {
    const r = str.indexOf(searchValue, i);
    if (r !== -1) {
      yield r;
      i = r + 1;
    } else return;
  }
};


export const searchPi = createAsyncThunk(
  "PiSlice/searchPi",
  async (sequence, { dispatch, rejectWithValue }) => {
    try {
      const fetchData = await fetch("https://api.pi.delivery/v1/pi?start=1&numberOfDigits=1000")
        .then((response) => response.json())
        .then((response) => response.content);

      return [...indexOfSubstrings(fetchData, sequence)].toString(); // Extract indices
      } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const PiSlice = createSlice({
  name: "PiSlice",
  initialState: {
    piDigits: "",
    searchResults: "",
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: {
    [getPiDigits.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getPiDigits.fulfilled]: (state, action) => {
      state.loading = false;
      state.piDigits = action.payload;
    },
    [getPiDigits.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    [searchPi.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [searchPi.fulfilled]: (state, action) => {
      state.loading = false;
      state.searchResults = action.payload;
    },
    [searchPi.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export default PiSlice.reducer;
