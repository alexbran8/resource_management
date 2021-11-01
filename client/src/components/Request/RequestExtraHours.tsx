import React, { useEffect, useState } from "react";

import { useMutation, useQuery, gql } from "@apollo/client";

import moment from 'moment'

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from "@material-ui/core/Divider";

import "./RequestExtraHours.scss"


import { useForm, Controller } from 'react-hook-form'

import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
    DatePicker,
    TimePicker,
    DateTimePicker,
    MuiPickersUtilsProvider,
} from '@material-ui/pickers';

const wbsList = [
    { value: 'FRLI000642-FP-PROD', label: 'FRLI000642-FP-PROD' },
    { value: 'FRLI000642-FP-TAC', label: 'FRLI000642-FP-TAC' },
    { value: 'FRLI000642-FP-Fiab-Radio', label: 'FRLI000642-FP-Fiab-Radio' },
    { value: 'FRLI000642-FP-AMO', label: 'FRLI000642-FP-AMO' },
    { value: 'FRLI000642-FP-SAO', label: 'FRLI000642-FP-SAO' },
    { value: 'FRLI000642-FP-RADIO', label: 'FRLI000642-FP-RADIO' }
]

const domainList = [
    { value: 'RADIO', label: 'RADIO' },
    { value: 'TRANS', label: 'TRANS' }
]

const useStyles = makeStyles((theme) => ({
    container: {
        // display: 'flex',
        // flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(2),
        width: 250,
      },
}));

const ADD_ITEM = gql`
mutation($data: [extraHours], $userEmail: String!) {
    addExtraHours(data:$data, userEmail:$userEmail) {
        success
        message
    }
}
`;

const GET_DD_DATA = gql`
query($department:String!) {
    getDistinctNorms(department:$department) {
        task
        WBS
    }
}
`;

