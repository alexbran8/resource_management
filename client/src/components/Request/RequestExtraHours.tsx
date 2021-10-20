import React, { useEffect, useState } from "react";

import { useMutation, useQuery, gql } from "@apollo/client";

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
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
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
        console.log(data); addItemMutation({
            variables: {
                data: data,
                userEmail: props.resourceEmail
            }
        }
        )
    };

    return (<div className="request-extra-hours-form">
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid item xs={12}>
                Date and time
                <Divider
                    style={{ marginTop: 1, marginBottom: 10 }}
                />
                <Grid item xs={12}>
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
                    <>
                        <Controller
                            name="start"
                            control={control}
                            defaultValue=""
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <TextField
                                    id="start"
                                    type="time"
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
                    </>
                </Grid>

                <Grid item xs={12} style={{ padding: 20 }}>
                    {/* <FormRow  style={{ marginTop: 10, marginBottom: 10 }}/> */}
                    Details
                    <Divider
                        style={{ marginTop: 1, marginBottom: 10 }}
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
                        name="service"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <Autocomplete
                                id="service"
                                options={services}
                                // noOptionsText={'Your Customized No Options Text'}
                                getOptionLabel={(option) => option.task}

                                // style={{ width: 300 }}
                                className={classes.textField}
                                // onChange={(e,v) => {setSelectedMonth(v.month);refetch()}}
                                renderInput={(params) => <TextField id="service"
                                    type="text" {...params}
                                    label="service"
                                    onChange={onChange}
                                    error={!!error}
                                    helperText={error ? error.message : null}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />}
                            />
                        )}
                        rules={{ required: 'Service is required' }}
                    />
                    <Controller
                        control={control}
                        name="item"
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <Autocomplete
                                onChange={(event, item) => {
                                    onChange(item.task);
                                }}
                                value={value}
                                options={services}
                                getOptionLabel={(item) => (item.task ? item.task : "")}
                                getOptionSelected={(option, value) =>
                                    value === undefined || value === "" || option.id === value.id
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="items"
                                        margin="normal"
                                        variant="outlined"
                                        // error={!!errors.item}
                                        // helperText={errors.item && "item required"}
                                        required
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