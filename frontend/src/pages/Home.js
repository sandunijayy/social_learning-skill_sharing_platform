import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';


export default function Home() {
  const [users, setUsers] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const result = await axios.get("http://localhost:8080/users");
    setUsers(result.data);
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:8080/user/${id}`);
    loadUsers();
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(id);
      }
    });
  };

  return (
    <div className="container my-5">
      <div className="row gy-4">
        {users.map((user, index) => (
          <div className="col-md-4" key={user.id}>
            <div className="card shadow-sm rounded-4 h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold">{user.name}</h5>
                <p className="card-text text-muted mb-2">{user.username}</p>
                <p className="card-text"><small className="text-secondary">Target Date: {user.email}</small></p>

                <div className="mt-auto d-flex gap-2">
                  <Link
                    className="btn btn-sm btn-primary flex-grow-1"
                    to={`/viewuser/${user.id}`}
                  >
                    View
                  </Link>
                  <Link
                    className="btn btn-sm btn-outline-primary flex-grow-1"
                    to={`/edituser/${user.id}`}
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-sm btn-danger flex-grow-1"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this learning plan?")) {
                        deleteUser(user.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="col-12 text-center mt-5">
            <h4>No Learning Plans found</h4>
            <Link to="/adduser" className="btn btn-success mt-3">
              Add New Plan
            </Link>
          </div>
        )}
      </div>
    </div>
  );
  
}
