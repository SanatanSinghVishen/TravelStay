import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="logo">
                    <i className="fa-regular fa-compass"></i>
                    TravelStay
                </Link>
                <div className="nav-links">
                    <Link to="/listings" className="nav-link">Explore</Link>
                    {user ? (
                        <>
                            <Link to="/listings/new" className="nav-link">Airbnb your home</Link>
                            <button onClick={handleLogout} className="nav-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px' }}>Logout</button>
                            <div className="btn-primary" style={{ borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Log in</Link>
                            <Link to="/signup" className="btn-primary">Sign up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
