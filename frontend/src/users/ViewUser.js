import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function ViewUser() {
  const [user, setUser] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const result = await axios.get(`http://localhost:8080/user/${id}`);
      setUser(result.data);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  if (!user) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <h5 className="mt-3">Loading Learning Plan...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card border-0 shadow-lg rounded-4">
            <div className="card-header bg-primary text-white text-center rounded-top-4 py-4">
              <h2 className="mb-0 fw-bold">Learning Plan Details</h2>
            </div>
            <div className="card-body p-5">
              <div className="mb-4">
                <h5 className="fw-semibold">Learning Plan Title</h5>
                <p className="text-muted">{user.name}</p>
              </div>

              <div className="mb-4">
                <h5 className="fw-semibold">Description</h5>
                <p className="text-muted">{user.username}</p>
              </div>

              <div className="mb-4">
                <h5 className="fw-semibold">Target Date</h5>
                <p className="text-muted">{user.email}</p>
              </div>

              <div className="text-center mt-4">
                <Link to="/" className="btn btn-outline-primary btn-lg px-5 shadow-sm">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
