import {useState, useEffect, lazy, Suspense, useContext} from "react"
import { useNavigate, useLocation } from "react-router-dom"

import AddIcon from "@mui/icons-material/Add";
import { Button, Box, CircularProgress } from "@mui/material";

import { addEvent, getEvents } from "../api/events"
import { getUserInfo } from "../api/users"
import { SSEvent, SSEventBaseOptional } from "../types/datatypes"

import EventsTable from "../components/EventsTable";
import { CurrentUserContext } from "../contexts/UserContext";

const AddEventForm = lazy(() => import('../forms/AddEventForm'));
const EventFilterForm = lazy(() => import("../forms/EventFilterForm"))
const MessageAlert = lazy(() => import('../components/MessageAlert'));

const EventsPage = () => {

    const { userData, setUserData } = useContext(CurrentUserContext);
    const [events, setEvents] = useState([] as SSEvent[]);
    const [reloadEvents, setReloadEvents] = useState(false);
    const [totalEventsCount, setTotalEventsCount] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    
    const offset = queryParams.get('offset') ?? '0';
    const limit = queryParams.get('limit') ?? '10';
    const eventType = queryParams.get('eventType') ?? 'Both';
    const searchTerm = queryParams.get('searchTerm') ?? undefined;

    const [isLoading, setIsLoading] = useState(true);
    const [showAddEventForm, setShowAddEventForm] = useState(false);

    const [isErrorMsg, setIsErrMsg] = useState(false);
    const [addEventMsg, setAddEventMsg] = useState("");
    const [eventsErrorMsg, setEventsErrorMsg] = useState("");
    const [eventLink, setEventLink] = useState<undefined | string>(undefined);

    useEffect(() => {
        const loadEvents = () => {
            const numOffset = Number(offset);
            const numLimit = Number(limit);
            const parsedEventType = eventType as "Both" | "Private" | "Public";
            getEvents({offset: numOffset, limit: numLimit, eventType: parsedEventType, searchTerm}).then((res) => {
                if ("count" in res) {
                    setEvents(res.events);
                    setTotalEventsCount(res.count);
                } else {
                    setEventsErrorMsg(res.message);
                }
            }).catch(() => {
                setEventsErrorMsg("API is currently down, please try again at a different time.")
            }).finally(() => {
                setIsLoading(false)
                setReloadEvents(false);
            });
        }
        loadEvents();
    }, [offset, limit, eventType, searchTerm, reloadEvents])



    useEffect(() => {
        getUserInfo().then((res) => {
            if ("id" in res) {
                setUserData(res);
                sessionStorage.setItem("userData", JSON.stringify(res));

            } else {
                setUserData(null);
                sessionStorage.removeItem("userData");
                sessionStorage.removeItem("token");
            }
        }).catch(() => {
            setUserData(null);
            sessionStorage.removeItem("userData");
            sessionStorage.removeItem("token");
        })
    }, [setUserData])

    const gotToEvent = (eventId: number) => {
        const path = `./${eventId}`;
        navigate(path);
    }

    const submitEventsSearchForm = (searchTerm: string, type: "Both" | "Private" | "Public") => {
        onParamChange(0, Number(limit), type, searchTerm);
    }
    const onParamChange = (offset: number = 0, limit: number = 10, evenType: "Both" | "Private" | "Public" = "Both", searchTerm: string = "") => {
        let path = `${location.pathname}?`
        if (offset !== 0) {
            path = `${path}offset=${offset}&`
        }
        if (limit !== 10) {
            path = `${path}limit=${limit}&`
        }
        if (evenType !== "Both") {
            path = `${path}eventType=${evenType}&`
        }
        if (searchTerm !== "") {
            path = `${path}searchTerm=${searchTerm}`
        }
        navigate(path);
    }

    const closeEventForm = () => {
        console.log(showAddEventForm);
        setShowAddEventForm(false);
        resetParameters();
    }

    const resetParameters = () => {
        setIsErrMsg(false);
        setAddEventMsg("");
        setEventsErrorMsg("");
    }

    const submitAddEvent = (event: SSEventBaseOptional) => {
        addEvent(event).then((res) => {
            if ('name' in res) {
                resetParameters()
                setAddEventMsg(`Event with name = "${res.name}" by user = "${res.creator}" has been created.`)
                setEventLink(`/${res.id.toString()}`)
            } else {
                setIsErrMsg(true);
                setAddEventMsg(res.message);
            }
            setReloadEvents(true);
        }).catch(() => {
            setIsErrMsg(true);
            setEventsErrorMsg("API is currently down, please try again at a different time.")
        })
    }

    return (
    isLoading ?    
        <Box className="flex justify-center">
            <CircularProgress/>
        </Box>
        :
            eventsErrorMsg !== "" ?
                <Suspense fallback={<CircularProgress/>}>
                    <MessageAlert isError={true} msg={eventsErrorMsg}/>
                </Suspense>   
            :
                <div className="p-[20px]">
                    <div className="flex justify-end left-0">
                        <div className="mx-1">
                            <Button startIcon={<AddIcon/>} variant="contained" color="success" onClick={()=> {setShowAddEventForm(true)}} disabled={userData === null}>
                                Add Event
                            </Button>
                        </div>
                    </div>
        
                    <h1 className="justify-center flex p-4 text-8xl font-bold">Events</h1>
        
                    { !showAddEventForm && 
                    <>  
                        <Suspense fallback={<CircularProgress/>}>
                            <EventFilterForm onSubmit={submitEventsSearchForm}/>
                        </Suspense>
                        <div className="flex justify-center items-center my-2">
                            <EventsTable events={events} totalCount={totalEventsCount} page={Number(offset)} rowPerPage={Number(limit)} navigateToEventPage={gotToEvent} onParamChange={onParamChange}/>
                        </div>
                    </>
                    } 
                    { showAddEventForm && 
                        <Suspense fallback={<CircularProgress/>}>
                            <AddEventForm onCloseForm={closeEventForm} submitEvent={submitAddEvent}>
                                <MessageAlert isError={isErrorMsg} msg={addEventMsg} link={eventLink}/>
                            </AddEventForm>
                        </Suspense>
                    }
                </div>
    )   
}


export default EventsPage