import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchRoles = createAsyncThunk(
  "roles/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/role");
      return data.data;
    } catch (err) {
      if (err.response?.status === 404) return [];
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch roles",
      );
    }
  },
);

export const createRole = createAsyncThunk(
  "roles/create",
  async (roleData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/role", roleData);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create role",
      );
    }
  },
);

export const updateRole = createAsyncThunk(
  "roles/update",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/role/${id}`, { name });
      return { id, ...data.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update role",
      );
    }
  },
);

export const fetchUserRoles = createAsyncThunk(
  "roles/fetchUserRoles",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/role/user-roles");
      return data.data;
    } catch (err) {
      if (err.response?.status === 404) return [];
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch user-roles",
      );
    }
  },
);

export const deleteRole = createAsyncThunk(
  "roles/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/role/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete role",
      );
    }
  },
);

const roleSlice = createSlice({
  name: "roles",
  initialState: {
    list: [],
    userRoles: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearRoleError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.list = state.list.filter((r) => r.id !== action.payload);
      })
      .addCase(fetchUserRoles.fulfilled, (state, action) => {
        state.userRoles = action.payload;
      });
  },
});

export const { clearRoleError } = roleSlice.actions;
export default roleSlice.reducer;
