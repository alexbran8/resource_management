import React from 'react'

import { useMutation, useQuery, gql } from "@apollo/client";

const GET_EH = gql`
  query ($department: String) { 
    getExtraHours (department: $department) {
        date
        wbs
    }
  }
`;
export const DynamicTable = (props) => {

    const { data, loading: loading, error: error } = useQuery(GET_EH, {
        // variables: { department: 'radio' },
        onCompleted: () => {
            console.log({data})
        },
        onError: () => {
            console.log(error)
        }
    });

    return (
        <>
            <div className='table-heading'><b>{`${props.userName}`}</b>, please find belore the list with all <i>{props && props.tableToQuery}</i> requests:</div>
        </>
    )
}