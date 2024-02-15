import { Link } from "react-router-dom"

import { Alert } from "@mui/material"

const MessageAlert = (
    props: {
        msg: string,
        isError: boolean,
        link?: string
    }

    ) => {

    if (props.msg !== "") {
        return (
            <Alert severity={props.isError ? "error" : "success"} >{props.msg}{" "}
                
                {props.link !== undefined && 
                    <Link to={props.link}>
                        Click here
                    </Link>
                }
            
            </Alert>
        )
    }
    return (
        <>
        </>
    )
}


export default MessageAlert;