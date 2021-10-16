import React, { useState } from 'react'
import { setEnvironmentData } from 'worker_threads';



export const InvoiceCheck = () => {
    const [inputData, setInputData] = useState()
    const [collumns, setCollumns] = useState()



    const arr2 = [
        { MARCA: "1843", regularHours: 65, schifted:10 },
        { MARCA: "1709", regularHours: 70, schfited: 5 }
    ];

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
        setInputData(excelToObjects(event.target.value))
        setCollumns(newThing(event.target.value).columns)

        // const map = new Map();
        // inputData && inputData.forEach(item => map.set(item.MARCA, item));
        // arr2.forEach(item => map.set(item.MARCA, { ...map.get(item.MARCA), ...item }));
        // const mergedArr = Array.from(map.values());
        // console.log({mergedArr})

        const result = excelToObjects(event.target.value).map(item => {
            const obj = arr2.find(o => o.MARCA === item.MARCA);
            return { ...item, ...obj };
          });
        
          setInputData(result);
    }
    return (
        <div>
            <h1>Deltatel Invoice Check</h1>
            <h6>1. Replace header in Excel file with the below one</h6>
            <h6>2. Select month for which you want the check to be performed</h6>
            <h6>3. Copy Excel table and paste it below:</h6>
            <section>
                <form>
                    <textarea
                        //   ref={textAreaRef}
                        //   value='Some text to copy'
                        onChange={handleChange}
                        rows={15}
                        cols={180}
                    />
                </form>
            </section>
            <section>
            {collumns ? <h6>4. Check results:</h6> : null }
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
        </div>
    )
}
