
import { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotes = async () => {
    try {
      const { data } = await API.get("/notes/fetchNote");
      setNotes(data.notes);
    } catch (error) {
      console.error(error);
      alert("Error fetching notes");
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    if (!confirm("Delete this note?")) return;
    try {
      await API.delete(`/notes/deleteNote/${id}`);
      setNotes(notes.filter((n) => n._id !== id));
    } catch (error) {
      alert("Error deleting note");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Notes</h1>
      <button
        onClick={() => navigate("/createNote")}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        + Add Note
      </button>
      {notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li
              key={note._id}
              className="p-4 border rounded shadow flex justify-between"
            >
              <div>
                <h3 className="font-bold">{note.title}</h3>
                <p className="text-gray-600">{note.content}</p>
              </div>
              <button
                onClick={() => deleteNote(note._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
