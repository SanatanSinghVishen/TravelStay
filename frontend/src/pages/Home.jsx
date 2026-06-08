import { useEffect, useState } from "react";
import api from "../lib/axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

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
            <Helmet>
                <title>TravelStay — Find your next adventure</title>
                <meta name="description" content="Discover and book amazing homes, apartments, and unique places to stay around the world with TravelStay." />
            </Helmet>
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
