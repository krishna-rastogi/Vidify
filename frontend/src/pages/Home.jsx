import { useContext, useState } from "react";

import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import withAuth from "../utils/withAuth";

import { AuthContext } from "../contexts/AuthContexts";

import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

import RestoreIcon from "@mui/icons-material/Restore";
import TextField from "@mui/material/TextField";

function Home() {
  let navigate = useNavigate();
  let [meetingCode, setMeetingCode] = useState("");

  const {addToUserHistory} = useContext(AuthContext);
  let handleJoinVideoCall = async() => {
      await addToUserHistory(meetingCode);
      navigate(`/${meetingCode}`);
  }

  return (
    <>
      <div className="navbar">
        <div style={{ display: "flex", alignItems: "center" }}>
          <h2>Vidify</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={()=>navigate("/history")}>
            <RestoreIcon />
          </IconButton>
          <p>History</p>
          <Button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/auth");
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="meetContainer">
        <div className="leftPanel">
            <h2>Empowering seamless conversations, anywhere and anytime</h2>
            <div className="inputSection">
                <TextField onChange={e=> setMeetingCode(e.target.value)} id="outlined" label="Meeting Code" variant="outlined"></TextField>
                <Button onClick={handleJoinVideoCall} variant="contained">Join</Button>
            </div>
        </div>
        <div className="rightPanel">
            <img src="/logo3.png" alt="" />
        </div>
      </div>
    </>
  );
}

export default withAuth(Home);
