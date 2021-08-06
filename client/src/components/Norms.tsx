import React, { useState } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import { makeStyles } from '@material-ui/core/styles';
import { Table } from 'react-bootstrap'
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

import "./Norms.scss"

const GET_ALL = gql`
  query ($date: String, $responsible_entity:String, $site: String, $week:String, $no_itv: String, $status: String) { 
    getAll(first:50, date:$date, responsible_entity:$responsible_entity, week:$week, site:$site, no_itv:$no_itv, status:$status)  {
        id
        week
        date
        NORM
        responsible_entity 
        no_incident 
        no_itv
        status
        site_constructor
        TT_creator_short
        OMC_engineer
        site
        region
        comment_tac
        
    }
  }
`;

const GET_DISTINCT = gql`
query {
    getDistinctWeeks {
        week
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



const Norms = () => {
    const classes = useStyles();
    const [weekList, setuWeeksList] = useState([]);
    const [itvList, setuitvList] = useState([]);
    const [status, setStatus] = useState();
    const [itv, setItv] = useState();
    const [site, setSite] = useState();
    const [date, setDate] = useState();
    const [responsible, setResponsible] = useState();
    const [week, setWeek] = useState();
    const { data, loading, error, refetch } = useQuery(GET_ALL, {
        variables: { status: status, week: week, date: date }, onCompleted: () => {


        }
    });

    const { data:data2, loading:loading2, error:error2 } = useQuery(GET_DISTINCT, {
        onCompleted: () => {
            setuWeeksList(data2.getDistinctWeeks);
        }
    });

    const change = (event, values) => {
        console.log(event.target, values.status)
    }

    // const onSaveInformation = (id, name) => updateUser({ variables: { id, name })

    return (<div>
        <div className="filterContainer">
            <>
                <Autocomplete
                    id="combo-box-demo"
                    options={weekList}
                    getOptionLabel={(option) => option.week}
                    style={{ width: 300 }}
                    onChange={(e,v) => {setWeek(v);refetch()}}
                    className={classes.textField}
                    renderInput={(params) => <TextField {...params} label="select week" variant="outlined" />}
                />
            </>
            <>
                <Autocomplete
                    id="combo-box-demo"
                    options={itvList}
                    getOptionLabel={(option) => option}
                    style={{ width: 300 }}
                    className={classes.textField}
                    onChange={(e,v) => setItv(v)}
                    renderInput={(params) => <TextField {...params} label="select ITV" variant="outlined" />}
                />
            </>
            <>
            <TextField
                id="date"
                type="date"
                defaultValue="2021-05-24"
                variant="outlined"
                className={classes.textField}
                onChange={(e,v) => {setDate(e.target.value);console.log(e.target.value);refetch()}}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <>
                <Autocomplete
                    id="combo-box-demo"
                    options={[{status: 'Problème résolu'}, {status:'Problème résolu avec réserve'},{status:'Problème pas identifié'}, {status:'Problème identifié'} ]}
                    getOptionLabel={(option) => option.status}
                    style={{ width: 300 }}
                    className={classes.textField}
                    onChange={(e,v) => {setStatus(v.status);refetch()}}
                    renderInput={(params) => <TextField {...params}  label="select status" variant="outlined" />}
                />
            </>
            <>
                <Autocomplete
                    id="combo-box-demo"
                    options={weekList}
                    getOptionLabel={(option) => option}
                    style={{ width: 300 }}
                    className={classes.textField}
                    onChange={(e,v) => setStite(v)}
                    renderInput={(params) => <TextField {...params} label="select site" variant="outlined" />}
                />
            </>
            <>
                <Autocomplete
                    id="combo-box-demo"
                    options={weekList}
                    getOptionLabel={(option) => option}
                    style={{ width: 300 }}
                    className={classes.textField}
                    onChange={(e,v) => {setResponsible(v.responsible_entity); refetch()}}
                    renderInput={(params) => <TextField {...params} label="select responsible" variant="outlined" />}
                />
            </>

            </>
            {/* </form> */}
        </div>
        <Table striped bordered hover responsive="xl" className="dash-table">
            <thead >
                <tr>
                    <th>Select</th>
                    <th>
                        WEEK
                    </th>
                    <th>
                        DATE
                    </th>
                    <th>
                        TYPE
                    </th>
                    <th>
                        RESPONSIBLE
                    </th>
                    <th >
                        TT GIR
                    </th>
                    <th >
                        ITV
                    </th>
                    <th>
                        STATUS
                    </th>

                    <th>
                        CONSTRUCTOR
                    </th>

                    <th>
                        INTERVENANT
                    </th>
                    <th>
                        CREATEUR
                    </th>
                    <th>
                        SITE
                    </th>
                    <th>
                        REGION
                    </th>
                    <th>
                        CR TAC
                    </th>
                    {/* <th>
                    </th> */}
                </tr>
            </thead>
            <tbody>
                {data && data.getAll.map(item => {
                    return <tr key={item.id}>
                        <td> <input
                            type="checkbox"
                        // checked={checked.find((y) => y.uid == item.uid) ? true : false}
                        // onChange={(e) => createArr(item.uid, item)}
                        /></td>
                        <td>{item.week}</td>
                        <td>{item.date}</td>
                        <td>{item.NORM}</td>
                        <td>{item.responsible_entity}</td>
                        <td>{item.no_incident}</td>
                        <td>{item.no_itv}</td>
                        <td className={item.status == 'Problème résolu' ? 'green' : item.status == 'Problème résolu avec réserve' ? 'orange' : item.status == 'Problème pas identifié' ? 'red' : null}>{item.status}</td>
                        <td>{item.site_constructor}</td>
                        <td>{item.OMC_engineer}</td>
                        <td>{item.TT_creator_short}</td>
                        <td>{item.site}</td>
                        <td>{item.region}</td>
                        <td><span title={item.comment_tac}>{item.comment_tac.substring(0, 25)}</span></td>

                    </tr>
                })}
            </tbody>
        </Table>

    </div>)
}

export default Norms