import React, { useState } from "react";

const charityTypes = [
    "Animal Welfare",
    "Animal Health",
    "Environmental",
    "Education",
    "Health",
    "Other",
];

const CharityReg = () => {
    const [formData, setFormData] = useState({
        charityName: "",
        charityType: [],
        registrationNumber: "",
        websiteLinks: "",
        email: "",
        phone: "",
        address: "",
        contactPersonName: "",
        designation: "",
        description: "",
        logo: null,
        proof: null,
        termsAgreed: false,
        privacyAgreed: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "checkbox") {
            setFormData({ ...formData, [name]: checked });
        } else if (type === "file") {
            setFormData({ ...formData, [name]: files[0] });
        } else if (name === "charityType") {
            const options = e.target.options;
            const selected = [];
            for (let i = 0; i < options.length; i++) {
                if (options[i].selected) selected.push(options[i].value);
            }
            setFormData({ ...formData, charityType: selected });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        alert("Form submitted! Check console for data.");
        console.log(formData);
    };

    return (
        <form className="container py-4" onSubmit={handleSubmit} style={{ maxWidth: 700 }}>
            <h2 className="mb-4">Charity Registration</h2>
            {/* Charity Details */}
            <div className="card mb-4">
                <div className="card-header bg-secondary text-white">Charity Details</div>
                <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label">Charity Name <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            name="charityName"
                            value={formData.charityName}
                            onChange={handleChange}
                            placeholder='NGEO Name'
                            required
                        />
                    </div>
                    <select
                        name="charityType"
                        className="form-select"
                        value={formData.charityType}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Select Charity Type</option>
                        {charityTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    <div className="mb-3">
                        <label className="form-label">Registration Number <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder='L12345'
                            name="registrationNumber"
                            value={formData.registrationNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Website or Social Media Links</label>
                        <input
                            type="url"
                            className="form-control"
                            name="websiteLinks"
                            value={formData.websiteLinks}
                            onChange={handleChange}
                            placeholder="https://example.com"
                        />
                    </div>
                </div>
            </div>
            {/* Contact Information */}
            <div className="card mb-4">
                <div className="card-header bg-secondary text-white">Contact Information</div>
                <div className="card-body row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Email Address <span className="text-danger">*</span></label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Phone Number <span className="text-danger">*</span></label>
                        <input
                            type="tel"
                            className="form-control"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="+1234567890"
                        />
                    </div>
                    <div className="col-12">
                        <label className="form-label">Address</label>
                        <textarea
                            className="form-control"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows={2}
                            placeholder="Street, City, State, Country, Postal Code"
                        />
                    </div>
                </div>
            </div>
            {/* Representative Information */}
            <div className="card mb-4">
                <div className="card-header bg-secondary text-white">Representative Information</div>
                <div className="card-body row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Full Name of Contact Person <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            name="contactPersonName"
                            value={formData.contactPersonName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Designation/Role</label>
                        <input
                            type="text"
                            className="form-control"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            placeholder="Founder, Volunteer, Coordinator, etc."
                        />
                    </div>
                </div>
            </div>
            {/* Additional Information */}
            <div className="card mb-4">
                <div className="card-header bg-secondary text-white">Additional Information</div>
                <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label">Short Description / Mission Statement</label>
                        <textarea
                            className="form-control"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Upload Logo or Certification Documents</label>
                        <input
                            type="file"
                            className="form-control"
                            name="logo"
                            accept="image/*"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Proof of Legitimacy (PDF/Image Upload)</label>
                        <input
                            type="file"
                            className="form-control"
                            name="proof"
                            accept="application/pdf,image/*"
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
            {/* Consent / Agreements */}
            <div className="card mb-4">
                <div className="card-header bg-secondary text-white">Consent / Agreements</div>
                <div className="card-body">
                    <div className="form-check mb-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            name="termsAgreed"
                            checked={formData.termsAgreed}
                            onChange={handleChange}
                            required
                            id="termsAgreed"
                        />
                        <label className="form-check-label" htmlFor="termsAgreed">
                            I agree to the Terms and Conditions <span className="text-danger">*</span>
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            name="privacyAgreed"
                            checked={formData.privacyAgreed}
                            onChange={handleChange}
                            required
                            id="privacyAgreed"
                        />
                        <label className="form-check-label" htmlFor="privacyAgreed">
                            I agree to the Privacy Policy <span className="text-danger">*</span>
                        </label>
                    </div>
                </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-100">Submit Registration</button>
        </form>
    );
};

export default CharityReg;
