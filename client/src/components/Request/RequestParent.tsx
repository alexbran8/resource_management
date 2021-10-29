import React, { useEffect, useState } from "react";
import Request from "./Request"
import {RequestExtraHours} from "./RequestExtraHours"
import { useSelector, useDispatch } from "react-redux";
import Button from '@material-ui/core/Button';
import "./RequestParent.scss"


export const RequestParent = () => {
    const user = useSelector((state) => ({ auth: state.auth }));

    const [showAdmin, setShowAdmin]  = useState(false)
    const [showExtraHours, setShowExtraHours]  = useState(false)


    return(<div className="request-parent-container">
        <h5><b>{user.auth.name}</b>, please the select type of request which you would like to enter:</h5>
        <section> 
            <Button variant="contained" color="primary" onClick={() =>{setShowAdmin(true);setShowExtraHours(false)}}>Administrative</Button>
            <Button variant="contained" color="secondary" disabled={true}> Operationpmnal</Button>
            <Button variant="contained" color="primary" onClick={() =>{setShowAdmin(false);setShowExtraHours(true)}}>Extra Hours</Button>
        </section>
       {showAdmin === true ? <Request /> : null }
       {showExtraHours === true ? 
       <RequestExtraHours 
       resourceEmail = {user.auth.email}
       /> : null }
    </div>)
}