import ChatHistory1 from '../../data/Id_1_chat.json';
import ChatHistory2 from '../../data/Id_2_chat.json';
import ChatHistory3 from '../../data/Id_3_chat.json';
import ChatHistory4 from '../../data/Id_4_chat.json';
import SingleMessageStructure from './SingleMessageStructure';

import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setSendMessage } from '../../features/msg/sendResetMsgSlice';
import { io } from 'socket.io-client';
const socket = io("http://localhost:8001/");
socket.emit("registerCon", "841");

// console.log(ChatHistory);
const MainChatWindow = (props) => {
    useEffect(() => {
        // fetch("http://localhost:8000/", {
        //     method: 'POST',
        //     headers: {
        //         'content-type': 'application/json',
        //     },
        //     body : JSON.stringify({"Requesting" : "msg"}),
        // }).then((res) => res.json()).then(response => console.log(JSON.stringify(response)))
    }, []);
    const msgToSend = useSelector((state) => state.sendResetMsg.value);
    const dispatchMessage = useDispatch();
    

    let ChatHistory;
    switch(props.curSelContact){
        case 1: 
            ChatHistory = ChatHistory1;
            //console.log("customer 1");
            // if(props.msgToSend != ''){
            //     ChatHistory.
            // }
            break;
        case 2: 
            ChatHistory = ChatHistory2;
            //console.log("customer 2");
            break;
        case 3: 
            ChatHistory = ChatHistory3;
            //console.log("customer 3");
            break;
        case 4: 
            ChatHistory = ChatHistory4;
            //console.log("customer 4");
            break;
        default: 
            ChatHistory = ChatHistory1;
            //console.log("customer default");
            break;
    }       
    
    console.log(msgToSend);
    if(msgToSend !== ''){
        let temp_obj = {
            "author" : "0",
            "message" : msgToSend,
            "timestamp" : "10:10 AM, Today"
        }
        // let temp_obj1 = {
        //     "sender" : "841",
        //     "receiver" : "555",
        //     "message" : msgToSend
        // }
        let temp_obj1 = {
            user: "841",
            contact: "998"
        }
        ChatHistory.push(temp_obj);
        dispatchMessage(setSendMessage(""));
        socket.emit("sendMsg", temp_obj1);
        // props.resetMsgToSend()
    }


    const messageStructure = ChatHistory.map((singleMessage, index) =>  <SingleMessageStructure messageData={singleMessage} key={index}/>)
    return (
        <>
            <div className="chat-history">
            <ul className="m-b-0">
            {messageStructure}
            </ul>
            </div>
        </>
    )
}

export default MainChatWindow;