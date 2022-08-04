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
  query ($department: String, $type: String, $employeer: String, $month:Int, $year: Int, $firstWeek: Int) { 
    getExtraHours (department: $department type: $type, employeer: $employeer, month:$month, year:$year, firstWeek: $firstWeek) {
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
  const [tableData7, setTableData7] = useState()
  const [firstWeek, setFirstWeek]= useState()
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

  const getWeek = (month) => {
    console.log(parseInt(month.substring(0, 4)))
    console.log(parseInt(month.substring(5, 7)))
    const currentdate = new Date(parseInt(month.substring(0, 4)), parseInt(month.substring(5, 7)), 1);
    
    var oneJan = new Date(currentdate.getFullYear(), 1, 1);
    var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
    var result = Math.ceil((currentdate.getDay() + numberOfDays) / 7);
    return (result + 1)
    // setSelectedWeek(result - 1 + '-' + currentdate.getFullYear())

  }

  const getAllDataQueries = (month) => {
    let firstWeek = getWeek(month)
    setFirstWeek(firstWeek)
    getData1(month, firstWeek)
      .then(res => getData2(month, firstWeek))
      .then(res => getData3(month, firstWeek))
      .then(res => getData4(month, firstWeek))
      .then(res => getData5(month, firstWeek))
      .then(res => getData6(month, firstWeek))
      .then(res => getData7(month, firstWeek))
  }



  const getData1 = async (month, firstWeek) => {
    await apiclient.query({
      query: GET_EH,
      variables: { type: `''On Call'', ''Oncall IPSEC'', ''Oncall SAO''`, employeer: `'Deltatel'`, year: parseInt(month.substring(0, 4)), month: parseInt(month.substring(5, 7)), firstWeek: firstWeek }
    }).then(data => {
      console.log(data)
      setTableData(data.data.getExtraHours)
    }
    )
  }

  const getData2 = async (month, firstWeek) => {
    let data = await apiclient.query({
      query: GET_EH,
      variables: { type: `''Hotline''`, employeer: `'Deltatel'`, year: parseInt(month.substring(0, 4)), month: parseInt(month.substring(5, 7)),firstWeek: firstWeek }
    })
    setTableData2(data.data.getExtraHours)
  }
  const getData3 = async (month, firstWeek) => {
    await apiclient.query({
      query: GET_EH,
      variables: { type: `''Hotline''`, employeer: `'Connect 44'`, year: parseInt(month.substring(0, 4)), month: parseInt(month.substring(5, 7)),firstWeek: firstWeek }
    }).then(data => { setTableData3(data.data.getExtraHours) })
  }

  const getData4 = async (month, firstWeek) => {
    await apiclient.query({
      query: GET_EH,
      variables: { type: `''On Call'', ''Oncall IPSEC'', ''Oncall SAO''`, employeer: `'Connect 44'`, year: parseInt(month.substring(0, 4)), month: parseInt(month.substring(5, 7)),firstWeek: firstWeek }
    }).then(data => { setTableData4(data.data.getExtraHours); console.log(data) })
  }
  const getData5 = async (month, firstWeek) => {
    let data = await apiclient.query({
      query: GET_EH,
      variables: { type: `''Hotline''`, employeer: `'SII'`, year: parseInt(month.substring(0, 4)), month: parseInt(month.substring(5, 7)) ,firstWeek: firstWeek }
    })
    setTableData5(data.data.getExtraHours)
  }
  const getData6 = async (month, firstWeek) => {
    let data = await apiclient.query({
      query: GET_EH,
      variables: { type: `''On Call'', ''Oncall IPSEC'', ''Oncall SAO''`, employeer: `'SII'`, year: parseInt(month.substring(0, 4)), month: parseInt(month.substring(5, 7)) ,firstWeek: firstWeek }
    })
    setTableData6(data.data.getExtraHours)
  }

  const getData7 = async (month, firstWeek) => {
    let data = await apiclient.query({
      query: GET_EH,
      variables: { type: `''Vacation'', ''Planned Vacation''`, employeer: `'Deltatel'`, year: parseInt(month.substring(0, 4)), month: parseInt(month.substring(5, 7)) ,firstWeek: firstWeek }
    })
    setTableData7(data.data.getExtraHours)
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
        <div className='table-heading'><b>{`${user.auth.name}`}</b>, please select year-month to fetch requests:</div>
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
              if (reason === 'clear') {
                setTableData(null)
                setTableData2(null)
                setTableData3(null)
                setTableData4(null)
                setTableData5(null)
                setTableData6(null)
                setTableData7(null)
              } else {
                console.log(newInputValue.month); getAllDataQueries(newInputValue)
              }
            }}
            renderInput={(params) => <TextField {...params} label="select month" variant="outlined" />}
          />
        </div>
        <h1>Schifted Schedule</h1>
        <div className='grid'>
        
          {tableData ?
            <DynamicTable
              weeks={[firstWeek, firstWeek+1, firstWeek+2, firstWeek+3, firstWeek+4]}
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
            weeks={[firstWeek, firstWeek+1, firstWeek+2, firstWeek+3, firstWeek+4]}
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
            weeks={[firstWeek, firstWeek+1, firstWeek+2, firstWeek+3, firstWeek+4]}
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
            weeks={[firstWeek, firstWeek+1, firstWeek+2, firstWeek+3, firstWeek+4]}
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
            weeks={[firstWeek, firstWeek+1, firstWeek+2, firstWeek+3, firstWeek+4]}
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
            weeks={[firstWeek, firstWeek+1, firstWeek+2, firstWeek+3, firstWeek+4]}
              no={6}
              className="grid-child"
              userName={user.auth.name}
              // define query as props
              tableToQuery='extra-hours'
              tableData={tableData6}

            //define filter as props

            />
            : null}
              {tableData6 ?
            <DynamicTable
            weeks={[firstWeek, firstWeek+1, firstWeek+2, firstWeek+3, firstWeek+4]}
              no={7}
              className="grid-child"
              userName={user.auth.name}
              // define query as props
              tableToQuery='extra-hours'
              tableData={tableData7}

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