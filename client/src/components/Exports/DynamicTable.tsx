import React, { useEffect, useState } from 'react'

import { useMutation, useQuery, gql } from "@apollo/client";
import { table } from 'console';






export const DynamicTable = (props) => {

 return (
        <>
            
            <table className="grid-child">
                <thead>
                    <tr>
                        <td>UPI</td>
                        <td>Employee Name</td>
                        <td>Activity</td>
                        <td>WEEK 1</td>
                        <td>WEEK 2</td>
                        <td>WEEK 3</td>
                        <td>WEEK 4</td>
                        <td>EMPLOYEER</td>
                        <td>TYPE</td>
                    </tr>
                </thead>
                <tbody>
                {console.log(props.tableData)}
                {props && props.tableData.map(item => {
                    return <tr>
                        <td>{item.upi}</td> 
                        <td>{item.engineer}</td> 
                        <td>Check KPI/Coupure - Bytel Project</td> 
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