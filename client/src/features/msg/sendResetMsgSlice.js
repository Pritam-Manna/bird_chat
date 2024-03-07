import { createSlice } from "@reduxjs/toolkit";

export const sendResetMsgSlice = createSlice({
    name: 'currentMessage',
    initialState : {
        value : '',
    },
    reducers: {
        setSendMessage: (state, action) => {
            state.value = action.payload;
        },
        resetSendMessage: (state) => {
            state.value = '';
        }
    }
})


export const {setSendMessage, resetSendMessage} = sendResetMsgSlice.actions;
export default sendResetMsgSlice.reducer;