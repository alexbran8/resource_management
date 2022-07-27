import React, { useEffect, useState } from 'react'

import { useMutation, useQuery, gql } from "@apollo/client";
import { table } from 'console';






export const DynamicTable = (props) => {

 return (
        <>
            
            <table>
                <tbody>
                {console.log(props.tableData)}
                {props && props.tableData.map(item => {
                    return <tr>
                        <td>{item.upi}</td> 
                        <td>{item.engineer}</td> 
                        <td>{item.type}</td> 
                        <td>{item.week1}</td> 
                        <td>{item.week2}</td> 
                        <td>{item.week3}</td> 
                        <td>{item.week4}</td> 
                        <td>{item.employeer}</td>
                        <td>{item.type}</td>
                    </tr>
                })}
                </tbody>
            </table>
        </>
    )
}