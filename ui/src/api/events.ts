import { apiURL } from "./base"
import { EventsRes } from "../types/api"
import { SSEvent, Message, SSEventBaseOptional, SSEventDataOptional } from "../types/datatypes"

const eventsApiURL = `${apiURL}/events/`

type GetEventsOptions = {
    offset?: number;
    limit?: number;
    eventType?: "Both" | "Public" | "Private";
    creatorName?: string;
    searchTerm?: string;
}

export async function  getEvents({offset = 0, limit= 10, eventType = "Both", searchTerm}: GetEventsOptions = {}): Promise<EventsRes| Message> {
    // console.log(isPublic, creatorName, searchTerm);
    try {

        let searchPath = `${eventsApiURL}?limit=${limit}&offset=${offset}`
        if (eventType !== "Both")  {
            searchPath +=  `&public=${eventType === "Public"}`
        }
        if (searchTerm !== undefined) {
            searchPath += `&search_term=${searchTerm}`
        }
        const res = await fetch(searchPath, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
        if (!res.ok) {
            return res.json() as Promise<Message>
        }
        return res.json() as Promise<EventsRes>
    } catch (error) {
        console.log(error)
        throw error;
    }
}


export async function deleteEvent (event_id: number): Promise<Message> {
    const res = await fetch(eventsApiURL  + event_id.toString(), {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("token") || ""
        },
    })
    return res.json() as Promise<Message>
}



export async function addEvent(event: SSEventBaseOptional): Promise<SSEvent | Message> {
    try{
        const res = await fetch(eventsApiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": sessionStorage.getItem("token") || ""
            },
            body: JSON.stringify(event),
        })

        if (!res.ok) {
            return res.json() as Promise<Message>
        }
        return res.json() as Promise<SSEvent>
    } catch (error) {
        console.error("An error occurred while adding the event:", error)
        throw error;
    }
}


export async function getEvent(event_id: string): Promise<SSEvent| Message> {
    const res = await fetch(eventsApiURL +  event_id.toString(),
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        } 
    )
    if (!res.ok) {
        return res.json() as Promise<Message>
    }
    return res.json() as Promise<SSEvent>
}


export async function updateEvent(event_id: string, event: SSEventDataOptional): Promise<SSEvent | Message> {
    try {
        const res = await fetch(eventsApiURL + event_id.toString(), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": sessionStorage.getItem("token") || ""
            },
            body: JSON.stringify(event)
        })
        if (!res.ok) {
            return res.json() as Promise<Message>
        }
        return res.json() as Promise<SSEvent>
    } catch (error) {
        console.error("An error occurred while updating the event:", error)
        throw error;
    }
}
