import React, {useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMutation, useQuery, gql } from "@apollo/client";

import { DynamicTable } from "./DynamicTable";
import "./Exports.scss"
const GET_EH = gql`
  query ($department: String) { 
    getExtraHours (department: $department) {
        date
        wbs
        resource_email
        duration
        }
  }
`;
const Exports = () => {
    const user = useSelector((state) => ({ auth: state.auth }));
    const [tableData, setTableData] = useState([])
    const { data, loading: loading, error: error } = useQuery(GET_EH, {
      // variables: { department: 'radio' },
      onCompleted: () => {
        setTableData(data.getExtraHours)

      },
      onError: () => {
          console.log(error)
      }
  })

return (<>
    {user.auth.role == 'L3' ? 
    <>
   
    <DynamicTable 
    userName={user.auth.name}
    // define query as props
    tableToQuery='extra-hours'
    tableData={tableData}
    
    //define filter as props
    
    />
    </>
    : 
    null
    }

</>)
}


export default Exports;