import logo from './logo.svg';
import './App.css';
import '../src/assets/css/chat_main.css';

import MainSidebar from './components/sidebar/MainSidebar';
import ChatWindow from './components/chatWindow/ChatWindow';


import {useState} from 'react';

function App() {
  const [curSelContact, setCurSelContact] = useState(null);

  function setCurContact(curContactId){
    setCurSelContact(curContactId)
  }

  return (
    <>
    
    <div className="container">
    <div className="row clearfix">
    <div className="col-lg-12">
    <div className="card chat-app">
    <MainSidebar setCurContact = {setCurContact}/>
    <ChatWindow curSelContact = {curSelContact}/>
    </div>
    </div>
    </div>
    </div>
    
    </>
  );
}

export default App;
