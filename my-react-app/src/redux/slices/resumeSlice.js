import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { resumeApi } from '../../api/resumeApi';

export const fetchResumes = createAsyncThunk('resume/fetchAll', async (_, { rejectWithValue }) => {
    try {
      const response = await resumeApi.getAllResumes();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createResume = createAsyncThunk('resume/create', async (data, { rejectWithValue }) => {
    try {
      const response = await resumeApi.createResume(data);
      console.log("response",response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateResume = createAsyncThunk('resume/update', async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await resumeApi.updateResume(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteResume = createAsyncThunk('resume/delete', async (id, { rejectWithValue }) => {
    try {
      await resumeApi.deleteResume(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const resumeSlice = createSlice({name: 'resume', initialState: {
    resumes: [],
    currentResume: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Resumes
      .addCase(fetchResumes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.isLoading = false;
        // assume API returns an array of resumes
        state.resumes = action.payload;
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error?.message;
      })
      // Create Resume
      .addCase(createResume.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resumes.push(action.payload);
        state.currentResume = action.payload;
      })
      .addCase(createResume.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Resume
      .addCase(updateResume.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateResume.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.resumes.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.resumes[index] = action.payload;
        }
        state.currentResume = action.payload;
      })
      .addCase(updateResume.rejected, (state, action) => {
        state.isLoading = false;
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