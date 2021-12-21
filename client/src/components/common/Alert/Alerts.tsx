import React, { useState, useEffect } from "react";
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/core/Icon/Icon';

export const AlertComponent = (props) => {
        const [open, setOpen] = useState < boolean > (true);
        const [showAlerts, setShowAlerts] = useState < boolean > (true)
        const [message, setMessage] = useState < string > ('')

        const [index, setIndex] = React.useState(0);

        useEffect(() => {
                const timerRef = setInterval(() => {
                        setIndex(i => i + 1);
                }, 5000);
                return () => clearInterval(timerRef);
        }, []);

        useEffect(() => {
                const { messages } = props;
                setMessage(messages[index % messages.length]);
              }, [index]);


        // useEffect(() => {
        //         // setShowAlerts(true)
        //         // do {
        //         for (let i = 0; i <= props.messages.length; i++) {
        //                 setTimeout(() => {
        //                         setMessage(props.messages[i]);
        //                         if(i == props.messages.length ) {
        //                         //        setShowAlerts(false)
        //                         let i = 0
        //                         } 
        //                 }, 1000*i);
        //         }
        // }, []);

        return (
                <>
                        {/* TODO: add clear button to alert */}
                        {showAlerts  ?
                                <Box sx={{ width: '100%' }}>
                                        <Collapse in={open}>
                                                <Alert severity={message.type} onClose={() => { setShowAlerts(false) }}>{`${message.type}: ${message.message}`}</Alert>
                                        </Collapse>
                                </Box>
                                : null}
                </>
        )
}
