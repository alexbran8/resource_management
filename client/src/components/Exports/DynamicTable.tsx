import React, { useEffect, useState } from 'react'

import { useMutation, useQuery, gql } from "@apollo/client";
import { table } from 'console';






export const DynamicTable = (props) => {

 return (
        <div>
            <h6>{props.tableData[0] && props.tableData[0].employeer + '-'+ props.tableData[0].type}</h6>    
            <table className="grid-child" id='approval-table'>
            
                <thead>
                    <tr>
                        <th>UPI</th>
                        <th>Employee Name</th>
                        <th>Activity</th>
                        <th>WEEK 1</th>
                        <th>WEEK 2</th>
                        <th>WEEK 3</th>
                        <th>WEEK 4</th>
                    </tr>
                </thead>
                <tbody>
                {props && props.tableData.map(item => {
                    return <tr>
                        <td>{item.upi}</td> 
                        <td>{item.engineer}</td> 
                        <td>Check KPI/Coupure - Bytel Project</td> 
                        <td>{item.week1}</td> 
                        <td>{item.week2}</td> 
                        <td>{item.week3}</td> 
                        <td>{item.week4}</td> 
                    </tr>
                })}
                </tbody>
            </table>
        </div>
    )
}