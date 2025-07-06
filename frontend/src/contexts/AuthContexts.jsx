import axios from "axios";
import { createContext, useContext, useState } from "react";
import { StatusCodes } from 'http-status-codes';

import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext({});

const client = axios.create({
    baseURL: import.meta.env.VITE_VIDIFY_URL
})

export const AuthProvider = ({children}) => {
    const authContext = useContext(AuthContext);
    const [userData, setUserData] = useState(authContext);

    const router = useNavigate();

    const handleRegister = async(name, username, password) => {
        try {
            let request = await client.post("/register", {
                name: name,
                username: username,
                password: password
            });
            if(request.status === StatusCodes.CREATED){
                return request.data.message;
            }
        } catch (error) {
            throw error;
        }
    }

    const handleLogin = async(username, password) =>{
        try {
            let request = await client.post("/login", {
                username: username,
                password: password
            });
            if(request.status === StatusCodes.OK){
                localStorage.setItem("token", request.data.token);
                router("/home");
                return "Login Successful"
            }
        } catch (error) {
            throw error;
        }
    }

    const getHistoryOfUser = async()=>{
        try {
            let request = await client.get("/get_all_activity", {
                params: {
                    token: localStorage.getItem("token")
                }
            })
            return request.data;
        } catch (error) {
            throw error;
        }
    }

    const addToUserHistory = async(meetingCode) => {
        try {
            let request = await client.post("/add_to_activity", {
                token: localStorage.getItem("token"),
                meeting_code: meetingCode
            })
            return request;
        } catch (error) {
            throw error;
        }
    }

    const data = {
        userData, setUserData, getHistoryOfUser, addToUserHistory, handleRegister, handleLogin 
    }

    return(
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}