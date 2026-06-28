import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchPermissions = createAsyncThunk(
  "permissions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/permission");
      return data.data;
    } catch (err) {
      if (err.response?.status === 404) return [];
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch permissions",
      );
    }
  },
);

export const createPermission = createAsyncThunk(
  "permissions/create",
  async (permData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/permission", permData);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create permission",
      );
    }
  },
);

export const updatePermission = createAsyncThunk(
  "permissions/update",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/permission/${id}`, { name });
      return { id, ...data.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update permission",
      );
    }
  },
);

export const deletePermission = createAsyncThunk(
  "permissions/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/permission/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete permission",
      );
    }
  },
);

export const assignPermissionToRole = createAsyncThunk(
  "permissions/assignToRole",
  async ({ roleId, permissionId }, { rejectWithValue }) => {
    try {
      await api.post("/permission/assign-role", { roleId, permissionId });
      return { roleId, permissionId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to assign permission to role",
      );
    }
  },
);

export const unassignPermissionFromRole = createAsyncThunk(
  "permissions/unassignFromRole",
  async ({ roleId, permissionId }, { rejectWithValue }) => {
    try {
      await api.delete("/permission/unassign-role", {
        data: { roleId, permissionId },
      });
      return { roleId, permissionId };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Failed to unassign permission from role",
      );
    }
  },
);

const permissionSlice = createSlice({
  name: "permissions",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearPermissionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.id !== action.payload);
      });
  },
});

export const { clearPermissionError } = permissionSlice.actions;
export default permissionSlice.reducer;