export const RequestExtraHours = (props) => {
    const classes = useStyles();
    const { register, handleSubmit, control } = useForm({});
    const [services, setServices] = useState([])
    const [val, setMyVal] = useState()
    const [duration, setDuration] = useState()
    const [isNightTask, setIsNightTask] =useState(false)

    const fruits = register("fruits");

    const { data, loading: get_dd_data_loading, error: get_dd_data_error } = useQuery(GET_DD_DATA, {
        variables: { department: 'RADIO' }, onCompleted: () => {
            console.log(data)
            setServices(data.getDistinctNorms)
        }
    });

    const [addItemMutation] = useMutation(ADD_ITEM, {
        onCompleted: (data) => {
            alert("Request added successfully!")
        },
        onError: (error) => { console.error("Error creating a new item", error); alert("Error creating a post request " + error.message) },
    });


    const onSubmit = (data: any) => {
        // check if time is correct        
        addItemMutation({
            variables: {
                data: data,
                userEmail: props.resourceEmail
            }
        }
        )
    };

    const checkIfNightTask = (val) =>
    {
        var format = 'hh:mm'
        var time = moment(val,format),
  beforeTime = moment('06:00', format),
  afterTime = moment('22:00', format);

if (time.isBetween(beforeTime, afterTime)) {

  setIsNightTask(false)

} else {

    setIsNightTask(true)

}
    }

    console.log(moment(val, "hh:mm").add('02:00', 'hours'))


    return (<div className="request-extra-hours-form">
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid item xs={12}>
                Date and time
                <Divider
                    style={{ marginTop: 1, marginBottom: 10 }}
                />
                <Grid item xs={12}
                    style={{ padding: 20 }}
                >
                   <h6> 1. Select date, start hour and duration. If task performed after 22:00, then it will be considered as night task.</h6>
                    <Controller
                        name="date"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                                id="date"
                                type="date"
                                label="date"
                                // defaultValue="2021-05-24"
                                // variant="outlined"
                                className={classes.textField}
                                onChange={onChange}
                                error={!!error}
                                helperText={error ? error.message : null}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        )}
                        rules={{ required: 'Date is required' }}
                    />
                    <Controller
                        name="start"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                                id="start"
                                type="time"
                                className={classes.textField}
                                label="start"
                                // inputProps={{ step:500}}
                                // label="start hour"
                                // defaultValue="2021-05-24"
                                // variant="filled"
                                value={value}
                                onChange={(e) => { onChange(e); setMyVal(e.target.value) }}
                                // {...register('start', {
                                //     onChange: (e) => {  setMyVal(e.target.value);},
                                //     onBlur: (e) => {  setMyVal(e.target.value);},
                                //   })}
                                error={!!error}
                                helperText={error ? error.message : null}
                            // onChange={(e) => {
                            //     fruits.onChange(e);
                            //     onChange;
                            //     setMyVal(e.target.value); // react hook form onChange
                            //     console.log("Here would go the my onChange"); // my onChange
                            // }}
                            />
                        )}
                        rules={{ required: 'Start hour is required' }}
                    />
                    <Controller
                        name="duration"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                                id="duration"
                                type="number"
                                inputProps={{ min: 0 }}
                                label="duration (hours)"
                                className={classes.textField}
                                onChange={(e) => { onChange(e); setDuration(e.target.value) }}
                                error={!!error}
                                helperText={error ? error.message : null}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                        )}
                        rules={{ required: 'Duration is required' }}
                    />
                    <Controller
                        name="end"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                                id="end"
                                type="time"
                                className={classes.textField}
                                label="end"
                                disabled={true}
                                // style = {{width: 150}}
                                // defaultValue="2021-05-24"
                                // variant="filled"
                                value={moment(val, "hh:mm A").add(duration, 'hours').format('HH:mm')}
                                onChange={onChange}
                                error={!!error}
                                helperText={error ? error.message : null}
                            />
                        )}
                    // rules={{ required: 'End hour is required' }}
                    />Is Night Task?
                    <Controller
                        name="nightTask"
                        control={control}
                        // defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Checkbox
                                id="nightTask"
                                className={classes.textField}
                                // className={classes.textField}
                                // label="nightTask?"
                                // type="checkbox"
                                // name={nightTask}
                                // required={true}
                                value={value}
                                onChange={onChange}
                                // error={!!error}
                                // helperText={error ? error.message : null}
                                // InputLabelProps={{
                                //     shrink: true,
                                // }}
                            // rules={{ required: true }}
                            />
                        )}

                    />
                </Grid>

                <Grid item xs={12}
                    style={{ padding: 20 }}
                >
                    {/* <FormRow  style={{ marginTop: 10, marginBottom: 10 }}/> */}
                    Details
                    <Divider
                        style={{ marginTop: 10, marginBottom: 10 }}
                    />
                    <h6> 2.Select task details: service(capacity task), domain, wbs and add scope and reason for which the task has been performed..</h6>
                    <Controller
                        control={control}
                        name="service"
                     
                        rules={{ required: 'service is required' }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Autocomplete
                            
                                onChange={(event, item) => {
                                    onChange(item.task);
                                }}
                                // error={!!error}
                                value={value}
                                options={services}
                                getOptionLabel={(item) => (item.task ? item.task : "")}
                                getOptionSelected={(option, value) =>
                                    value === undefined || value === "" || option.id === value.id
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="service"
                                        style={{ marginTop: 10, marginBottom: 10 }}
                                        className={classes.textField}
                                        // margin="normal"
                                        // variant="outlined"
                                        // error={!!errors.item}
                                        // helperText={errors.item && "item required"}
                                        error={!!error}
                                        helperText={error ? error.message : null}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                )}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="domain"
                        rules={{ required: 'domain is required' }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Autocomplete
                                onChange={(event, item) => {
                                    onChange(item.value);
                                }}

                                // error={!!error}
                                value={value}
                                options={domainList}
                                getOptionLabel={(item) => (item.value ? item.value : "")}
                                getOptionSelected={(option, value) =>
                                    value === undefined || value === "" || option.id === value.id
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="domain"
                                        className={classes.textField}
                                        // margin="normal"
                                        // variant="outlined"
                                        // error={!!errors.item}
                                        // helperText={errors.item && "item required"}
                                        error={!!error}
                                        helperText={error ? error.message : null}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                )}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="wbs"
                        rules={{ required: 'wbs is required' }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Autocomplete
                                onChange={(event, item) => {
                                    onChange(item.value);
                                }}

                                // error={!!error}
                                value={value}
                                options={wbsList}
                                getOptionLabel={(item) => (item.value ? item.value : "")}
                                getOptionSelected={(option, value) =>
                                    value === undefined || value === "" || option.id === value.id
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="wbs"
                                        className={classes.textField}
                                        // margin="normal"
                                        // variant="outlined"
                                        // error={!!errors.item}
                                        // helperText={errors.item && "item required"}
                                        error={!!error}
                                        helperText={error ? error.message : null}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                )}
                            />
                        )}
                    />
                     <Controller
                        name="scope"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                                id="scope"
                                type="text"
                                // defaultValue="2021-05-24"
                                // variant="outlined"
                                label="scope"
                                className={classes.textField}
                                onChange={onChange}
                                error={!!error}
                                helperText={error ? error.message : null}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        )}
                        rules={{ required: 'Scope is required' }}
                    />
                    <Controller
                        name="reason"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                                id="reason"
                                type="text"
                                // defaultValue="2021-05-24"
                                // variant="outlined"
                                label="reason"
                                className={classes.textField}
                                onChange={onChange}
                                error={!!error}
                                helperText={error ? error.message : null}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        )}
                        rules={{ required: 'Reason is required' }}
                    />

                </Grid>
            </Grid>
            {/* <Button variant="contained" onClick={handleClose}>
          Cancel
        </Button> */}
            <Button type="submit" variant="contained" color="primary">
                Add
            </Button>
        </form>
    </div>
    )
}

// export default reduxForm({
//     form: 'RequestExtraHours', // a unique identifier for this form
//     validate,
//     // asyncValidate
//   })(MaterialUiForm)