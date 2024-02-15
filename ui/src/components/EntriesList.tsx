import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import { Entry } from "../types/datatypes";
import { ListItemButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useContext } from "react";
import { CurrentUserContext } from "../contexts/UserContext";

const EntriesList = (props: {
  entries: Entry[];
  children?: React.ReactNode;
  onDelete: (entryId: number) => void;
}) => {

  const { userData } = useContext(CurrentUserContext);

  return (
    <>
      {props.children}
      <div className="flex justify-center">
        <h1 className="text-2xl font-bold">Attendees</h1>
      </div>
      <div className="flex justify-center">
        <List>
          {props.entries.map((entry) => {
            return (
              <ListItem key={entry.id} className="flex justify-between items-center">
                  <ListItemText
                    className="items-start px-[5%] text-center"
                    primary={entry.user_email}
                    secondary={new Date(entry.created_date).toLocaleDateString(
                      undefined,
                      {
                        weekday: "short",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  />
                  <div className="mx-5">
                    <ListItemButton
                      className="px-[5%] items-left"
                      disabled={userData?.email !== entry.user_email}
                      onClick={() => {
                        props.onDelete(entry.id);
                      }}
                    >
                      <DeleteIcon />
                    </ListItemButton>
                  </div>
                </ListItem>
            );
          })}
        </List>
      </div>
    </>
  );
};

export default EntriesList;
