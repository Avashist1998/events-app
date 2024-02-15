import { useState } from "react";

import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";



const EventFilterForm = (props: {
    onSubmit: (searchTerm: string, type: "Both" | "Private" | "Public") => void,
}) => {
    const [type, setType] = useState<"Both" | "Private" | "Public">("Both");
    const [searchText, setSearchText] = useState("");


    const onSubmit = () => {
        props.onSubmit(searchText, type);
    }
    return (
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 my-2">
            <div className="my-2">
                <TextField  id="searchText" variant="standard" value={searchText} onChange={e => {
                    setSearchText(e.target.value);
                }} />
            </div>
            <div className="mx-5 my-2">
                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="type-select-label">Type</InputLabel>
                        <Select
                            labelId="type-select-label"
                            id="type-select"
                            value={type}
                            label="Age"
                            onChange={(e) => {setType(e.target.value as "Both" | "Private" | "Public")}}
                        >
                            <MenuItem value={"Both"}>Both</MenuItem>
                            <MenuItem value={"Private"}>Private</MenuItem>
                            <MenuItem value={"Public"}>Public</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </div>
            <div className="mx-5 my-2 py-2">
                     <Button onClick={onSubmit} startIcon={<SearchIcon/>} variant="contained" color="success">
                     Submit
                </Button>
            </div>
        </div>
    )
}


export default EventFilterForm;