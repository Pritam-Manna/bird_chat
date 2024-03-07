import {configureStore} from '@reduxjs/toolkit';

import sendResetMsgReducer from '../features/msg/sendResetMsgSlice'

export default configureStore ({
    reducer: {
        sendResetMsg : sendResetMsgReducer
    },
})