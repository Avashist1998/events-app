import { UserInfo, UserSignUp, Message, UserLogin } from "../types/datatypes";
import { apiURL } from "./base";



export const addUser = async (user: UserSignUp): Promise<UserInfo | Message> => {
    try {
        const response = await fetch(`${apiURL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        if (!response.ok) {
            const message = await response.json() as Message;
            message.status = response.status;
            return message;
        }
        return response.json() as Promise<UserInfo>;
    } catch (error) {
        console.error("An error occurred while adding user", error)
        throw error;
    }
}


export const logIn = async (user: UserLogin): Promise<UserInfo | Message> => {
    try {
        const response = await fetch(`${apiURL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
            credentials: "include"
        });
        if (!response.ok) {
            const message = await response.json() as Message;
            message.status = response.status;
            return message;
        }
        return response.json() as Promise<UserInfo>;
    } catch (error) {
        console.error("An error occurred while logging in", error)
        throw error;
    }
}


export const getUserInfo = async (): Promise<UserInfo | Message> => {
    try {
        const response = await fetch(`${apiURL}/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": sessionStorage.getItem("token") || ""
            },
        })
        if (!response.ok) {
            const message = await response.json() as Message;
            message.status = response.status;
            return message;
        }
        return response.json() as Promise<UserInfo>;
    } catch (error) {
        console.error("An error occurred while getting user info", error)
        throw error;
    }

}


export const getUser = async (user_id: string): Promise<UserInfo | Message> => {
    try {
        const response = await fetch(`${apiURL}/users/${user_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": sessionStorage.getItem("token") || ""
            },
            credentials: "include"
        });
        if (!response.ok) {
            const message = await response.json() as Message;
            message.status = response.status;
            return message;
        }
        return response.json() as Promise<UserInfo>;
    } catch (error) {
        console.error("An error occurred while getting user", error)
        throw error;
    }
}


export const logOutUser = async (): Promise<Message> => {
    try {
        const response = await fetch(`${apiURL}/users/logout`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": sessionStorage.getItem("token") || ""
            },
            credentials: "include"
        });
        if (!response.ok) {
            const message = await response.json() as Message;
            message.status = response.status;
            return message;
        }
        return response.json() as Promise<Message>;
    } catch (error) {
        console.error("An error occurred while logging out", error)
        throw error;
    }

}