import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "store/user/types";
import keycloak from "initKeycloak";
import { fetchUser, updateUser } from "store/user/thunks";

export const UserState: initialState = {
  user: null,
  isLoading: false,
  isUpdating: false,
};

const userSlice = createSlice({
  name: "user",
  initialState: UserState,
  reducers: {
    cleanLogout: (state) => {
      keycloak.logout({
        redirectUri: window.location.origin,
      });

      return UserState;
    },
  },
  extraReducers: (builder) => {
    // Fetch User
    builder.addCase(fetchUser.pending, (state) => {
      state.isLoading = true;
      state.error = undefined;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => ({
      ...state,
      error: undefined,
      user: action.payload,
      isLoading: false,
    }));
    builder.addCase(fetchUser.rejected, (state, action) => ({
      ...state,
      error: action.payload,
      isLoading: false,
    }));
    // Update User
    builder.addCase(updateUser.pending, (state) => {
      state.isUpdating = true;
      state.error = undefined;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => ({
      ...state,
      error: undefined,
      user: action.payload,
      isUpdating: false,
    }));
    builder.addCase(updateUser.rejected, (state, action) => ({
      ...state,
      error: action.payload,
      isUpdating: false,
    }));
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
