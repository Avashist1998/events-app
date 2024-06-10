import { useState, useContext, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../contexts/UserContext";
import { Button, CircularProgress } from "@mui/material";

import { addUser, logIn } from "../api/users";
import { UserSignUp, UserLogin } from "../types/datatypes";
import SignUpUserForm from "../forms/SignUpUserFrom";
import LogInForm from "../forms/LogInForm";
import { getCookie } from "../api/base";

const MessageAlert = lazy(() => import("../components/MessageAlert"));

const SignUpPage = () => {

    const {
        setUserData
    } = useContext(CurrentUserContext);

    const [pageState, setPageState] = useState("signUp" as "signUp" | "logIn");

    const [errMsg, setErrMsg] = useState("");
    const [addPlayerMsg, setAddPlayerMsg] = useState("");

    const navigate = useNavigate();

    const resetScreen =  () => {
        setErrMsg("");
        setAddPlayerMsg("");
    }

    const signUpUser = (user: UserSignUp) => {
        resetScreen();
        addUser(user).then((res) => {
            if ("name" in res) {
                setAddPlayerMsg(`Player with name = ${res.name} and email ${res.email} has been created`)
            } else {
                setErrMsg(res.message)
            }
        }).catch(() => {
            setErrMsg("API is currently down, please try again at a different time.")
        })
    }

    const logInUser = (user: UserLogin) => {
        resetScreen();
        logIn(user).then((res) => {
            if ("name" in res) {
                setUserData(res);
                const auth = getCookie("Authorization")
                if (auth) {
                    sessionStorage.setItem("token", auth);
                }
                sessionStorage.setItem("userData", JSON.stringify(res));
                navigate("../");
            } else {
                console.log(res)
                setErrMsg(res.message)
            }
        }).catch(() => {
            setErrMsg("API is currently down, please try again at a different time.")
        })
    }


    return (
        <div className="p-[20px]">
            <div className="flex justify-center">            
                <Button color="primary" variant="contained" sx={{borderRadius: 0, }} disabled={pageState=="signUp"} onClick={() => {setPageState("signUp")}}>
                    Sign Up
                </Button>
                <Button color="success" variant="contained" sx={{borderRadius: 0, }} disabled={pageState=="logIn"} onClick={() => {setPageState("logIn")}}>
                    Log In
                </Button>
            </div>
            <div className="flex justify-center">
                { pageState === "signUp" ?
                    <div>
                        <div className="flex justify-center">
                            <h1 className="text-8xl font-bold m-5">Sign up</h1>
                        </div>
                        <Suspense fallback={<CircularProgress/>}>
                            <SignUpUserForm submitUser={signUpUser}>
                                <MessageAlert isError={errMsg !== ""} msg={errMsg === "" ? addPlayerMsg : errMsg}/>
                            </SignUpUserForm>
                        </Suspense>
                    </div> :
                    <div>
                        <div className="flex justify-center">
                            <h1 className="text-8xl font-bold m-5">Log In</h1>
                        </div>
                        <LogInForm logInUser={logInUser}>
                            <MessageAlert isError={errMsg !== ""} msg={errMsg === "" ? addPlayerMsg : errMsg}/>
                        </LogInForm>
                    </div>
                }
                </div>
        </div>
    )
}

export default SignUpPage;