import Contacts from '../../data/Contacts.json'
const ChatWindowHeader = (props) => {
    let curContactDetails;
    if(props.curSelContact != null){
        curContactDetails = Contacts[props.curSelContact-1];
    }else{
        curContactDetails = Contacts[0];
    }
    
    
    return (
        <>
            <div className="chat-header clearfix">
            <div className="row">
            <div className="col-lg-6">
            <button data-toggle="modal" data-target="#view_info">
            <img src={curContactDetails.image} alt="avatar"/>
            </button>
            <div className="chat-about">
            <h6 className="m-b-0">{curContactDetails.name}</h6>
            <small>{curContactDetails.lastSeen}</small>
            </div>
            </div>
            <div className="col-lg-6 hidden-sm text-right">
            <button className="btn btn-outline-secondary"><i className="fa fa-camera"></i></button>
            <button className="btn btn-outline-primary"><i className="fa fa-image"></i></button>
            <button className="btn btn-outline-info"><i className="fa fa-cogs"></i></button>
            <button className="btn btn-outline-warning"><i className="fa fa-question"></i></button>
            </div>
            </div>
            </div>
        </>
    )
}

export default ChatWindowHeader;