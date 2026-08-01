import { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editNote, setEditNote] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [tenant, setTenant] = useState(null);
  const [limitReached, setLimitReached] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchNotes = async () => {
    try {
      const { data } = await API.get("/notes/fetchNote");
      setNotes(data.notes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTenant = async () => {
    try {
      const { data } = await API.get("/tenants");
      setTenant(data.tenant);
      // Check if limit reached
      if (data.tenant.plan === "Free" && notes.length >= data.tenant.noteLimit) {
        setLimitReached(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNote = async (id) => {
    if (!confirm("Delete this note?")) return;
    try {
      await API.delete(`/notes/deleteNote/${id}`);
      setNotes(notes.filter((n) => n._id !== id));
      setLimitReached(false);
    } catch (error) {
      alert("Error deleting note");
    }
  };

  const handleEdit = (note) => {
    setEditNote(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleUpdate = async (id) => {
    try {
      const { data } = await API.put(`/notes/updateNote/${id}`, {
        title: editTitle,
        content: editContent,
      });
      setNotes(notes.map((n) => (n._id === id ? data.note : n)));
      setEditNote(null);
    } catch (error) {
      alert("Error updating note");
    }
  };

  const handleUpgrade = async () => {
    try {
      await API.post(`/tenants/${tenant.slug}/upgrade`);
      alert("Upgraded to Pro! You can now create unlimited notes.");
      setLimitReached(false);
      fetchTenant();
    } catch (error) {
      alert("Upgrade failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleAddNote = () => {
    if (limitReached) {
      alert("Note limit reached! Upgrade to Pro.");
      return;
    }
    navigate("/createNote");
  };

  useEffect(() => {
    fetchNotes();
    fetchTenant();
  }, []);

  // Check limit after notes load
  useEffect(() => {
    if (tenant && tenant.plan === "Free" && notes.length >= tenant.noteLimit) {
      setLimitReached(true);
    } else {
      setLimitReached(false);
    }
  }, [notes, tenant]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Notes</h1>
        <div className="flex items-center gap-3">
          {tenant && (
            <span className={`text-sm px-2 py-1 rounded font-semibold ${
              tenant.plan === "Pro"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}>
              {tenant.plan} Plan
            </span>
          )}
          <span className="text-sm text-gray-500">{user.role}</span>
          <button
            onClick={handleLogout}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Upgrade to Pro Banner */}
      {limitReached && tenant?.plan === "Free" && (
        <div className="bg-yellow-50 border border-yellow-300 rounded p-4 mb-4 flex justify-between items-center">
          <div>
            <p className="font-semibold text-yellow-800">Note limit reached!</p>
            <p className="text-sm text-yellow-700">
              You've used {notes.length}/{tenant.noteLimit} notes on Free plan.
            </p>
          </div>
          {user.role === "Admin" && (
            <button
              onClick={handleUpgrade}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 text-sm font-semibold"
            >
              Upgrade to Pro
            </button>
          )}
          {user.role === "Member" && (
            <p className="text-sm text-yellow-700 font-semibold">
              Ask your Admin to upgrade.
            </p>
          )}
        </div>
      )}

      {/* Add Note Button */}
      <button
        onClick={handleAddNote}
        disabled={limitReached}
        className={`mb-4 px-4 py-2 rounded text-white ${
          limitReached
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        + Add Note
      </button>

      {/* Notes List */}
      {notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li key={note._id} className="p-4 border rounded shadow">
              {editNote === note._id ? (
                // Edit Mode
                <div>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full mb-2 p-2 border rounded"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full mb-2 p-2 border rounded"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(note._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditNote(null)}
                      className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{note.title}</h3>
                    <p className="text-gray-600">{note.content}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(note)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteNote(note._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}