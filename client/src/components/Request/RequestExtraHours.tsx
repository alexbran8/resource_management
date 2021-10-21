import React, { useEffect, useState } from "react";

import { useMutation, useQuery, gql } from "@apollo/client";

import moment from 'moment'

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from "@material-ui/core/Divider";

import "./RequestExtraHours.scss"


import { useForm, Controller } from 'react-hook-form'

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        width: 200,
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
        var beginningTime = moment(data.start, 'h:mm');
        var endTime = moment(data.end, 'h:mm');
     if (beginningTime.isBefore(endTime))
     { 
        
        addItemMutation({
            variables: {
                data: data,
                userEmail: props.resourceEmail
            }
        }
        )
    }
    else
    {
        alert("please select proper end hour")
    }
    };


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
                    <Controller
                        name="date"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                                id="date"
                                type="date"
                                // label="date"

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
                                // label="start"
                                // label="start hour"
                                // defaultValue="2021-05-24"
                                // variant="filled"
                                // value={value}
                                onChange={onChange}
                                error={!!error}
                                helperText={error ? error.message : null}
                            />
                        )}
                        rules={{ required: 'Start hour is required' }}
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
                                // label="end"
                                // style = {{width: 150}}
                                // defaultValue="2021-05-24"
                                // variant="filled"
                                // value={value}
                                onChange={onChange}
                                error={!!error}
                                helperText={error ? error.message : null}
                            />
                        )}
                        rules={{ required: 'End hour is required' }}
                    />
                </Grid>

                <Grid item xs={12}
                    style={{ padding: 20 }}
                >
                    {/* <FormRow  style={{ marginTop: 10, marginBottom: 10 }}/> */}
                    Details
                    <Divider
                        style={{ marginTop: 1, marginBottom: 10 }}
                    />
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
                        name="domain"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                                id="domain"
                                type="text"
                                label="Domain"
                                // defaultValue="Radio"
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
                        rules={{ required: 'Domain is required' }}
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
                                label="Scope"
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
                    <Controller
                        name="wbs"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                                id="wbs"
                                type="text"
                                // defaultValue="2021-05-24"
                                label="WBS"
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
                        rules={{ required: 'WBS is required' }}
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