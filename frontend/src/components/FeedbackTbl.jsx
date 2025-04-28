import React, { useState } from 'react';

function FeedbackTbl() {
  const [showForm, setShowForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emails, setEmails] = useState([
    { sender: "George, me", subject: "(no subject)", date: "2024-04-28" },
    { sender: "info, client list", subject: "Building your client list", date: "2024-04-27" },
    { sender: "Customer Service", subject: "Automated customer service", date: "2024-04-26" },
    { sender: "Team Raw", subject: "Remote support tools over internet", date: "2024-04-25" },
    { sender: "Funding platform", subject: "Startup Funding Platform", date: "2024-04-24" },
    { sender: "All, Social", subject: "Social media marketing, research, transforming Market Research", date: "2024-04-23" },
  ]);

  // Handle delete email
  const handleDelete = (index) => {
    const updatedEmails = [...emails];
    updatedEmails.splice(index, 1);
    setEmails(updatedEmails);
  };

  return (
    <div className="p-6 relative">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Emails</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            setShowForm(true);
            setSelectedEmail(null);
          }}
        >
          Feedback
        </button>
      </div>

      {/* Email List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {emails.map((email, index) => (
          <div
            key={index}
            className="flex items-center px-4 py-2 border-b hover:bg-gray-50 space-x-2"
          >
            <div className="flex-1 font-medium text-gray-800 truncate">{email.sender}</div>
            <div className="flex-1 text-gray-600 truncate">{email.subject}</div>
            <div className="w-32 text-gray-400 text-sm text-right">{email.date}</div>
            <div className="flex items-center space-x-2 ml-2">
              <button
                className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
                onClick={() => {
                  setSelectedEmail({ ...email, index });
                  setShowUpdateForm(true);
                }}
              >
                Update
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                onClick={() => handleDelete(index)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Feedback / Update Modal */}
      {(showForm || (showUpdateForm && selectedEmail)) && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setShowForm(false);
                setShowUpdateForm(false);
                setSelectedEmail(null);
              }}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
              {showUpdateForm ? "Update Email" : "Feedback Form"}
            </h2>

            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();

                if (showUpdateForm && selectedEmail) {
                  const updatedEmails = [...emails];
                  updatedEmails[selectedEmail.index] = {
                    sender: e.target.name.value,
                    subject: e.target.subject.value,
                    date: e.target.date.value,
                  };
                  setEmails(updatedEmails);
                  setShowUpdateForm(false);
                  setSelectedEmail(null);
                } else {
                  // Handle Feedback form submission here if needed
                  alert("Feedback submitted successfully!");
                  setShowForm(false);
                }
              }}
            >
              {/* If Update, pre-fill data; else blank */}
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                defaultValue={showUpdateForm ? selectedEmail?.sender : ''}
                className="w-full border p-2 rounded-lg"
                required
              />

              {/* Only show Email input if Feedback */}
              {!showUpdateForm && (
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  className="w-full border p-2 rounded-lg"
                  required
                />
              )}

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                defaultValue={showUpdateForm ? selectedEmail?.subject : ''}
                className="w-full border p-2 rounded-lg"
                required
              />

              {/* Only show Rating if Feedback */}
              {!showUpdateForm && (
                <select
                  name="rating"
                  className="w-full border p-2 rounded-lg"
                  required
                >
                  <option value="">Select Rating</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              )}

              <input
                type="date"
                name="date"
                defaultValue={showUpdateForm ? selectedEmail?.date : ''}
                className="w-full border p-2 rounded-lg"
                required
              />

              {/* Only show Message textarea if Feedback */}
              {!showUpdateForm && (
                <textarea
                  name="message"
                  placeholder="Your Feedback"
                  rows="4"
                  className="w-full border p-2 rounded-lg"
                  required
                ></textarea>
              )}

              <button
                type="submit"
                className={`w-full ${showUpdateForm ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold py-2 px-4 rounded-lg`}
              >
                {showUpdateForm ? "Update" : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedbackTbl;
