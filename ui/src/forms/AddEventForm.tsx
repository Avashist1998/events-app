import { useState, useEffect, useContext } from "react";
import { SSEventBase, SSEventBaseOptional } from "../types/datatypes";

import { TextField, Button, FormControlLabel, Checkbox } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from "@mui/icons-material/Add";

import dayjs from "dayjs";

import { CurrentUserContext } from "../contexts/UserContext";

const AddEventForm = (props: {
    onCloseForm: () => void,
    event?: SSEventBase,
    submitEvent : (event: SSEventBaseOptional) => void,
    children?: React.ReactNode,
}) => {

    const strToDate = (dateTime: string | undefined) => {
        if (dateTime === undefined) {
            return null;
        }
        return dayjs(dateTime)
    }

    const { userData } = useContext(CurrentUserContext);
    const [name, setName] = useState(props.event?.name || "" );
    const [creatorEmail, setCreatorEmail] = useState(userData?.email || "");
    const [price, setPrice] = useState(props.event?.price || 0.0);
    const [limit, setLimit] = useState<null | number>( props.event?.limit || null);
    const [location, setLocation] = useState<string| null>(props.event?.location || null);
    const [isPublic, setIsPublic] = useState<boolean>(props.event?.public || true);
    const [rsvpDate, setRSVPDate] = useState<null | dayjs.Dayjs>(strToDate(props.event?.rsvp_date) || null);
    const [eventDate, setEventDate] = useState<null | dayjs.Dayjs>(strToDate(props.event?.event_date) || null);

    const [nameError, setNameError] = useState(false);

    const [enableAddEvent, setEnableAddEvent] = useState(false);


    useEffect(() => {
        let val = true;
        if (name === "") {
            setNameError(true);
            val = val && false;
        } else {
            setNameError(false);
        }
        if (rsvpDate === null) {
            val = val && false;
        }
        if (eventDate === null) {
            val = val && false;
        }
        setEnableAddEvent(val);

    }, [name, creatorEmail, price, limit, location, isPublic, rsvpDate, eventDate])

    const submitAddEvent = () => {
        let newEvent;
        if (rsvpDate !== null && eventDate !== null) {
            if (limit === null && location === null) {
                newEvent = {
                    name: name,
                    price: price,
                    creator: creatorEmail,
                    public: isPublic,
                    locked: false,
                    rsvp_date: rsvpDate.toISOString(),
                    event_date: eventDate.toISOString()
                } as SSEventBaseOptional
            } else if (limit === null && location !== null) {
                newEvent= {
                    name: name,
                    location: location,
                    creator: creatorEmail,
                    public: isPublic,
                    price: price,
                    locked: false,
                    rsvp_date: rsvpDate.toISOString(),
                    event_date: eventDate.toISOString()
                } as SSEventBaseOptional
            } else if (limit !== null && location === null) {
                newEvent= {
                    name: name,
                    price: price,
                    creator: creatorEmail,
                    public: isPublic,
                    limit: limit,
                    locked: false,
                    rsvp_date: rsvpDate.toISOString(),
                    event_date: eventDate.toISOString()
                } as SSEventBaseOptional
            } else {
                newEvent= {
                    name: name,
                    location: location,
                    creator: creatorEmail,
                    price: price,
                    limit: limit,
                    public: isPublic,
                    locked: false,
                    rsvp_date: rsvpDate.toISOString(),
                    event_date: eventDate.toISOString()
                } as SSEventBaseOptional
            }
            props.submitEvent(newEvent);
        }
    }

    return (
        <div className="p-2">
            <div className="flex justify-end">
                <Button onClick={props.onCloseForm} startIcon={<CancelIcon/>} variant="contained" color="error">
                    Close
                </Button>
            </div>
            <div className="flex justify-center p-2">
                <TextField id="eventName" label="Name" value={name} required onChange={e => setName(e.target.value)} error={nameError}/>
            </div>
            <div className="flex justify-center p-2">
                <TextField id="creatorEmail" label="Email" type="email" value={creatorEmail} disabled={true} required onChange={e => setCreatorEmail(e.target.value)}/>
            </div>
            <div className="flex justify-center p-2" >
                <TextField id="location" label="Location" value={location || ""} onChange={e => setLocation(e.target.value)}/>
            </div>
            <div className="flex justify-center p-2">
                <TextField id="price" type="number" label="Price" value={price} onChange={e => setPrice(Number(e.target.value))}/>
            </div>
            <div className="flex justify-center p-2">
                <TextField id="limit" type="number" label="People limit" value={limit || ""} onChange={e => setLimit(Number(e.target.value))}/>
            </div>
            <div className="flex justify-center">
                <FormControlLabel control={<Checkbox defaultChecked onChange={e => setIsPublic(e.target.checked)} value={isPublic}/>} label="Public" />
            </div>
            <div className="flex justify-center p-2">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker value={rsvpDate} label="RSVP Date" onChange={val => setRSVPDate(val)}/>
                </LocalizationProvider>
            </div>
            <div className="flex justify-center p-2">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker value={eventDate} label="Event Date"onChange={val => setEventDate(val)}
                    />
                </LocalizationProvider>
            </div>
            <div className="flex justify-center p-2">
                <Button onClick={submitAddEvent} startIcon={<AddIcon/>} disabled={!enableAddEvent} color="success" variant="contained">
                    {props.event ? "Update Event" : "Add Event"}
                </Button>
            </div>
                {props.children}
        </div>
    )
}


export default AddEventForm;