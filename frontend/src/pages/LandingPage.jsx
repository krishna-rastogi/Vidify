import "../App.css";
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage(){
    const router = useNavigate();

    return(
        <div className="landingPageContainer">
            <nav>
                <div className="navHeader">
                    <h2>Vidify</h2>
                </div>
                <div className="navlist">
                    <p onClick={() => router("/sde235gst")}>Join as Guest</p>
                    <p onClick={() => router("/auth")}>Register</p>
                    <div onClick={() => router("/auth")} role="button">Login</div>
                </div>
            </nav>

            <div className="landingMainContainer">
                <div>
                    <h1><span style={{color: "#FF9839"}}>Connect</span> with your Loved Ones</h1>
                    <p>Cover long distances by video calls on Vidify</p>
                    <div role="button" className="startBtn">
                        <Link to={"/auth"}>Get Started</Link>
                    </div>
                </div>
                <div>
                    <img className="mobileImg" src="/mobile.png" alt="" />
                </div>
            </div>
        </div>
    );
}