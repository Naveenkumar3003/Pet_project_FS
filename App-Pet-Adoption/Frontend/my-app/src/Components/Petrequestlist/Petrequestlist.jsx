import React, { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import AdminNavigationbar from "../Admin/AdminNavigationbar";
import './PetRequestList.css';

const PetRequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionFeedback, setActionFeedback] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    setLoading(true);
    setError(null);
    apiClient
      .get("/api/adopts")
      .then((res) => {
        setRequests(res.data.adoptRequests || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching requests:", err);
        setError("Failed to fetch requests.");
        setLoading(false);
      });
  };

  const handleStatusUpdate = (id, status) => {
    apiClient
      .put(`/api/adopts/${id}/status`, { status })
      .then((res) => {
        setActionFeedback({
          show: true,
          message: `Request ${status} successfully.`,
          type: status === 'approved' ? 'success' : 'info'
        });
        setRequests(prevRequests =>
          prevRequests.map(req =>
            req._id === id ? { ...req, status } : req
          )
        );
        setTimeout(() => setActionFeedback({ show: false, message: "", type: "" }), 3000);
      })
      .catch((err) => {
        console.error(`Error updating request status:`, err);
        setActionFeedback({
          show: true,
          message: `Failed to ${status} request. Please try again.`,
          type: 'error'
        });
        setTimeout(() => setActionFeedback({ show: false, message: "", type: "" }), 3000);
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to remove this request record?")) return;
    apiClient
      .delete(`/api/adopts/${id}`)
      .then(() => {
        setRequests(prevRequests => prevRequests.filter(request => request._id !== id));
      })
      .catch((err) => {
        console.error("Error deleting request:", err);
      });
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <AdminNavigationbar />
      <div className="request-list-container flex-grow-1 p-4">
        <h2 className="request-list-title mb-3">Adoption Requests</h2>

        {actionFeedback.show && (
          <div className={`feedback-banner feedback-${actionFeedback.type} mb-3`}>
            {actionFeedback.message}
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-muted">Loading adoption requests...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : requests.length === 0 ? (
          <div className="alert alert-info">No adoption requests found.</div>
        ) : (
          <div className="table-responsive-container">
            <table className="request-table">
              <thead>
                <tr>
                  <th>Pet Name</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request._id}>
                    <td>{request.petsname || "-"}</td>
                    <td>{request.fullName || "-"}</td>
                    <td>{request.email || "-"}</td>
                    <td>{request.phone || "-"}</td>
                    <td>
                      <span className={`status-badge status-${request.status || 'pending'}`}>
                        {(request.status || 'pending').charAt(0).toUpperCase() + (request.status || 'pending').slice(1)}
                      </span>
                    </td>
                    <td className="action-buttons-cell">
                      {(!request.status || request.status === 'pending') ? (
                        <>
                          <button
                            className="action-button approve-button"
                            onClick={() => handleStatusUpdate(request._id, 'approved')}
                          >
                            Approve
                          </button>
                          <button
                            className="action-button decline-button"
                            onClick={() => handleStatusUpdate(request._id, 'rejected')}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          className="action-button delete-button"
                          onClick={() => handleDelete(request._id)}
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetRequestList;