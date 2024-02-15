import { apiURL } from "./base"
import { MessageRes } from "../types/api"
import { Player, PlayerBase, Message } from "../types/datatypes"


const playersApiURL = `${apiURL}/players/`

export async function getPlayers() : Promise<Player[]> {
    const res = await fetch(playersApiURL,  {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    })
    return res.json() as Promise<Player[]>
}


export async function  getPlayer(email: string): Promise<Player> {
    const res = await fetch(playersApiURL + email, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    })
    return res.json() as Promise<Player>
}

export async function addPlayer(player: PlayerBase): Promise<Player | Message> {
    try {
        const res = await fetch(playersApiURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(player)
        })
        if (!res.ok) {
            return res.json() as Promise<Message>;
        }
        return res.json() as Promise<Player>
    } catch (error) {
        console.error("An error occurred while adding player", error)
        throw error;
    }
}

export async function deletePlayer (email: string): Promise<MessageRes> {
    try {
        const res = await fetch(playersApiURL + email, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        return res.json() as Promise<MessageRes>
    } catch (error) {
        console.error("An error occurred while delete the player:", error)
        throw error;
    }
}

export async function updatePlayer(player: PlayerBase): Promise<Player> {
    const res = await fetch(playersApiURL , {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(player)
    })
    return res.json() as Promise<Player>
}
