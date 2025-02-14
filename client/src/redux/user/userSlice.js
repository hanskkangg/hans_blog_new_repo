import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null; // ✅ Reset error when starting sign-in
    },
    signInSuccess: (state, action) => {
      state.currentUser = {
        ...action.payload,
        token: action.payload.token, // ✅ Store token in Redux
      };
      state.loading = false;
      state.error = null;
    }
,    
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateStart: (state) => {
      state.loading = true;
      state.error = null; // ✅ Clear errors before starting update
    },
    updateSuccess: (state, action) => {
      state.currentUser = {
        ...state.currentUser,
        ...action.payload, // ✅ Merge updated user data
        token: action.payload.token, // ✅ Store new token
      };
      state.loading = false;
      state.error = null;
    },
    
    updateFailure: (state, action) => {
      state.loading = false; // ✅ Ensure loading resets on failure
      state.error = action.payload;
    },
    resetError: (state) => {
      state.error = null;
      state.loading = false; // ✅ Also reset loading when clearing errors}
    },
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signoutSuccess: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
  resetError, // ✅ New action to reset errors
} = userSlice.actions;

export default userSlice.reducer;
