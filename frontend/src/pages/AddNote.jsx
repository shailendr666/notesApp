import { useState } from "react";
import API from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

 export default function AddNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

    const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post("/notes/createNote", { title, content });                                                                
      navigate("/notes");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating note");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleAdd}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Create Note</h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Save Note
        </button>
      </form>
    </div>
  );
}