
const SingleMessageStructure = (props) => {
    return (
        <>
            <li className="clearfix">
            <div className= {`message-data ${props.messageData.author === "0" ? 'text-right' : ''}`}>
            <span className="message-data-time">{props.messageData.timestamp}</span>
            </div>
            <div className={`message ${props.messageData.author === "0" ?'my-message float-right' : 'other-message'}`}> {props.messageData.message} </div>
            </li>
            {/* <li className="clearfix">
            <div className="message-data">
            <span className="message-data-time">10:12 AM, Today</span>
            </div>
            <div className="message other-message">Are we meeting today?</div>
            </li> */}
        </>
    )
}

export default SingleMessageStructure;