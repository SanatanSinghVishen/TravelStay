import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ListingDetail = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    const [review, setReview] = useState({ rating: 5, comment: "" });

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await api.get(`/listings/${id}`);
                setListing(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchListing();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`/listings/${id}`);
            navigate("/");
        } catch (err) {
            alert("Failed to delete");
        }
    }

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/listings/${id}/reviews`, { review });
            navigate(0); // Refresh page
        } catch (err) {
            alert("Failed to post review");
        }
    }

    const handleReviewDelete = async (reviewId) => {
        try {
            await api.delete(`/listings/${id}/reviews/${reviewId}`);
            navigate(0);
        } catch (err) {
            alert("Failed to delete review");
        }
    }

    if (loading) return <div className="spinner"></div>;
    if (!listing) return <div className="container">Listing not found</div>;

    return (
        <div className="container detail-container">
            <div className="detail-header">
                <h1 className="detail-title">{listing.title}</h1>
                <p className="card-loc">{listing.location}, {listing.country}</p>
            </div>

            <div className="detail-img-container">
                <img src={listing.image?.url} alt={listing.title} className="detail-img" />
            </div>

            <div className="detail-info">
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '22px', marginBottom: '16px' }}>Hosted by {listing.owner?.username}</h2>
                    <p>{listing.description}</p>
                    <h3 style={{ marginTop: '24px' }}>&#8377; {listing.price?.toLocaleString("en-IN")}</h3>

                    {user && listing.owner && user._id === listing.owner._id && (
                        <button onClick={handleDelete} className="btn-primary" style={{ marginTop: '20px', background: 'var(--dark)' }}>Delete Listing</button>
                        // Edit button could go here
                    )}

                    <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid #DDDDDD' }} />

                    {/* Reviews Section */}
                    <h3>Reviews</h3>

                    {user && (
                        <form onSubmit={handleReviewSubmit} style={{ margin: '20px 0', maxWidth: '500px' }}>
                            <div className="form-group">
                                <label>Rating</label>
                                <select
                                    value={review.rating}
                                    onChange={(e) => setReview({ ...review, rating: parseInt(e.target.value) })}
                                    className="form-input"
                                >
                                    <option value="5">5 - Amazing</option>
                                    <option value="4">4 - Very Good</option>
                                    <option value="3">3 - Average</option>
                                    <option value="2">2 - Not Good</option>
                                    <option value="1">1 - Terrible</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Comment</label>
                                <textarea
                                    className="form-input"
                                    rows="3"
                                    value={review.comment}
                                    onChange={(e) => setReview({ ...review, comment: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                            <button className="btn-primary">Submit Review</button>
                        </form>
                    )}

                    <div style={{ marginTop: '20px' }}>
                        {listing.reviews && listing.reviews.map(r => (
                            <div key={r._id} style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                <strong>{r.author?.username}</strong>
                                <span style={{ color: '#FFB400', marginLeft: '10px' }}>
                                    {"★".repeat(r.rating)}
                                </span>
                                <p style={{ marginTop: '4px' }}>{r.comment}</p>
                                {user && r.author && user._id === r.author._id && (
                                    <button onClick={() => handleReviewDelete(r._id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                                )}
                            </div>
                        ))}
                    </div>

                </div>

                <div className="host-card">
                    <h3>Reserve</h3>
                    <p style={{ marginTop: '10px' }}>This is a demo app. Booking is not implemented yet.</p>
                </div>
            </div>
        </div>
    );
};

export default ListingDetail;
