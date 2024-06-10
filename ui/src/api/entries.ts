import { apiURL }  from "./base";
import { EntryBase, Entry, Message } from "../types/datatypes"

const entiresApiURL = `${apiURL}/entries/`

export async function getEntries() : Promise<Entry[]> {
    const res = await fetch(entiresApiURL,  {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    })
    return res.json() as Promise<Entry[]>
}


export async function  getEntry(entry_id: number): Promise<Entry | Message> {
    const res = await fetch(entiresApiURL + entry_id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    })
    if (!res.ok) {
        return res.json() as Promise<Message>
    }
    return res.json() as Promise<Entry>

}

export async function addEntry(entry: EntryBase): Promise<Entry | Message> {
    
    const res = await fetch(entiresApiURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(entry)
    })
    if (!res.ok) {
        return res.json() as Promise<Message>;
    }
    return res.json() as Promise<Entry>;
}

export async function deleteEntry (entry_id: number): Promise<Message> {
    const res = await fetch(entiresApiURL + entry_id.toString(), {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": sessionStorage.getItem("token") || ""
        }
    })
    return res.json() as Promise<Message>
}

