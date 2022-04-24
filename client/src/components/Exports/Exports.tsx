import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { DynamicTable } from "./DynamicTable";
import "./Exports.scss"

const Exports = () => {
    const user = useSelector((state) => ({ auth: state.auth }));

return (<>
    {user.auth.role == 'L3' ? 
    <>
   
    <DynamicTable 
    userName={user.auth.name}
    // define query as props
    tableToQuery='extra-hours'
    
    //define filter as props
    
    />
    </>
    : 
    null
    }

</>)
}


export default Exports;