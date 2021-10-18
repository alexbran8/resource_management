import React, { useEffect, useState, useRef } from 'react'
import { useMutation, useQuery, gql } from "@apollo/client";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import "./invoiceCheck.scss"

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

const GET_CAPACITY_HOURS = gql`
query($month:String) { 
    getCapacityHoursQuery(month:$month)  {
        normalH
        nwH
        nightH
        resMarca
  }
}
`;

export const InvoiceCheck = () => {
    const classes = useStyles();
    const [selectedMonth, setSelectedMonth] = useState()
    const [monthList, setMonthList] = useState([])
    const [inputData, setInputData] = useState()

    localStorage.getItem('data') !== null ? localStorage.getItem('data') : []


    const [collumns, setCollumns] = useState()
    const [copied, setShowCopied] = useState()
    const [capacityData, setCapacityData] = useState()

    const { data, error: get_months_error } = useQuery(GET_MONTHS, {
        onCompleted: () => {
            console.log(data)
            setMonthList(data.getMonthsQuery)
        }
    });

    const { data:capacityCheck, error: capacity_error, refetch } = useQuery(GET_CAPACITY_HOURS, {
        variables: { month: selectedMonth },
        onCompleted: () => {
        console.log(capacityCheck)
        setCapacityData(capacityCheck.getCapacityHoursQuery)
        }
    });

    const myRef = useRef(null);


    const copyTable = () => {
     const code = myRef.current.innerHTML;
    console.log(code);
    myRef.current.value = code;
    //Hidden textarea triggers select which highlights all text
    myRef.current.select();
    //Copy highlighted text
    document.execCommand("copy");
    
        // alert("Copied the text: " + myRef.value);
        console.log('copied')
    };

    const copyToClipboard = () => {
        setShowCopied(true)
        // copyTable()
    }

    const newThing = (stringData) => {
        let objects = []
        let columns = ''

        let allRows = stringData.split('\n')
        columns = allRows[0].split('\t')
        let rows = allRows.slice(1, allRows.length - 1)
        let finishedRows = []

        for (let iterator = 1; iterator <= rows.length; iterator++) {
            let row = []
            if (rows[iterator]) {
                let data = rows[iterator].split('\t')
                row = data.map(eachItem => eachItem)
                finishedRows = [...finishedRows, row]
            }
        }
        return { finishedRows, columns }
    }

    const excelToObjects = (stringData) => {
        // console.log(stringData)
        var objects = [];
        var columns = ''
        //split into rows
        var rows = stringData.split('\n');
        //Make columns
        columns = rows[0].split('\t');
        //Note how we start at rowNr = 1, because 0 is the column row
        for (var rowNr = 1; rowNr < rows.length; rowNr++) {
            var o = [];
            // console.log('row', rows[rowNr])
            var data = rows[rowNr].split('\t');
            //Loop through all the data
            var x = []
            for (var cellNr = 0; cellNr < data.length; cellNr++) {
                // console.log({ o })
                // console.log({ data })
                x = [...x, data[cellNr]]
                o[columns[cellNr]] = data[cellNr];
            }
            // console.log({ x });
            objects.push(o);
        }
        return objects;
    }

    const handleChange = (event) => {
        // localStorage.getItem('data') ? null : localStorage.setItem('data',event.target.value) 
        setInputData(excelToObjects(event.target.value))
        setCollumns(newThing(event.target.value).columns)

        // add custom collumns
        console.log({collumns})
        setCollumns(collumns.concat('test', 'tesdt2'))

        // const map = new Map();
        // inputData && inputData.forEach(item => map.set(item.MARCA, item));
        // arr2.forEach(item => map.set(item.MARCA, { ...map.get(item.MARCA), ...item }));
        // const mergedArr = Array.from(map.values());
        // console.log({mergedArr})

        const result = excelToObjects(event.target.value).map(item => {
            const obj = capacityData.find(o => o.resMarca === item.MARCA);
            return { ...item, ...obj };
        });

        setInputData(result);
    }
    return (
        <div className="invoiceCheck-container" >
            <h1>Deltatel Invoice Check</h1>
            {copied ? <h4>Text has already been copied to clipboard</h4> : null}
            <h6>1. Replace header in Excel file with the below one</h6>
            <table id="table"  ref={myRef}>
                <thead>
                    <tr>
                        <th>Luna</th>
                        <th>MARCA</th>
                        <th>NUME</th>
                        <th>PRENUME</th>
                        <th>ORE NORMALE</th>
                        <th>ORE SUPLIM</th>
                        <th>ORE SUPLIM WEEKEND</th>
                        <th>ORE REPAUS SAPT</th>
                        <th>ORE NOAPTE</th>
                        <th>PRIMA ONCALL</th>
                        <th>PRIMA PRG DECALAT</th>
                    </tr>
                </thead>
            </table>
            <h6>2. Select month for which you want the check to be performed</h6>
            <>
                <Autocomplete
                    id="combo-box-demo"
                    options={monthList}
                    noOptionsText={'Your Customized No Options Text'}
                    getOptionLabel={(option) => option.month}
                    style={{ width: 300 }}
                    className={classes.textField}
                    onChange={(e,v) => {setSelectedMonth(v.month);refetch()}}
                    renderInput={(params) => <TextField {...params}  label="select month" variant="outlined" />}
                />
            </>
            <h6>3. Copy Excel table and paste it below:</h6>
            <section>
                <form>
                    <textarea
                        //   ref={textAreaRef}
                        defaultValue={localStorage.getItem('data')}
                        onChange={handleChange}
                        rows={15}
                        cols={180}
                    />
                </form>
            </section>
            <section>
                {collumns ? <h6>4. Check results:</h6> : null}
                <table>
                    <thead>
                        <tr>

                            {collumns && collumns.map((item, index) => {
                                return (
                                    <th key={index}>
                                        {item}
                                    </th>
                                )
                            }
                            )
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {console.log(inputData)}
                        {inputData && inputData.map((item, index) => {
                            return (
                                <tr key={index}>
                                    {Object.values(item).map((subItem, subIndex) => { return <td key={'x' + subIndex}>{subItem}</td> })}
                                </tr>
                            )

                        }
                        )
                        }
                    </tbody>
                </table>
            </section>
        </div >
    )
}
