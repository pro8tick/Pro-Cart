import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";
import { toast } from "react-toastify";

const initialState = {
  isLoggedIn: false,
  user: null,
  isError: false,
  error: null,
  isLoading: false,
  userOrders: [],
  status: "",
  userChecked: false,
};

// Register User
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const res = await authService.register(userData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Login User
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const res = await authService.login(userData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
// Logout User
export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    return await authService.logout();
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});
// get Login Status
export const getLoginStatus = createAsyncThunk(
  "auth/getLogInStatus",
  async (_, thunkAPI) => {
    try {
      const { data } = await authService.getLoginStatus();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
// get User
export const getUser = createAsyncThunk("auth/getUser", async () => {
  const response = await authService.getUser();
  // The value we return becomes the `fulfilled` action payload
  return response.data;
});

// Update User
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (userData, thunkAPI) => {
    try {
      return await authService.updateUser(userData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// Update Photo
export const updatePhoto = createAsyncThunk(
  "auth/updatePhoto",
  async (userData, thunkAPI) => {
    try {
      return await authService.updatePhoto(userData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const getUserOrderAsync = createAsyncThunk(
  "auth/getUserOrder",
  async () => {
    const response = await authService.getUserOrders();
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    RESET_AUTH(state) {
      state.isError = false;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      //register-user
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;

        state.isLoggedIn = action.payload ? true : false;
        toast.success("Registration successfull");
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      //login-user
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = action.payload ? true : false;
        toast.success("Login successfull");
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
        state.user = null;
        toast.error(state.error || state.error.message);
      })
      //logout-user
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.user = null;
        toast.success(action.payload);
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.user = null;
        toast.error(action.payload);
      })
      //login-status
      .addCase(getLoginStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLoginStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = action.payload ? true : false;
        state.userChecked = true;
      })
      .addCase(getLoginStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.userChecked = true;
      })
      //Get user
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        //state.error = action.payload;
      })
      //update user
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.isLoading = false;
        toast.success("User updated");
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      //update Photo
      .addCase(updatePhoto.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePhoto.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.isLoading = false;
        toast.success("User Photo updated");
        state.user = action.payload.user;
      })
      //get User Orders
      .addCase(updatePhoto.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(getUserOrderAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserOrderAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.userOrders = action.payload;
      });
  },
});

export const { RESET_AUTH } = authSlice.actions;
export const selectUserOrder = (state) => state.auth.userOrders;
export const selectUsererror = (state) => state.auth.error;
export const selectUser = (state) => state.auth.isLoggedIn;
export const selectCheck = (state) => state.auth.userChecked;
export default authSlice.reducer;
