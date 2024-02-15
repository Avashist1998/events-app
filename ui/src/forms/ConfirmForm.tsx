import {
    Button
} from "@mui/material";

const ConfirmForm = ( props: {
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel: () => void,
}) => {

    return (
    <>
        <div>
            <div className="justify-center flex text-center">
                <h1 className="text-4xl font-bold justify-center flex">{props.title}</h1>
            </div>
            <div className="justify-center flex p-2 text-center">
                <h1 className="text-2xl font-bold justify-center flex">{props.message}</h1>
            </div>
            <div className="justify-center flex p-2">
                <div className="m-2">
                    <Button variant="contained" color="success" onClick={props.onConfirm}>
                        Confirm
                    </Button>
                </div>
                <div className="m-2">
                    <Button variant="contained" color="error" onClick={props.onCancel}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    </>
    )
}


export default ConfirmForm;