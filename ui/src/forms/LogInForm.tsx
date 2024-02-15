import { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";

import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { UserLogin } from "../types/datatypes";



const LogInForm = ( props: {
    logInUser : (user: UserLogin) => void,
    children?: React.ReactNode,
}) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [enableSignUpButton, setEnableSignUpButton] = useState(false);

    useEffect(() => {
        let val = true;
        if (email === "" || !email.includes("@") || !email.includes(".")) {
            val = val && false;
            setEmailError(true)
        } else {
            setEmailError(false);
        }
        if (password === "" || password.length < 8) {
            val = val && false;
            setPasswordError(true);
        } else {
            setPasswordError(false);
        }
        setEnableSignUpButton(val);
    }, [email, password])

    const logInUser = () => {
        const newUser = {
            email: email,
            password: password,
        } as UserLogin;
        props.logInUser(newUser);
    }
    return (
    <>
        <div>
            <div className="justify-center flex p-2">
                <TextField id="creatorEmail" label="Email" value={email} required onChange={e => setEmail(e.target.value)} error={emailError}/>
            </div>
            <div className="justify-center flex p-2">
                <TextField id="creatorPassword" label="Password" value={password} required onChange={e => setPassword(e.target.value)} type="password" error={passwordError}/>
            </div>
        </div>
        <div className="justify-center flex p-2">
            <Button startIcon={<PersonAddAltIcon/>} variant="contained" color="success" disabled={!enableSignUpButton} onClick={logInUser}>
                Log In
            </Button>
        </div>
        {props.children}
    </>
    )
}

export default LogInForm;