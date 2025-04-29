import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  const { name, username, email } = user;

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!name.trim()) formErrors.name = "Learning Plan Title is required!";
    if (!username.trim()) formErrors.username = "Description is required!";
    if (!email.trim()) formErrors.email = "Date is required!";
    return formErrors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length !== 0) {
      setErrors(formErrors);
      return;
    }
    await axios.put(`http://localhost:8080/user/${id}`, user);
    navigate("/");
  };

  const loadUser = async () => {
    const result = await axios.get(`http://localhost:8080/user/${id}`);
    setUser(result.data);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-5">
              <h2 className="card-title text-center mb-4 fw-bold">
                Edit Learning Plan
              </h2>

              <form onSubmit={(e) => onSubmit(e)}>
                <div className="mb-4">
                  <label htmlFor="Name" className="form-label fw-semibold">
                    Learning Plan Title
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${errors.name ? "is-invalid" : ""}`}
                    placeholder="Enter your learning plan title"
                    name="name"
                    value={name}
                    onChange={(e) => onInputChange(e)}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="mb-4">
                  <label htmlFor="Username" className="form-label fw-semibold">
                    Description
                  </label>
                  <textarea
                    className={`form-control form-control-lg ${errors.username ? "is-invalid" : ""}`}
                    placeholder="Describe your learning plan..."
                    name="username"
                    value={username}
                    onChange={(e) => onInputChange(e)}
                    rows="3"
                  />
                  {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                </div>

                <div className="mb-4">
                  <label htmlFor="Email" className="form-label fw-semibold">
                    Target Date
                  </label>
                  <input
                    type="date"
                    className={`form-control form-control-lg ${errors.email ? "is-invalid" : ""}`}
                    name="email"
                    value={email}
                    onChange={(e) => onInputChange(e)}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg px-5 shadow-sm"
                  >
                    Update Plan
                  </button>
                  <Link
                    className="btn btn-outline-secondary btn-lg px-5"
                    to="/"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
