import { createSlice } from "@reduxjs/toolkit";

const initialState = '';

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotification: (state, action) => action.payload,
        clearNotification: () => ''
    }
})

export const { setNotification, clearNotification } = notificationSlice.actions;

export const addNotification = (notification, duration) => {
    return dispatch => {
        dispatch(setNotification(notification));
        setTimeout(() => {
            dispatch(clearNotification());
        }, duration * 1000);
    }
}

export default notificationSlice.reducer;