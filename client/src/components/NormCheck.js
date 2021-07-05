import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, gql } from "@apollo/client";
import { Table, Container, Row, Col, Checkbox, CardGroup } from 'react-bootstrap'
import { Button } from 'reactstrap'
import "./NormCheck.scss"

const GET_NORMS = gql`
  query ($department: String!) { 
    normCheckQuery (department: $department) {
            Date 
            Resource 
            to_email
            wbsCustomer 
            Task
            taskComments
            timeWrittingComments
              billableHours
              realHour
              normOK
              normNOK
              status
            variation
    }
  }
`;

const SEND_NOTIFICATION = gql`
  mutation ($data: [Norms]) {
    sendNotifications (data:$data){
        success
        message
      }
  }
`;

const GET_NORMS_NA = gql`
  query {
    normCheckQueryNA {
            Date 
            Resource 
            wbsCustomer 
            Task
            taskComments
            timeWrittingComments
              billableHours
              realHour
              normOK
              normNOK
              status
            variation
    }
  }
`;

const NormCheck = () => {
    const [checked, setChecked] = useState([])
    const [status, setStatus] = useState()
    const [selected, setSelected] = useState()
    const { data, loading: get_norms_loading, error: get_norms_error } = useQuery(GET_NORMS, {variables: {department: 'radio'}});
    const { data: dataNa, loading, error } = useQuery(GET_NORMS_NA);
    const [sendNotificationsMutation] = useMutation(SEND_NOTIFICATION, {
        onCompleted: (data) => {
            setStatus(data.sendNotifications.message);
            alert(data.sendNotifications.message)
            console.log(data.sendNotifications.success)
        },
        onError: (error) => console.error("Error creating a post", error),
    });


    const sendNotifications = () => {
        if (checked.length > 0) {
            sendNotificationsMutation({
                variables: {
                    data: checked
                }
            }
            )
        }
        else { alert("please select some tasks...") }
    }

    const _onChangeHeaderCheckbox = data => {
        data.checked ? setChecked(data.map(row => row.id)) : setChecked([]);
    };

    const _onChangeRowCheckbox = data => {
        const newRow = data[data.index].id;
        checked.includes(newRow)
            ? setChecked(old => old.filter(row => row !== newRow))
            : setChecked(old => [...old, newRow]);
    };

    const createArr = (id, item) => {
        if (checked.find((y) => y.id == id)) {
            checked.find((y) => checked.splice(y, 1))
        } else {
            checked.push({ id: id, date: item.Date, resource: item.Resource, task: item.Task, taskComments: item.taskComments, 
                bh: item.billableHours, rh: item.realHour, twc: item.timeWrittingComments, var: item.variation,
                to_email: item.to_email,
                normNok: item.normNOK, normOK:item.normOK
             })
            setSelected(checked.length)
        }
    }

    return (
        <div>
            <div className="tableHeader">
                Prior to checking the below table please update the files using the following <a target="_blank" href="https://apps.gdceur.eecloud.dynamic.nsn-net.net/tools/">application</a> (soon to be integrated here!!!)
                <div>
                    <>
                        <Button color="danger" onClick={sendNotifications}>Send notifications</Button>
                    </>
                </div>
                List of Norms having variance ({data && data.normCheckQuery.length} tasks, out of which  {selected} selected for notification):
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>
                            Date
                        </th>
                        <th>
                            Resource Name
                        </th>
                        <th>
                            Notification Email
                        </th>
                        <th>
                            WBS
                        </th>
                        <th>
                            Capacity
                        </th>
                        <th>
                            Comments
                        </th>
                        <th>
                            TWC
                        </th>
                        <th>
                            Real Hours
                        </th>

                        <th>
                            Billable Hours
                        </th>

                        <th>
                            NORM OK
                        </th>
                        <th>
                            NORM NOK
                        </th>
                        <th>
                            Status
                        </th>
                        <th>
                            Variation
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.normCheckQuery && data.normCheckQuery.map((item, index) => {
                        return (
                            <tr key={item.index}>
                                <td> <input
                                    type="checkbox"
                                    onChange={(e) => createArr(index, item)}
                                /></td>
                                <td>{item.Date}</td>
                                <td>{item.Resource}</td>
                                <td>{item.to_email}</td>
                                <td>{item.wbsCustomer}</td>
                                <td>{item.Task}</td>
                                <td>{item.taskComments}</td>
                                <td>{item.timeWrittingComments}</td>
                                <td>{item.billableHours}</td>
                                <td>{item.realHour}</td>
                                <td>{item.normOK}</td>
                                <td>{item.normNOK}</td>
                                <td>{item.status}</td>
                                <td>{item.variation}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
            <div>
                List of Norms having N/A Status
                <Table striped bordered hover>

                    <tbody>
                        {dataNa && dataNa.normCheckQueryNA && dataNa.normCheckQueryNA.map((item, index) => {
                            return (
                                <tr key={item.index}>
                                    <td>{item.Date}</td>
                                    <td>{item.Resource}</td>
                                    <td>{item.wbsCustomer}</td>
                                    <td>{item.Task}</td>
                                    <td>{item.taskComments}</td>
                                    <td>{item.timeWrittingComments}</td>
                                    <td>{item.billableHours}</td>
                                    <td>{item.realHour}</td>
                                    <td>{item.normOK}</td>
                                    <td>{item.normNOK}</td>
                                    <td>{item.status}</td>
                                    <td>{item.variation}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default NormCheck