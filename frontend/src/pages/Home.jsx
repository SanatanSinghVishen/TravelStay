import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const Home = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const res = await api.get("/listings");
                setListings(res.data);
            } catch (err) {
                console.error("Failed to fetch listings", err);
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, []);

    if (loading) return <div className="spinner"></div>;

    return (
        <div className="container">
            <div className="listings-grid">
                {listings.map((listing) => (
                    <Link to={`/listings/${listing._id}`} key={listing._id} className="listing-card">
                        <div className="card-img-container">
                            <img src={listing.image?.url} alt={listing.title} className="card-img" />
                        </div>
                        <div className="card-info">
                            <div className="card-title">{listing.title}</div>
                            <div className="card-loc">{listing.location}, {listing.country}</div>
                            <div className="card-price">
                                <span className="price-bold">&#8377; {listing.price?.toLocaleString("en-IN")}</span> night
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;
