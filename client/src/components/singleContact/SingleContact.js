
const SingleContact = (props) => {

    return (
        <>
            <li className={`clearfix ${props.isActive === props.conatct_details.id ? 'active' : ''}`} onClick = {() => {props.handleClick(props.conatct_details.id)}}>
            <img src={props.conatct_details.image} alt="avatar"/>
            <div className="about">
            <div className="name">{props.conatct_details.name}</div>
            <div className="status"> <i className="fa fa-circle online"></i> {props.conatct_details.lastSeen} </div>
            </div>
            </li>
        </>
    )
}

export default SingleContact