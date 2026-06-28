import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/user");
      return data.data;
    } catch (err) {
      if (err.response?.status === 404) return [];
      return rejectWithValue(err.response?.data?.message || "Failed to fetch users");
    }
  },
);

export const createUser = createAsyncThunk(
  "users/create",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/user", userData);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create user");
    }
  },
);

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ id, ...userData }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/user/${id}`, userData);
      return { id, ...data.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update user");
    }
  },
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/user/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete user");
    }
  },
);

export const assignRoleToUser = createAsyncThunk(
  "users/assignRole",
  async ({ userId, roleId }, { rejectWithValue }) => {
    try {
      await api.post("/role/assign", { userId, roleId });
      return { userId, roleId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to assign role");
    }
  },
);

export const unassignRoleFromUser = createAsyncThunk(
  "users/unassignRole",
  async ({ userId, roleId }, { rejectWithValue }) => {
    try {
      await api.delete("/role/unassign", { data: { userId, roleId } });
      return { userId, roleId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to unassign role",
      );
    }
  },
);

export const assignPermissionToUser = createAsyncThunk(
  "users/assignPermission",
  async ({ userId, permissionId }, { rejectWithValue }) => {
    try {
      await api.post("/permission/assign-user", { userId, permissionId });
      return { userId, permissionId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to assign permission",
      );
    }
  },
);

export const unassignPermissionFromUser = createAsyncThunk(
  "users/unassignPermission",
  async ({ userId, permissionId }, { rejectWithValue }) => {
    try {
      await api.delete("/permission/unassign-user", {
        data: { userId, permissionId },
      });
      return { userId, permissionId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to unassign permission",
      );
    }
  },
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter((u) => u.id !== action.payload);
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
