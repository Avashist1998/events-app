import { useState, useEffect } from "react";

import AddIcon from '@mui/icons-material/Add';
import CancelIcon from "@mui/icons-material/Cancel";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";


import { EntryBase } from "../types/datatypes";
import { IconButton } from "@mui/material";

const AddEntryForm = (props : {
    event_id: number,
    closeForm: () => void,
    submitAddEntry: (entry: EntryBase, callback: () => void) => void,
    children?: React.ReactNode,
    }) => {

        const [email, setEmail] = useState("");
        const [isLoading, setIsLoading] = useState(false);
        const [enableAddEvent, setEnableAddEvent] = useState<boolean>(false);
        

    const submitAddEntry = () => {
        const newEntry = {
            event_id: props.event_id, 
            user_email: email
        } as EntryBase;
        setIsLoading(true);
        props.submitAddEntry(newEntry, () => {
            setIsLoading(false);
        });
    }

    useEffect (() => {
        let val = true;
        if (email === "" || !email.includes("@") || !email.includes(".")) {
            val = val && false;
        }
        setEnableAddEvent(val);
    }, [email])

    return (
        <>        
            <div className="flex px-2 justify-end">
                <IconButton onClick={props.closeForm} size="large" color="error"><CancelIcon/></IconButton>
            </div>
            <div className="justify-center flex p-2">
                <h1 className="text-2xl font-bold justify-center flex">Add User</h1>
            </div>
            <div className="justify-center flex p-2">
                <TextField id="creatorEmail" label="Email" value={email} required onChange={e => setEmail(e.target.value)} error={!enableAddEvent}/>
            </div>
            <div className="flex justify-center p-2">
                <Button onClick={() => {submitAddEntry()}} startIcon={<AddIcon/>} color="success" variant="contained" disabled={!enableAddEvent}>
                    Add Entry
                </Button>
            </div>
            { isLoading && 
                <Box className="flex justify-center">
                    <CircularProgress/>
                </Box>
            }
            {props.children}
        </>
    );
}


export default AddEntryForm;