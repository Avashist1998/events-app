import { FormEvent, useEffect, useState, lazy, Suspense } from 'react'

import { getEvents, deleteEvent, addEvent } from "../api/events"
import { addEntry, getEntries, deleteEntry } from '../api/entries'
import { addPlayer, getPlayers, deletePlayer } from "../api/players"
import { SSEvent, PlayerBase, Player, Entry, EntryBase, SSEventBaseOptional } from "../types/datatypes";

const AddEventForm = lazy(() => import('../forms/AddEventForm'));

const AddEntryForm = (props: {
  addEntry: (entry: EntryBase) => void
}) => {

  const[newEntry, setNewEntry] = useState({
    event_id: -1,
    user_email: ""
  } as EntryBase)

  function handleSummit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (newEntry.event_id === undefined) {
      console.log("can not Submit an Empty name")
    }
    else if (newEntry.user_email === "") {
      console.log("Can not Submit an Empty Email")
    } else {
      props.addEntry(newEntry)
    }
  }
  return (
      <div className="p-[10px]">
      <h3> Add the player </h3>
      <form onSubmit={handleSummit}>
        <div>
          <label>
            Event ID:
          </label>
          <input type="number" name="event_id" onChange={e => {
            setNewEntry((prevState) => ({
              ...prevState,
              event_id : Number(e.currentTarget.value)
            }))
          }} />
        </div>
        <div>
          <label>
            Your Email:
          </label>
          <input type="text" name="email" onChange={e => {
            setNewEntry((prevState) => ({
              ...prevState,
              user_email : e.currentTarget.value
            }))
          }} />
        </div>
        <input type="submit" value="Submit" />
      </form>
      </div>
  )
}

function AddPlayerForm (props: {
  addPlayer: (player: PlayerBase) => void
}) {

  const [newPlayer, setNewPlayer]= useState<PlayerBase>({
    name: "",
    email: ""
  })

  function handleSummit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (newPlayer.name === "") {
      console.log("can not Submit an Empty name")
    }
    else if (newPlayer.email === "") {
      console.log("Can not Submit an Empty Email")
    } else {

      props.addPlayer(newPlayer)
    }
  }
  return (
    <div className="p-[10px]">
    <h3> Add the player </h3>
    <form onSubmit={handleSummit}>
      <div>
        <label>
          Name:
        </label>
        <input type="text" name="name" onChange={e => {
          setNewPlayer(prevState => ({
            ...prevState,
            name: e.currentTarget.value
          }))
        }}/>
      </div>
      <div>
        <label>
          Email:
        </label>
        <input type="text" name="email" onChange={e => {
          setNewPlayer(prevState => ({
            ...prevState,
            email: e.currentTarget.value
          }))
        }}/>
      </div>
      <input type="submit" value="Submit" />
    </form>
    </div>
  )
}

function EntriesTable (props: {
  entries: Entry[],
  removeEntry: (entry_id: number) => void
}) {
  return (
    <div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Event ID</th>
          <th>Player Email</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      {props.entries.map((entry) => {
        return (
          <tr key={entry.id}>
              <td>{entry.id}</td>
              <td>{entry.event_id}</td>
              <td>{entry.user_email}</td>
              <td><button onClick={() => {
                props.removeEntry(entry.id)
              }}>x</button></td>
          </tr>
        ) 
      })
      }
      </tbody>
    </table>
    </div>
  )
}


function PlayersTable ( props: {
  players: Player[],
  removePlayer: (user_email: string) => void
}) {
 
  return (
    <div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      {props.players.map((player) => {
        return (
          <tr key={player.email}>
              <td>{player.name}</td>
              <td>{player.email}</td>
              <td><button onClick={() => {
                props.removePlayer(player.email)
                console.log(player)
              }}>x</button></td>
          </tr>
        ) 
      })
      }
      </tbody>
    </table>
    </div>
  )
}


export function EventsTable ( props: {
  events: SSEvent[],
  removeEvent: (event_id: number) => void
}) {
 
  return (
    <div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Location</th>
          <th>Creator</th>
          <th>Locked</th>
          <th>Public</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      {props.events.map((event) => {
        return (
          <tr key={event.id}>
              <td>{event.id}</td>
              <td>{event.name}</td>
              <td>{event.location}</td>
              <td>{event.creator}</td>
              <td>{event.locked.toString()}</td>
              <td>{event.public.toString()}</td>
              <td><button onClick={() => {
                props.removeEvent(event.id)

              }}>x</button></td>
          </tr>
        ) 
      })
      }
      </tbody>
    </table>
    </div>
  )
}


