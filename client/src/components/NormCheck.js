import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, gql } from "@apollo/client";
import { Table, Container, Row, Col, Checkbox, CardGroup } from 'react-bootstrap'
import { Button } from 'reactstrap'
import "./NormCheck.scss"
import { isNonNullType } from 'graphql';

const GET_NORMS = gql`
  query ($department: String!) { 
    normCheckQuery (department: $department) {
        uid
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
  mutation ($data: [Norms], $data2: [capacityLawsonInput]) {
    sendNotifications (data:$data, data2:$data2){
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
const GET_CAPACITY_LAWSON = gql`
  query ($department: String!) {
    capacityLawsonQuery  (department: $department) {
        uid
        Dep
        Date
        Resource
        UPI
        to_email
        wbsCustomer
        workFolderCode
        wbsCheck
        sumCapacity
        sumLawson
        variation
        correction
    }
  }
`;

const NormCheck = () => {
    const [checked, setChecked] = useState([])
    const [checkedLC, setCheckedLC] = useState([])
    const [status, setStatus] = useState()
    const [capacityItems, setCapacityItems] = useState()
    const [capLawsonItems, setCapLawsonItems] = useState()
    const [uResources, setuResources] = useState()
    const [uDeps, setuDeps] = useState()
    const [selected, setSelected] = useState(0)
    const { data, loading: get_norms_loading, error: get_norms_error } = useQuery(GET_NORMS, {
        variables: { department: 'radio' }, onCompleted: () => {
            var result = []
            data && data.normCheckQuery && data.normCheckQuery.reduce(function (res, value) {
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
    const { data: dataLC, loading, error } = useQuery(GET_CAPACITY_LAWSON, {
        variables: { department: 'radio' }, onCompleted: () => {
            var result = []
            dataLC && dataLC.capacityLawsonQuery.reduce(function (res, value) {
                if (!res[value.Resource]) {
                    res[value.Resource] = { Resource: value.Resource, qty: 0 };
                    result.push(res[value.Resource])
                }
                res[value.Resource].qty += 1;
                return res;
            }, {});
            var result2 = [...uResources, ...result]
            var result3 = []
            result2.reduce(function (res, value) {
                if (!res[value.Resource]) {
                    res[value.Resource] = { Resource: value.Resource, qty: 0 };
                    result3.push(res[value.Resource])
                }
                res[value.Resource].qty += value.qty;
                return res;
            }, {});
            console.log(result3)
            setuResources(result3)
            setCapLawsonItems(dataLC.capacityLawsonQuery)
        }
    });
    const [sendNotificationsMutation] = useMutation(SEND_NOTIFICATION, {
        onCompleted: (data) => {
            setStatus(data.sendNotifications.message);
            alert(data.sendNotifications.message)
        },
        onError: (error) => {console.error("Error creating a post", error); alert("Error creating a post request " + error.message)},
    });

    const sendNotifications = () => {
        if (checked.length > 0 || checkedLC.length > 0) {
            sendNotificationsMutation({
                variables: {
                    data: checked,
                    data2: checkedLC
                }
            }
            )
        }
        else { alert("please select some tasks...") }
    }

    const _onChangeFitler = (e, form) => {
        // console.log(e.target.value ? e.target.value : isNonNullType, form)
        // console.log(data.normCheckQuery.filter(function(item){
        //     return item.Resource == e.target.value;
        //  }));
        e.target.value ? setCapacityItems(data.normCheckQuery.filter(function (item) {
            return item.Resource == e.target.value;
        })) : setCapacityItems(data.normCheckQuery)
        e.target.value ? setCapLawsonItems(dataLC.capacityLawsonQuery.filter(function (item) {
            return item.Resource == e.target.value;
        })) : setCapLawsonItems(dataLC.capacityLawsonQuery)
    };

    const _onChangeRowCheckbox = data => {
        const newRow = data[data.index].id;
        checked.includes(newRow)
            ? setChecked(old => old.filter(row => row !== newRow))
            : setChecked(old => [...old, newRow]);
    };

    const createArr = (uid, item) => {
        if (checked.find((y) => y.uid == uid)) {
            checked.find((y) => checked.splice(y, 1))
            setSelected(checkedLC.length + checked.length)
        } else {
            checked.push({
                type:'norms',
                uid: uid, date: item.Date, resource: item.Resource, task: item.Task, taskComments: item.taskComments,
                bh: item.billableHours, rh: item.realHour, twc: item.timeWrittingComments, var: item.variation,
                to_email: item.to_email,
                normNok: item.normNOK, normOK: item.normOK, correction: item.correction
            })
            setSelected(checkedLC.length + checked.length)
        }
    }

    const createArrLC = (uid, item) => {
        if (checkedLC.find((y) => y.uid == uid)) {
            checkedLC.find((y) => checkedLC.splice(y, 1))
            setSelected(checkedLC.length + checked.length)
        } else {
            checkedLC.push({
                type:'lawson-capacity',
                uid: uid,
                date: item.Date,
                resource: item.Resource,
                bh: item.billableHours,
                rh: item.realHour,
                wbsCustomer:item.wbsCustomer,
                workFolderCode:item.workFolderCode,
                sumCapacity: item.sumCapacity,
                sumLawson: item.sumLawson,
                wbsCheck: item.wbsCheck,
                var: item.variation,
                to_email: item.to_email,
                correction: item.correction,
                // status: item.status
            })
            setSelected(checkedLC.length + checked.length)
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
                            onChange={(e) => {
                                _onChangeFitler(e, "resource")
                                //   const lineObj = { ...this.state.filter };
                                //   lineObj.line_manager = e.target.value;
                                //   this.setState({ filter: lineObj });
                            }}
                        >
                            <option value="">All resources</option>
                            {uResources && uResources.map((x, index) => {
                                return (
                                    <option key={x + index} value={x.Resource}>
                                        {x.Resource} ({x.qty} tasks)
                                    </option>
                                );
                            })
                            }
                        </select>
                        <select
                            className="form-control p-2 m-3 col"
                            defaultValue=""
                            onChange={(e) => {
                                _onChangeFitler(e, "dep")
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

                <div className='reportingConatiner'>
                    Reporting Container
                </div>
                <p>List of tasks reported in Capacity having variance ({capacityItems && capacityItems.length} tasks):</p>
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
                            <tr key={item.uid}>
                                <td> <input
                                    type="checkbox"
                                    defaultChecked={checked.find((y) => y.uid == item.uid)? true: false}
                                    onChange={(e) => createArr(item.uid, item)}
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
                LAWSON VS. CAPACITY
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
                                WBS Capacity
                            </th>
                            <th>
                                WFC Lawson
                            </th>
                            <th>
                                WBS Check
                            </th>
                            <th>
                                sumCapacity
                            </th>
                            <th>
                                sumLawson
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
                        {capLawsonItems && capLawsonItems.map((item, index) => {
                            return (
                                <tr key={item.uid}>
                                    <td> <input
                                        type="checkbox"
                                        defaultChecked={checkedLC.find((y) => y.uid == item.uid)? true: false}
                                        onChange={(e) => createArrLC(item.uid, item)}
                                    /></td>
                                    <td>{item.Date}</td>
                                    <td>{item.Resource}</td>
                                    <td>{item.to_email}</td>
                                    <td>{item.wbsCustomer}</td>
                                    <td>{item.workFolderCode}</td>
                                    <td>{item.wbsCheck}</td>
                                    <td>{item.sumCapacity}</td>
                                    <td>{item.sumLawson}</td>
                                    <td>{item.variation}</td>
                                    <td>{item.correction}</td>
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