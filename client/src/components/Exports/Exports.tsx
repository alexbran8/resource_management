import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMutation, useQuery, gql } from "@apollo/client";

import { DynamicTable } from "./DynamicTable";
import "./Exports.scss"
import { apiclient } from "../../";
import { useEffect } from "react";

const GET_EH = gql`
  query ($department: String, $type: String, $employeer: String, $month:Int, $year: Int) { 
    getExtraHours (department: $department type: $type, employeer: $employeer, month:$month, year:$year) {
      upi
      engineer
      department
      week1
      week2
      week3
      week3
      week4
      week5
      employeer
      type
        }
  }
`;

const Exports = () => {
  const user = useSelector((state) => ({ auth: state.auth }));
  const [tableData, setTableData] = useState([])
  const [tableData2, setTableData2] = useState([])
  const [tableData3, setTableData3] = useState([])
  const [tableData4, setTableData4] = useState([])
  const [tableData5, setTableData5] = useState([])
  const [tableData6, setTableData6] = useState([])
  const [data1, setData1] = useState()

  const weeks = ['27', '28', '29', '30', '31']
  // const { data, loading: loading, error: error } = useQuery(GET_EH, {
  //   // variables: { department: 'radio' },
  //   onCompleted: () => {

  //     // getData
  //     setTableData(data.getExtraHours)

  //     // groupData


  //   },
  //   onError: () => {
  //     console.log(error)
  //   }
  // })

  const getWeek = (date) => {

    const currentdate = new Date(date);
    var oneJan = new Date(currentdate.getFullYear(), 0, 1);
    var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
    var result = Math.ceil((currentdate.getDay() +7 + numberOfDays) / 7);
    return((result - 1 + '-' + currentdate.getFullYear()))
    // setSelectedWeek(result - 1 + '-' + currentdate.getFullYear())

  }

  useEffect(() => {
    getData1()
      .then(res => getData2())
      .then(res => getData3())
      .then(res => getData4())
      .then(res => getData5())
      .then(res => getData6())
    //  then(
    //  res => getData2()
    //  ).then (   getData3())
    //  .then(
    //  getData4()
    //  )
    //  getData5();
    //  getData6();
    //  .then(res => {getData2()} )
    //  .then(res => {getData3()})

  }, [])

  const getData1 = async () => {
    await apiclient.query({
      query: GET_EH,
      variables: { type: `'On Call'`, employeer: `'Deltatel'` }
    }).then(data => {
      console.log(data)
      setTableData(data.data.getExtraHours)
    }
    )
  }

  const getData2 = async () => {
    let data = await apiclient.query({
      query: GET_EH,
      variables: { type: `'Hotline'`, employeer: `'Deltatel'` }
    })
    setTableData2(data.data.getExtraHours)
  }
  const getData3 = async () => {
    await apiclient.query({
      query: GET_EH,
      variables: { type: `'Hotline'`, employeer: `'Connect 44'` }
    }).then(data => { setTableData3(data.data.getExtraHours) })
  }

  const getData4 = async () => {
    await apiclient.query({
      query: GET_EH,
      variables: { type: `'On Call'`, employeer: `'Connect 44'` }
    }).then(data => { setTableData4(data.data.getExtraHours); console.log(data) })
  }
  const getData5 = async () => {
    let data = await apiclient.query({
      query: GET_EH,
      variables: { type: `'Hotline'`, employeer: `'SII'` }
    })
    setTableData5(data.data.getExtraHours)
  }
  const getData6 = async () => {
    let data = await apiclient.query({
      query: GET_EH,
      variables: { type: `'On Call'`, employeer: `'SII'` }
    })
    setTableData6(data.data.getExtraHours)
  }


  return (<>
    {user.auth.role == 'L3' ?
      <>
        <div className='table-heading'><b>{`${user.auth.name}`}</b>, please find belore the list with all requests:</div>
        <div className='grid'>
          <DynamicTable
            weeks={weeks}
            no={1}
            className="grid-child"
            userName={user.auth.name}
            // define query as props
            tableToQuery='extra-hours'
            tableData={tableData}

          //define filter as props

          />

          <DynamicTable
            weeks={weeks}
            no={2}
            className="grid-child"
            userName={user.auth.name}
            // define query as props
            tableToQuery='extra-hours'
            tableData={tableData2}

          //define filter as props

          />

          <DynamicTable
            weeks={weeks}
            no={3}
            className="grid-child"
            userName={user.auth.name}
            // define query as props
            tableToQuery='extra-hours'
            tableData={tableData3}

          //define filter as props

          />

          <DynamicTable
            weeks={weeks}
            no={4}
            userName={user.auth.name}
            // define query as props
            tableToQuery='extra-hours'
            tableData={tableData4}

          //define filter as props

          />

          <DynamicTable
            weeks={weeks}
            no={5}
            className="grid-child"
            userName={user.auth.name}
            // define query as props
            tableToQuery='extra-hours'
            tableData={tableData5}

          //define filter as props

          />

          <DynamicTable
            weeks={weeks}
            no={6}
            className="grid-child"
            userName={user.auth.name}
            // define query as props
            tableToQuery='extra-hours'
            tableData={tableData6}

          //define filter as props

          />
        </div>
      </>
      :
      null
    }

  </>)
}


export default Exports;