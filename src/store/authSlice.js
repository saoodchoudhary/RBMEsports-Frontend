"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

export const fetchMe = createAsyncThunk("auth/me", async () => {
  const res = await api.me();
  return res.data;
});

export const login = createAsyncThunk("auth/login", async (payload) => {
  const res = await api.login(payload);
  return res.user;
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await api.logout();
  return true;
});

const slice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "idle",
    error: null
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchMe.pending, (s) => { s.status = "loading"; });
    b.addCase(fetchMe.fulfilled, (s, a) => { s.status = "succeeded"; s.user = a.payload; s.error = null; });
    b.addCase(fetchMe.rejected, (s) => { s.status = "failed"; s.user = null; });

    b.addCase(login.fulfilled, (s, a) => { s.user = a.payload; });
    b.addCase(logout.fulfilled, (s) => { s.user = null; });
  }
});

export default slice.reducer;