function AdminPage() {
    const [reloadEvents, setReloadEvents] = useState(false);
    const [showEventForm, setShowEventForm] = useState(false);
  
    const [reloadPlayers, setReloadPlayers] = useState(false);
    const [showPlayerForm, setShowPlayerForm] = useState(false);
    const [playerButtonText, setPlayerButtonText] = useState("Add Player");
  
    const [reloadEntries, setReloadEntries] = useState(false);
    const [showEntryForm, setShowEntryForm] = useState(false);
    const [entryButtonText, setEntryButtonText] = useState("Add Entry");
    
    const [entries, setEntries] = useState([] as Entry[]);
    const [players, setPlayers] = useState([] as Player[]);
  
    const [events, setEvents] = useState([] as SSEvent[]);
  
    useEffect(() => {
      getEvents({ limit: 50 }).then((res) => {
        if ("count" in res){
          setEvents(res.events)
        } else {
          setEvents([])
        }
      });
      setReloadEvents(false);
    }, [reloadEvents])
  
    useEffect(() => {
      getPlayers().then((players) => {
        setPlayers(players)
      })
      setReloadPlayers(false);
    }, [reloadPlayers])
  
    useEffect(() => {
      getEntries().then((entries) => {
        setEntries(entries)
      })
      setReloadEntries(false);
    }, [reloadEntries])
  
    function removeEvent (id: number): void {
      deleteEvent(id)
      setReloadEvents(true);
    }
  
    function removePlayer (user_email: string): void {
      deletePlayer(user_email)
      setReloadPlayers(true)
    }
  
    function removeEntry (entry_id: number): void {
      deleteEntry(entry_id).then(() => {
        setReloadEntries(true);
      });
    }
  
    function submitEvent (event: SSEventBaseOptional): void {
      addEvent(event);
      setReloadEvents(true)
    }
  
    function submitPlayer (player: PlayerBase): void {
      addPlayer(player)
      setPlayerButtonText("Add Player")
      setShowPlayerForm(false)
      setReloadPlayers(true)
    }
  
    function submitEntry (entry: EntryBase): void {
      addEntry(entry)
      setEntryButtonText("Add Entry")
      setShowEntryForm(false)
      setReloadEntries(true)
    }
    
    const closeEventForm = () => {
      setShowEventForm(false);
    }

    return (

        <div>
        <div className="p-2 justify-center">
          <button className="bg-green-300 hover:bg-green-500 m-2" onClick={() => {
              if (!showPlayerForm) {
              setPlayerButtonText("Close Player Form")
              setShowPlayerForm(true)
              } else {
              setPlayerButtonText("Add Player")
              setShowPlayerForm(false)
              }
          }}>
              {playerButtonText} 
          </button>
          <button className="bg-green-300 hover:bg-green-500 m-2" onClick={() => {
              setShowEventForm(true)
            }
          }>
          Add Event 
        </button>
          <button className="bg-green-300 hover:bg-green-500 m-2" onClick={() => {
            if (!showEntryForm) {
            setEntryButtonText("Close Entry Form")
            setShowEntryForm(true)
            } else {
            setEntryButtonText("Add Entry")
            setShowEntryForm(false)
            }
        }}>
            {entryButtonText} 
        </button>
        </div>
        <h1 className="flex text-3xl font-bold justify-center">SS Players!</h1>
        <PlayersTable players={players} removePlayer={removePlayer} />
        <div className="justify-center flex">
          {
            showPlayerForm && <AddPlayerForm  addPlayer={submitPlayer}/>
          }
        </div>

        <h1 className="flex text-3xl font-bold justify-center">SS Events!</h1>
        <div className="justify-center flex">
          <EventsTable events={events} removeEvent={removeEvent}/>
        </div>
        {
          showEventForm && <Suspense fallback={<div>Loading...</div>}>
              <AddEventForm onCloseForm={closeEventForm} submitEvent={submitEvent}/>
            </Suspense>
        }

        <h1>SS Entries!</h1>
        {
        showEntryForm && <AddEntryForm  addEntry={submitEntry}/>
        }

        <EntriesTable entries={entries} removeEntry={removeEntry}/>
        </div>
    )
}


export default AdminPage;