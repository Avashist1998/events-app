import { Table, TableContainer, TableRow, TableCell, TableHead, TableBody, Paper, TablePagination, TableFooter } from "@mui/material";
import { SSEvent } from "../types/datatypes";


import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PublicIcon from '@mui/icons-material/Public';
import PublicOffIcon from '@mui/icons-material/PublicOff';

function EventsTable ( props: {
    page: number,
    events: SSEvent[],
    rowPerPage: number,
    totalCount: number,
    navigateToEventPage: (eventId : number) => void,
    onParamChange: (offset?: number, limit?: number, evenType?: "Both" | "Private" | "Public", searchTerm?: string) => void,
  }) {

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
      ) => {
        console.log(event?.currentTarget.value);
        props.onParamChange(newPage)
    };


    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        props.onParamChange(props.page, newRowsPerPage)
        
      };
    
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell className="w-[28%]" >Name</TableCell>
                        <TableCell className="w-[28%]">Location</TableCell>
                        <TableCell className="w-[28%]">Date</TableCell>
                        <TableCell className="w-[16%]">Locked</TableCell>
                        <TableCell className="w-[16%]">Public</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                {props.events.map((event) => {
                return (
                        <TableRow key={event.id} onClick={() => {
                            props.navigateToEventPage(event.id)
                        }}
                        
                        className="cursor-pointer hover:bg-slate-200">
                            <TableCell className="w-[28%]">{event.name}</TableCell>
                            <TableCell className="w-[28%]">{event.location}</TableCell>
                            <TableCell className="w-[28%]">{new Date(event.event_date).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}</TableCell>
                            <TableCell className="w-[15%]">
                                { event.locked ? <LockIcon/> : <LockOpenIcon/>}
                            </TableCell>
                            <TableCell className="w-[16%]" >{event.public ? <PublicIcon/> : <PublicOffIcon/>}</TableCell>
                        </TableRow>
                        ) 
                    })
                }
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            count={props.totalCount}
                            page={props.page}
                            onPageChange={handleChangePage}
                            rowsPerPage={props.rowPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}

export default EventsTable;