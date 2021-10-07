import React, { useState } from 'react'
import { setEnvironmentData } from 'worker_threads';



export const InvoiceCheck = () => {
    const [inputData, setInputData] = useState()

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
    }
    return (
        <div>
            <h1>Deltatel Invoice Check</h1>
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
                <table>
                    <tbody>
                        {console.log(inputData)}
                        {inputData && inputData.map((item, index) => {
                            return (
                                <tr key={index}>
                                    {Object.values(item).map((subItem) => {return <td>{subItem}</td>})}
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
