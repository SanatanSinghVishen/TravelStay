import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "", description: "", price: "", location: "", country: ""
    });
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create FormData for Multipart upload
        const data = new FormData();
        data.append("listing[title]", formData.title);
        data.append("listing[description]", formData.description);
        data.append("listing[price]", formData.price);
        data.append("listing[location]", formData.location);
        data.append("listing[country]", formData.country);
        if (file) data.append("listing[image]", file);

        try {
            await api.post("/listings", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            navigate("/");
        } catch (err) {
            console.error(err);
            alert("Failed to create listing");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    return (
        <div className="auth-container" style={{ maxWidth: '800px' }}>
            <h2 className="detail-title">Add a New Listing</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-group">
                    <label className="form-label">Title</label>
                    <input name="title" className="form-input" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea name="description" className="form-input" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Image</label>
                    <input type="file" className="form-input" onChange={(e) => setFile(e.target.files[0])} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Price</label>
                    <input type="number" name="price" className="form-input" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Location</label>
                    <input name="location" className="form-input" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Country</label>
                    <input name="country" className="form-input" onChange={handleChange} required />
                </div>
                <button className="btn-primary">Create Listing</button>
            </form>
        </div>
    );
};

export default CreateListing;
