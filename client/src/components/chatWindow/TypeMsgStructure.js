import {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSendMessage } from '../../features/msg/sendResetMsgSlice';

const TypeMsgStructure = (props) => {
    const [curTypedMsg, setCurTypedMsg] = useState('');
    const dispatchMessage = useDispatch();
    function handleEnterMsg(e){
        setCurTypedMsg(e.target.value);
    }


    function sendMsg(){
        //console.log(curTypedMsg);
        dispatchMessage(setSendMessage(curTypedMsg));
        
        //props.curMsgToSend(curTypedMsg);
        setCurTypedMsg('');
    }


    return(
        <>
            <div className="chat-message clearfix">
                <div className="input-group mb-0">
                    <div className="input-group-prepend" onClick = {sendMsg}>
                        <span className="input-group-text"><i className="fa fa-send"></i></span>
                    </div>
                    <input type="text" className="form-control" placeholder="Enter text here..." onChange={(e)=>handleEnterMsg(e)} value={curTypedMsg}/>
                </div>
            </div>
        </>
    )
}

export default TypeMsgStructure;