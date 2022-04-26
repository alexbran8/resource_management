import React, { useEffect, useState } from 'react'

import { useMutation, useQuery, gql } from "@apollo/client";
import { table } from 'console';






export const DynamicTable = (props) => {

 return (
        <>
            <div className='table-heading'><b>{`${props.userName}`}</b>, please find belore the list with all <i>{props && props.tableToQuery}</i> requests:</div>
            <ul>
                {console.log(props.tableData)}
                {props && props.tableData.map(item => {
                    return <li>{item.date} {item.resource_email} {item.wbs} {item.duration}</li>
                })}
            </ul>
        </>
    )
}