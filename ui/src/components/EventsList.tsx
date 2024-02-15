
import { SSEvent } from "../types/datatypes";

import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

const EventList = (props : {
    events: SSEvent[],
    navigateToEventPage: (eventId: number) => void,
    onDelete: (eventId: number) => void
}) => {

    return (
        <List>
            {props.events.map((event) => {
            return (
                <ListItem key={event.id}>
                <div className="flex justify-center text-left px-[5%]">
                    <ListItemButton onClick={() => {props.navigateToEventPage(event.id)}}>
                    <ListItemText 
                        primary={event.name}
                        secondary={new Date(event.created_date).toLocaleDateString(
                        undefined,
                        {
                            weekday: "short",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        }
                        )}/>      
                    </ListItemButton>      
                </div>
                <div className="flex justify-center text-right px-[5%]">
                    <ListItemButton onClick={() => {props.onDelete(event.id)}}>
                        <DeleteIcon/>
                    </ListItemButton>
                </div>
                </ListItem>
            );
            })}
        </List>

    )

}





export default EventList;