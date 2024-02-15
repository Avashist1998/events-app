export type SSEvent = {
    id: number,
    name: string,
    creator: string,
    location: string,
    limit: number,
    price: number,
    public: boolean,
    locked: boolean,
    rsvp_date: string,
    event_date: string,
    created_date: string,
    entries: Array<Entry>
}

export interface Message {
    message: string;
    status: number;
}

export type SSEventData = {
    name: string,
    location: string,
    limit: number,
    price: number,
    public: boolean,
    locked: boolean,
    rsvp_date: string,
    event_date: string,
}

export type SSEventBase = {
    name: string,
    creator: string,
    location: string,
    limit: number,
    price: number,
    public: boolean,
    locked: boolean,
    rsvp_date: string,
    event_date: string,
}

export type SSEventBaseOptional = Partial<Pick<SSEventBase, 'location' | 'limit'>> & Omit<SSEventBase, 'location' | 'limit'>;

export type SSEventDataOptional = Partial<Pick<SSEventData, 'location' | 'limit'>> & Omit<SSEventData, 'location' | 'limit'>;

export type Player = {
    name: string,
    email: string,
    created_date: string,
    entries: Array<Entry>
}

export type PlayerBase = {
    name: string,
    email: string
}

export type Entry =  {
    id: number,
    event_id: number,
    ss_recipient_email: null | string,
    user_email: string,
    created_date: string,
}

export type EntryBase = {
    event_id: number,
    user_email: string
}


export type UserSignUp = {
    name: string,
    email: string,
    password: string
}

export type UserInfo = {
    id: string,
    role: string,
    name: string,
    email: string,
    created_date: string,
    events: Array<SSEvent>,
    entries: Array<Entry>,

}

export type UserLogin = {
    email: string,
    password: string,
}
