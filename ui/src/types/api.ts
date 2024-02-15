import { SSEvent } from "./datatypes"


export type MessageRes = {
    message: string
}


export type EventsRes = {
    count: number,
    events: SSEvent[]
}
