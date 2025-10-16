
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Notes from "./pages/Notes";
import AddNote from "./pages/AddNote.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/createNote" element={<AddNote />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
