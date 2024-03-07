import MainChatWindow from "./MainChatWindow";
import ChatWindowHeader from "./ChatWindowHeader";
import TypeMsgStructure from "./TypeMsgStructure";
import { useState } from "react";

const ChatWindow = (props) => {
    // console.log(props.curSelContact)
    //const [msgToSend, setMsgToSend] = useState('');

    function curMsgToSend(msg){
        //console.log(msg);
        //setMsgToSend(msg);
        //setMsgToSend('');
        //resetMsgToSend();
    }

    function resetMsgToSend(){
        //setMsgToSend('');
    }
    
    return(
        <>
            <div className="chat">
            <ChatWindowHeader curSelContact={props.curSelContact}/>
            {/* <MainChatWindow curSelContact={props.curSelContact} msgToSend={msgToSend} resetMsgToSend={resetMsgToSend}/> */}
            <MainChatWindow curSelContact={props.curSelContact}/>
            <TypeMsgStructure />
            </div>
        </>
    )
}

export default ChatWindow;