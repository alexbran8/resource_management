import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery, gql } from "@apollo/client";
import { Table, Container, Row, Col, Checkbox, CardGroup, FormGroup } from 'react-bootstrap'
import { Button } from 'reactstrap'
import "./NormCheck.scss"
import { isNonNullType } from 'graphql';


import {UploadModal} from "./FileUpload"

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
  mutation ($data: [Norms], $data2: [capacityLawsonInput] $data3: [commentsCheckInput]) {
    sendNotifications (data:$data, data2:$data2 data3:$data3){
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

const GET_COMMENTS_CHECK = gql`
query($department: String!) {
    commentsCheckQuery (department: $department)  {
        uid
        Dep
        Date
        Resource
        to_email
        Task
        taskComments
        timeWrittingComments
        result
        
}}
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
    const [scrolling, setScrolling] = useState(false);
    const [scrollTop, setScrollTop] = useState(0);
    const [selectAllCapNorms, setSelectAllCapNorms] = useState(false);
    const [selectAllLawsonCapacity, setSelectAllLawsonCapacity] = useState(false);
    const [selectAllCommentsCheck, setSelectAllCommentsCheck] = useState(false);
    const [showC1, setShowC1] = useState(true);
    const [showC2, setShowC2] = useState(false);
    const [showC3, setShowC3] = useState(false);
    const [showC4, setShowC4] = useState(false);
    const [checked, setChecked] = useState([])
    const [checkedLC, setCheckedLC] = useState([])
    const [checkedCC, setCheckedCC] = useState([])
    const [status, setStatus] = useState('')
    const [capacityItems, setCapacityItems] = useState([])
    const [capLawsonItems, setCapLawsonItems] = useState([])
    const [commentsCheck, setCommentsCheck] = useState([])
    const [showModal, setShowModal] = useState<boolean>(false)
    const [style, setStyle] = useState({
        style: {
            logoHeight: 200
        }
    })
    const [uResources, setuResources] = useState([])
    const [uDeps, setuDeps] = useState([])
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
            setuResources(result3)
            setCapLawsonItems(dataLC.capacityLawsonQuery)
        }
    });
    const { data: dataCC, loadingCC, errorCC } = useQuery(GET_COMMENTS_CHECK, {
        variables: { department: 'radio' }, onCompleted: () => {
            var result = []
            console.log(dataCC)
            dataCC && dataCC.commentsCheckQuery.reduce(function (res, value) {
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
            setuResources(result3)
            setCommentsCheck(dataCC.commentsCheckQuery)
        }
    });
    const [sendNotificationsMutation] = useMutation(SEND_NOTIFICATION, {
        onCompleted: (data) => {
            setStatus(data.sendNotifications.message);
            alert(data.sendNotifications.message)
        },
        onError: (error) => { console.error("Error creating a post", error); alert("Error creating a post request " + error.message) },
    });

    const sendNotifications = () => {
        if (checked.length > 0 || checkedLC.length > 0 || checkedCC.length > 0) {
            sendNotificationsMutation({
                variables: {
                    data: checked,
                    data2: checkedLC,
                    data3: checkedCC
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
        e.target.value ? setCommentsCheck(dataCC.commentsCheckQuery.filter(function (item) {
            return item.Resource == e.target.value;
        })) : setCommentsCheck(dataCC.commentsCheckQuery)
    };

    const _onChangeRowCheckbox = data => {
        const newRow = data[data.index].id;
        checked.includes(newRow)
            ? setChecked(old => old.filter(row => row !== newRow))
            : setChecked(old => [...old, newRow]);
    };

    const createArr = (uid, item) => {
        if (item.to_email) {
            if (checked.find((y) => y.uid == item.uid)) {
                // checked.find((y) => checked.splice(y, 1))
                checked.splice(checked.findIndex(function (i) {
                    return i.uid === uid;
                }), 1);
                setSelected(checkedLC.length + checked.length)
            } else {

                checked.push({
                    type: 'norms',
                    uid: uid, date: item.Date, resource: item.Resource, task: item.Task, taskComments: item.taskComments,
                    bh: item.billableHours, rh: item.realHour, twc: item.timeWrittingComments, var: item.variation,
                    to_email: item.to_email,
                    normNok: item.normNOK, normOK: item.normOK, correction: item.correction
                })
                setSelected(checkedLC.length + checked.length)
            }
        }
        else {
            alert("please check database. entry has no email")
        }
    }

    const reset = () => {
        setChecked([{}])
        setSelected(0)
        setCheckedLC([{}])

    }

    const handler = () => {
        var fontSize = '100%';
        let scrollTop = window.scrollY,
            minHeight = 100,
            logoHeight = Math.max(minHeight, 300 - scrollTop);
        logoHeight == 100 ? fontSize = '75%' : fontSize = '100%';
        setStyle({
            logoHeight: logoHeight,
            fontSize: fontSize
        });

    }

    useEventListener("scroll", handler);


    const createArrLC = (uid, item) => {
        if (item.to_email) {
            if (checkedLC.find((y) => y.uid == uid)) {
                checkedLC.splice(checkedLC.findIndex(function (i) {
                    return i.uid === uid;
                }), 1);
                setSelected(checkedLC.length + checked.length)
            } else {
                checkedLC.push({
                    type: 'lawson-capacity',
                    uid: uid,
                    date: item.Date,
                    resource: item.Resource,
                    bh: item.billableHours,
                    rh: item.realHour,
                    wbsCustomer: item.wbsCustomer,
                    workFolderCode: item.workFolderCode,
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
        else {
            alert("please check database. entry has no email")
        }
    }
    const createArrCC = (uid, item) => {
        if (item.to_email) {
            if (checkedCC.find((y) => y.uid == uid)) {
                checkedCC.splice(checkedCC.findIndex(function (i) {
                    return i.uid === uid;
                }), 1);
                setSelected(checkedCC.length + checked.length)
            } else {
                checkedCC.push({
                    uid: uid,
                    date: item.Date,
                    to_email: item.to_email,
                    resource: item.Resource,
                    comments: item.taskComments,
                    twc: item.timeWrittingComments,
                    task: item.Task,
                    // bh: item.billableHours,
                    // rh: item.realHour,
                    // wbsCustomer: item.wbsCustomer,
                    // workFolderCode: item.workFolderCode,
                    // sumCapacity: item.sumCapacity,
                    // sumLawson: item.sumLawson,
                    // wbsCheck: item.wbsCheck,
                    // var: item.variation,
                    // to_email: item.to_email,
                    result: item.result,
                    // status: item.status
                })
                setSelected(checkedLC.length + checked.length + + checkedCC.length)
            }
        }
        else {
            alert("please check database. entry has no email")
        }
    }


    const updateCapacityNormsComments = (uid, comment) => {
        const newChecked = [...checked]
        newChecked.find((y) => y.uid == uid).correction = comment
        setChecked(newChecked)
    }
    const updateCapacitLawsonComments = (uid, comment) => {
        const newChecked = [...checkedLC]
        checkedLC.find((y) => y.uid == uid).correction = comment
        setChecked(newChecked)
    }
    const updateCapacitCommentsCheck = (uid, comment) => {
        const newChecked = [...checkedCC]
        newChecked.find((y) => y.uid == uid).result = comment
        setCheckedCC(newChecked)
    }

    const selectAll = (table) => {
        if (table === 'norms_capacity') {
            setSelectAllCapNorms(!selectAllCapNorms)
            capacityItems.forEach(x => { createArr(x.uid, x) })
        }
        if (table === 'lawson_capacity') {
            setSelectAllLawsonCapacity(!selectAllLawsonCapacity)
            capLawsonItems.forEach(x => { createArrLC(x.uid, x) })
        }
        if (table === 'comments_check') {
            setSelectAllCommentsCheck(!selectAllCommentsCheck)
            commentsCheck.forEach(x => { createArrCC(x.uid, x) })
        }

    }

    const toggleUploadModal = () => {
        setShowModal(!showModal)
    }


    return (
        <div className="main">
            <div className="tableHeader">
                <div className="filterContainer">
                    <form
                        // className="filter text-center row"
                        onSubmit={(e) => {
                            e.preventDefault();
                            // this.filter(this.state.filter);
                        }}
                    >
                        <>
                        {showModal ? 
                        <UploadModal
                        handleModal={toggleUploadModal}
                         /> : null}
                            {/* FIXME:  make upload button inline*/}
                            <Button color="primary"
                                disabled={false}
                                onClick={toggleUploadModal}>Upload files</Button>
                            <Button color="danger"
                                disabled={selected < 1}
                                onClick={sendNotifications}>Send {selected} notification(s)</Button>
                        </>
                        <select
                            // className="form-control col"
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
                            // className="form-control p-2 m-3 col"
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
                        <Button color={!showC1 ? "secondary" : "primary"} onClick={() => { setShowC1(!showC1); setShowC2(false); setShowC3(false); setShowC4(false) }}>Capacity vs Norms ({capacityItems && capacityItems.length}) </Button>
                        <Button color={!showC2 ? "secondary" : "primary"} onClick={() => { setShowC2(!showC2); setShowC1(false); setShowC3(false); setShowC4(false) }}>Capacity vs Lawson ({capLawsonItems && capLawsonItems.length}) </Button>
                        <Button color={!showC3 ? "secondary" : "primary"} onClick={() => { setShowC3(!showC3); setShowC1(false); setShowC2(false); setShowC4(false) }}>Capacity Comments Check ({commentsCheck && commentsCheck.length}) </Button>
                        <Button disabled={true} color="secondary" onClick={() => { setShowC4(!showC4); setShowC1(false);; setShowC2(false);; setShowC3(false) }}>Capacity vs NPT </Button>
                    </form>
                </div>

                <div className='reportingConatiner' style={{ height: style.logoHeight, fontSize: style.fontSize }}>
                    <div className="left-container">RIGHT container</div>
                    <div className="right-container"><h5 style={{ fontSize: style.fontSize }}>Selected items:</h5>
                        <ul>
                            {checked && checked.map(item => <li key={item.uid}>{item.to_email}, {item.date}, {item.correction}</li>)}
                            {checkedLC && checkedLC.map(item => <li key={item.uid}>{item.to_email}, {item.date}, {item.correction}</li>)}
                            {checkedCC && checkedCC.map(item => <li key={item.uid}>{item.to_email}, {item.date}, {item.result}</li>)}
                        </ul>
                    </div>

                </div>
            </div>


            <div className='selectable-containers'>
                {showC1 ? <div className="c1">
                    <Table striped bordered hover responsive="xl" className="norms-check-table">
                        <thead >
                            <tr>
                                <th>Select <input
                                    type="checkbox"
                                    checked={selectAllCapNorms}
                                    onChange={(e) => selectAll('norms_capacity')}
                                /></th>
                                <th>
                                    Date
                                </th>
                                <th>
                                    Engineer
                                </th>
                                <th>
                                    WBS
                                </th>
                                <th>
                                    Capacity
                                </th>
                                <th >
                                    Comments
                                </th>
                                <th >
                                    TWC
                                </th>
                                <th>
                                    BH
                                </th>

                                <th>
                                    RH
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
                                            checked={checked.find((y) => y.uid == item.uid) ? true : false}
                                            onChange={(e) => createArr(item.uid, item)}
                                        /></td>
                                        <td>{item.Date}</td>
                                        <td>{item.Resource}</td>
                                        <td>{item.wbsCustomer}</td>
                                        <td>{item.Task}</td>
                                        <td><span title={item.taskComments}>{item.taskComments.substring(0, 10)}</span> </td>
                                        <td><span title={item.timeWrittingComments}>{item.timeWrittingComments.substring(0, 10)}</span>  </td>
                                        <td>{item.billableHours}</td>
                                        <td>{item.realHour}</td>
                                        <td>{item.normOK}</td>
                                        <td>{item.normNOK}</td>
                                        <td>{item.status}</td>
                                        <td>{item.variation}</td>
                                        <td className="cellTextArea">
                                            <textarea
                                                rows={2}
                                                defaultValue={item.correction || 'please check'}
                                                disabled={checked.find((y) => y.uid == item.uid) ? false : true}
                                                onChange={(e) => updateCapacityNormsComments(item.uid, e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>

                </div> : null}
                {showC2 ? <div className="c2">
                    <Table striped bordered hover className="normsTable">

                        <thead >
                            <tr>
                                <th>Select <p><input
                                    type="checkbox"
                                    checked={selectAllLawsonCapacity}
                                    onChange={(e) => selectAll('lawson_capacity')}
                                /></p></th>
                                <th>
                                    Date
                                </th>
                                <th>
                                    Engineer
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
                                            checked={checkedLC.find((y) => y.uid == item.uid) ? true : false}
                                            onChange={(e) => createArrLC(item.uid, item)}
                                        /></td>
                                        <td>{item.Date}</td>
                                        <td>{item.Resource}</td>
                                        <td>{item.wbsCustomer}</td>
                                        <td>{item.workFolderCode}</td>
                                        <td>{item.wbsCheck}</td>
                                        <td>{item.sumCapacity}</td>
                                        <td>{item.sumLawson}</td>
                                        <td>{item.variation}</td>
                                        <td>
                                            <textarea
                                                // rows={2}
                                                defaultValue={item.correction}
                                                disabled={checkedLC.find((y) => y.uid == item.uid) ? false : true}
                                                onChange={(e) => updateCapacitLawsonComments(item.uid, e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table></div> : null}
                {showC3 ? <div className="c3">
                    <Table striped bordered hover className="normsTable">

                        <thead>
                            <tr>
                                <th>Select <p><input
                                    type="checkbox"
                                    checked={selectAllCommentsCheck}
                                    onChange={(e) => selectAll('comments_check')}
                                /></p></th>
                                <th>
                                    Date
                                </th>
                                <th>
                                    Engineer
                                </th>
                                <th>
                                    Task
                                </th>
                                <th>
                                    Comments
                                </th>
                                <th>
                                    Time Writting Comments
                                </th>
                                <th>
                                    Result
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {commentsCheck && commentsCheck.map((item, index) => {
                                return (
                                    <tr key={item.uid}>
                                        <td> <input
                                            type="checkbox"
                                            checked={checkedCC.find((y) => y.uid == item.uid) ? true : false}
                                            onChange={(e) => createArrCC(item.uid, item)}
                                        /></td>
                                        <td>{item.Date}</td>
                                        <td>{item.Resource}</td>
                                        <td>{item.Task}</td>
                                        <td>{item.taskComments}</td>
                                        <td>{item.timeWrittingComments}</td>
                                        <td>
                                            <textarea
                                                rows={2}
                                                disabled={checkedCC.find((y) => y.uid == item.uid) ? false : true}
                                                defaultValue={item.result || "please check comments"}
                                                onChange={(e) => updateCapacitCommentsCheck(item.uid, e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table></div> : null}
                {showC4 ? <div className="c4">C4</div> : null}
            </div>





        </div>
    )
}

export default NormCheck

// Hook
function useEventListener(eventName, handler, element = window) {
    // Create a ref that stores handler
    const savedHandler = useRef();
    // Update ref.current value if handler changes.
    // This allows our effect below to always get latest handler ...
    // ... without us needing to pass it in effect deps array ...
    // ... and potentially cause effect to re-run every render.
    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);
    useEffect(
        () => {
            // Make sure element supports addEventListener
            // On
            const isSupported = element && element.addEventListener;
            if (!isSupported) return;
            // Create event listener that calls handler function stored in ref
            const eventListener = (event) => savedHandler.current(event);
            // Add event listener
            element.addEventListener(eventName, eventListener);
            // Remove event listener on cleanup
            return () => {
                element.removeEventListener(eventName, eventListener);
            };
        },
        [eventName, element] // Re-run if eventName or element changes
    );
}