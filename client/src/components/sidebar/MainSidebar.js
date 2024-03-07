import Contacts from "../../data/Contacts.json";
import SingleContact from "../singleContact/SingleContact";
// console.log (Contacts);

import {useState} from 'react';

const MainSidebar = (props) => {

    const [activeConntact, setActiveContact] = useState(null);
    const [searchContact, setSearchContact] = useState('');


    function handleClick (currentContactId) {
        //console.log(currentContactId);
        setActiveContact(currentContactId);
        props.setCurContact(currentContactId)
    }

    function searchVal(e){
        setSearchContact(e.target.value);
    }

    let AllContacts;
    //AllContacts = Contacts.map((contact, index) => <SingleContact conatct_details={contact} handleClick={handleClick} key={index} isActive={activeConntact} />)

    if(searchContact === ''){
        AllContacts = Contacts.map((contact, index) => <SingleContact conatct_details={contact} handleClick={handleClick} key={index} isActive={activeConntact} />)
     }else{
        AllContacts = Contacts.map((contact, index) => (contact.name.toUpperCase().match(searchContact.toUpperCase())) ? (<SingleContact conatct_details={contact} handleClick={handleClick} key={index} isActive={activeConntact}/>) : (''))
        //Contacts.map((contact, index) => console.log(contact.name.match(searchContact)))
    }
    

    

    return (
        <>
            <div id="plist" className="people-list">
            <div className="input-group">
            <div className="input-group-prepend">
            <span className="input-group-text"><i className="fa fa-search"></i></span>
            </div>
            <input type="text" className="form-control" placeholder="Search..." onChange={(e) => {searchVal(e)}}/>
            </div>
            <ul className="list-unstyled chat-list mt-2 mb-0">            
            {AllContacts}
            </ul>
            </div>
        </>
    )
}

export default MainSidebar;