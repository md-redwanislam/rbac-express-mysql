import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import userReducer from "../features/userSlice";
import roleReducer from "../features/roleSlice";
import permissionReducer from "../features/permissionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    roles: roleReducer,
    permissions: permissionReducer,
  },
});
