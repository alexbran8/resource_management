import React, { useEffect, useState } from 'react'

import { useMutation, useQuery, gql } from "@apollo/client";
import { table } from 'console';






export const DynamicTable = (props) => {
const copyTable = (tableNo) => {
    const elTable = document.querySelector(`.table${tableNo}`);
    
    let range, sel;
    
    // Ensure that range and selection are supported by the browsers
    if (document.createRange && window.getSelection) {
    
      range = document.createRange();
      sel = window.getSelection();
      // unselect any element in the page
      sel.removeAllRanges();
    
      try {
        range.selectNodeContents(elTable);
        sel.addRange(range);
      } catch (e) {
        range.selectNode(elTable);
        sel.addRange(range);
      }
    
      document.execCommand('copy');
    }
    
    sel.removeAllRanges();
    
    console.log('Element Copied! Paste it in a file')
}
 return (
        <div>
            <button onClick={()=>{copyTable(props.no)}}>Copy {props.tableData[0] && props.tableData[0].employeer + '-'+ props.tableData[0].type}</button>
            <table className={`grid-child table${props.no}`} id="approval-table">
            
                <thead>
                    <tr>
                        <th>UPI</th>
                        <th>Employee Name</th>
                        <th>Activity</th>
                        <th>WEEK {props.weeks[0]}</th>
                        <th>WEEK {props.weeks[1]}</th>
                        <th>WEEK {props.weeks[2]}</th>
                        <th>WEEK {props.weeks[3]}</th>
                        <th>WEEK {props.weeks[4]}</th>
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
                        <td>{item.week5}</td> 
                    </tr>
                })}
                </tbody>
            </table>
        </div>
    )
}