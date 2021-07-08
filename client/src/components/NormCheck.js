import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, gql } from "@apollo/client";
import { Table, Container, Row, Col, Checkbox, CardGroup } from 'react-bootstrap'
import { Button } from 'reactstrap'
import "./NormCheck.scss"
import { isNonNullType } from 'graphql';

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
            correction
            Dep
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
    const [capacityItems, setCapacityItems] = useState()
    const [uResources, setuResources] = useState()
    const [uDeps, setuDeps] = useState()
    const [selected, setSelected] = useState(0)
    const { data, loading: get_norms_loading, error: get_norms_error } = useQuery(GET_NORMS, {
        variables: { department: 'radio' }, onCompleted: () => {
            var result = []
            data && data.normCheckQuery && data.normCheckQuery.reduce(function(res, value) {
                if (!res[value.Resource]) {
                  res[value.Resource] = { Resource: value.Resource, qty: 0 };
                  result.push(res[value.Resource])
                }
                res[value.Resource].qty += 1;
                return res;
              }, {});
              setuResources(result)
            const deps = data && data.normCheckQuery && data.normCheckQuery.map(x => x.Dep);
            setuDeps([...new Set(deps)]);
            setCapacityItems(data.normCheckQuery)
        }
    });
    const { data: dataNa, loading, error } = useQuery(GET_NORMS_NA);
    const [sendNotificationsMutation] = useMutation(SEND_NOTIFICATION, {
        onCompleted: (data) => {
            setStatus(data.sendNotifications.message);
            alert(data.sendNotifications.message)
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

    const _onChangeFitler = (e, form) => {
        console.log(e.target.value ? e.target.value : isNonNullType, form)
        console.log(data.normCheckQuery.filter(function(item){
            return item.Resource == e.target.value;
         }));
         e.target.value ? setCapacityItems(data.normCheckQuery.filter(function(item){
            return item.Resource == e.target.value;
         })) : setCapacityItems(data.normCheckQuery)
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
            setSelected(checked.length)
        } else {
            checked.push({
                id: id, date: item.Date, resource: item.Resource, task: item.Task, taskComments: item.taskComments,
                bh: item.billableHours, rh: item.realHour, twc: item.timeWrittingComments, var: item.variation,
                to_email: item.to_email,
                normNok: item.normNOK, normOK: item.normOK, correction: item.correction
            })
            setSelected(checked.length)
        }
    }

    return (
        <div className="mainParent ">
            <h5>Prior to checking the below table please update the files using the following <a target="_blank" href="https://apps.gdceur.eecloud.dynamic.nsn-net.net/tools/">application</a> (soon to be integrated here!!!)</h5>
            <div className="tableHeader">
                <div className="filterContainer">
                    <form
                        className="filter text-center row"
                        onSubmit={(e) => {
                            e.preventDefault();
                            // this.filter(this.state.filter);
                        }}
                    >
                        <>
                        <Button color="primary"
                        disabled={true}
                        onClick={sendNotifications}>Upload files </Button>
                    <Button color="danger"
                        disabled={selected < 1}
                        onClick={sendNotifications}>Send {selected} notification(s) </Button>
                </>
                        <select
                            className="form-control p-2 m-3 col"
                            defaultValue=""
                            onChange={(e) => {_onChangeFitler(e, "resource")
                                //   const lineObj = { ...this.state.filter };
                                //   lineObj.line_manager = e.target.value;
                                //   this.setState({ filter: lineObj });
                            }}
                        >
                            <option value="">All resources</option>
                            {uResources && uResources.map((x) => {
                                return (
                                    <option key={x} value={x.Resource}>
                                        {x.Resource} ({x.qty} tasks)
                                    </option>
                                );
                            })
                            }
                        </select>
                        <select
                            className="form-control p-2 m-3 col"
                            defaultValue=""
                            onChange={(e) => {_onChangeFitler(e, "dep")
                            }}
                        >
                            <option value="">Department</option>
                            {uDeps && uDeps.map((x) => {
                                return (
                                    <option key={x} value={x}>
                                        {x}
                                    </option>
                                );
                            })
                            }
                        </select>
                        <Button color="warning"
                        onClick={sendNotifications}>RESET </Button>     
                    </form>
                </div>
              
                <p>List of tasks reported in Capacity having variance ({data && data.normCheckQuery.length} tasks):</p>

            </div>


            <Table striped bordered hover className="normsTable">

                <thead>
                    <tr>
                        <th>Select</th>
                        <th>
                            Date
                        </th>
                        <th>
                            Engineer
                        </th>
                        <th>
                            Email
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
                            Billable Hours
                        </th>

                        <th>
                            Real Hours
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
                        <th>
                            Possible Correction
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {capacityItems && capacityItems.map((item, index) => {
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
                                <td>{item.correction}</td>
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