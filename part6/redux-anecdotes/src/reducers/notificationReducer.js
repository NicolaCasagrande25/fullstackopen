import { createSlice } from "@reduxjs/toolkit";

const initialState = 'initial message';

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {}
})

export default notificationSlice.reducer;