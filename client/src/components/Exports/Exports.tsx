import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMutation, useQuery, gql } from "@apollo/client";

import { DynamicTable } from "./DynamicTable";
import "./Exports.scss"
import { apiclient } from "../../";
import { useEffect } from "react";

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

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

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));
const GET_MONTHS = gql`
query { 
  getMonthsQuery  {
      month
  }
}
`;


const Exports = () => {
  const classes = useStyles();
  const user = useSelector((state) => ({ auth: state.auth }));
  const [tableData, setTableData] = useState()
  const [tableData2, setTableData2] = useState()
  const [tableData3, setTableData3] = useState()
  const [tableData4, setTableData4] = useState()
  const [tableData5, setTableData5] = useState()
  const [tableData6, setTableData6] = useState()
  const [data1, setData1] = useState()
  const [monthList, setMonthList] = useState([])
  const [selectedMonth, setSelectedMonth] = useState()

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

  const getAllDataQueries = (month) => {
    getData1(month)
    .then(res => getData2(month))
    .then(res => getData3(month))
    .then(res => getData4(month))
    .then(res => getData5(month))
    .then(res => getData6(month))
  }



  const getData1 = async (month) => {
    await apiclient.query({
      query: GET_EH,
      variables: { type: `'On Call'`, employeer: `'Deltatel'`, year: parseInt(month.substring(0,4)), month: parseInt(month.substring(5,7))  }
    }).then(data => {
      console.log(data)
      setTableData(data.data.getExtraHours)
    }
    )
  }

  const getData2 = async (month) => {
    let data = await apiclient.query({
      query: GET_EH,
      variables: { type: `'Hotline'`, employeer: `'Deltatel'`,year: parseInt(month.substring(0,4)), month: parseInt(month.substring(5,7))  }
    })
    setTableData2(data.data.getExtraHours)
  }
  const getData3 = async (month) => {
    await apiclient.query({
      query: GET_EH,
      variables: { type: `'Hotline'`, employeer: `'Connect 44'`,year: parseInt(month.substring(0,4)), month: parseInt(month.substring(5,7))  }
    }).then(data => { setTableData3(data.data.getExtraHours) })
  }

  const getData4 = async (month) => {
    await apiclient.query({
      query: GET_EH,
      variables: { type: `'On Call'`, employeer: `'Connect 44'`, year: parseInt(month.substring(0,4)), month: parseInt(month.substring(5,7))  }
    }).then(data => { setTableData4(data.data.getExtraHours); console.log(data) })
  }
  const getData5 = async (month) => {
    let data = await apiclient.query({
      query: GET_EH,
      variables: { type: `'Hotline'`, employeer: `'SII'`, year: parseInt(month.substring(0,4)), month: parseInt(month.substring(5,7))  }
    })
    setTableData5(data.data.getExtraHours)
  }
  const getData6 = async (month) => {
    let data = await apiclient.query({
      query: GET_EH,
      variables: { type: `'On Call'`, employeer: `'SII'`,year: parseInt(month.substring(0,4)), month: parseInt(month.substring(5,7))  }
    })
    setTableData6(data.data.getExtraHours)
  }
  const { data, error: get_months_error } = useQuery(GET_MONTHS, {
    onCompleted: () => {
        console.log(data)
        setMonthList(data.getMonthsQuery)
    }
});

  return (<>
    {user.auth.role == 'L3' ?
      <>
        <div className='table-heading'><b>{`${user.auth.name}`}</b>, please find belore the list with all requests:</div>
        <div className="filters">
                <Autocomplete
                    id="combo-box-demo"
                    options={monthList}
                    noOptionsText={'Your Customized No Options Text'}
                    getOptionLabel={(option) => option.month}
                    style={{ width: 300 }}
                    className={classes.textField}
                    // onChange={(v) => {console.log(v.month);setSelectedMonth(v.month); getAllDataQueries(v.month)}}
                    onInputChange={(event, newInputValue, reason) => {
                      console.log(newInputValue)
                      if (reason === 'clear') {
         setTableData(null)
         setTableData2(null)
         setTableData3(null)
         setTableData4(null)
         setTableData5(null)
         setTableData6(null)
                      } else {
                        console.log(newInputValue.month); getAllDataQueries(newInputValue)                      }
                  }}
                    renderInput={(params) => <TextField {...params}  label="select month" variant="outlined" />}
                />
            </div>
        <div className='grid'>
          {tableData ? 
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
          : null}
          {tableData2 ? 
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
          : null}
          {tableData3 ? 
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
          : null}
          {tableData4 ? 
          <DynamicTable
            weeks={weeks}
            no={4}
            userName={user.auth.name}
            // define query as props
            tableToQuery='extra-hours'
            tableData={tableData4}

          //define filter as props

          />
          : null}
          {tableData5 ? 
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
          : null}
          {tableData6 ? 
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
          : null}
        </div>
      </>
      :
      null
    }

  </>)
}


export default Exports;