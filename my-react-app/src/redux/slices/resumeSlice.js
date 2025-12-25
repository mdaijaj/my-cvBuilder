import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { resumeApi } from '../../api/resumeApi';

export const fetchResumes = createAsyncThunk(
  'resume/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await resumeApi.getAllResumes();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createResume = createAsyncThunk(
  'resume/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await resumeApi.createResume(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateResume = createAsyncThunk(
  'resume/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await resumeApi.updateResume(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteResume = createAsyncThunk(
  'resume/delete',
  async (id, { rejectWithValue }) => {
    try {
      await resumeApi.deleteResume(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const resumeSlice = createSlice({
  name: 'resume',
  initialState: {
    resumes: [],
    currentResume: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Resume
      .addCase(createResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes.push(action.payload);
        state.currentResume = action.payload;
      })
      .addCase(createResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Resume
      .addCase(updateResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateResume.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.resumes.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.resumes[index] = action.payload;
        }
        state.currentResume = action.payload;
      })
      .addCase(updateResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export const {
  setCurrentResume,
  setSelectedTemplate,
  updateCurrentResumeData,
  clearCurrentResume,
} = resumeSlice.actions;

export default resumeSlice.reducer;