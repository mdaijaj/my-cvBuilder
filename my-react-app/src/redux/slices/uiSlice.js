import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    snackbar: {
      open: false,
      message: '',
      severity: 'info',
    },
    loading: false,
  },
  reducers: {
    showSnackbar: (state, action) => {
      state.snackbar = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity || 'info',
      };
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { showSnackbar, hideSnackbar, setLoading } = uiSlice.actions;
export default uiSlice.reducer;