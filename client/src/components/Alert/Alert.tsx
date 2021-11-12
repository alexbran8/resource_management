import React, { useState } from "react";
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/core/Icon/Icon';

export const AlertComponent = (props) => {
        const [open, setOpen] = useState<boolean>(true);

        return (
                <Box sx={{ width: '100%' }}>
                        <Collapse in={open}>
                                <Alert severity="info">
                                        Scheduler table has now a freezed first row. You can scroll vertically and horizontally.
                                </Alert>
                        </Collapse>
                </Box>
        )
}