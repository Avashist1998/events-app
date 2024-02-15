import { createContext } from "react";
import { UserInfo } from "../types/datatypes";

type UserContextType = {
    userData: UserInfo | null;
    setUserData: (userInfo: UserInfo | null) => void;
};

const CurrentUserContext = createContext<UserContextType>({
    userData: null,
    setUserData: () => {},
});


export { CurrentUserContext };
