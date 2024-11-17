import { useEffect, useState, useRef } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import "./style.css";

const Notes = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState({
    title: "",
    description: "",
    audio_file: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const fetchNotes = async () => {
    try {
      const response = await api.get("/notes/");
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleCreate = async () => {
    const formData = new FormData();
    formData.append("title", note.title);
    formData.append("description", note.description);
    if (note.audio_file) {
      formData.append("audio_file", note.audio_file);
    }

    console.log(formData.get("title"), note);

    try {
      await api.post("/notes/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setNote({ title: "", description: "", audio_file: null });
      setAudioUrl(null);
      fetchNotes();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/${id}/`);
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("access_token");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote({
      ...note,
      [name]: value,
    });
  };

  const startRecording = async () => {
    setIsRecording(true);
    audioChunks.current = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
      const audioFile = new File([audioBlob], "audio_note.wav", {
        type: "audio/wav",
      });
      setNote({
        ...note,
        audio_file: audioFile,
      });
      setAudioUrl(URL.createObjectURL(audioBlob));
    };
    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current.stop();
  };

  const handleAddNote = () => {
    setIsModalOpen(true);
    setNote({ title: "", description: "", audio_file: null });
    setAudioUrl(null);
  };

  const handleEditNote = (note) => {
    setIsModalOpen(true);
    setNote({
      title: note.title,
      description: note.description,
      audio_file: null,
    });
    setAudioUrl(null);
  };

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      navigate("/login");
    }
    fetchNotes();
  }, []);

  return (
    <div className="notes-container">
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <div className="notes-header">
        <h4>Notes</h4>
        <button className="add-note-button" onClick={handleAddNote}>
          Add Note
        </button>
      </div>
      <div className="notes-list">
        {notes.map((note) => (
          <div key={note.id} className="note-item">
            <h3>{note.title}</h3>
            <p>{note.description}</p>
            {note.audio_file && (
              <audio controls src={note.audio_file} className="audio-player">
                Your browser does not support the audio element.
              </audio>
            )}
            <div>
              <button
                className="edit-button"
                onClick={() => handleEditNote(note)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(note.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <Modal title="Add / Edit Note" onClose={() => setIsModalOpen(false)}>
          <input
            className="note-input"
            type="text"
            name="title"
            placeholder="Title"
            value={note.title}
            onChange={handleChange}
            required
          />
          <textarea
            className="note-input"
            placeholder="Description"
            name="description"
            value={note.description}
            onChange={handleChange}
            rows={4}
            style={{ resize: "vertical" }}
            required
          />
          <div className="buttons-container">
            {isRecording ? (
              <button onClick={stopRecording} className="stop-button">
                Stop Recording
              </button>
            ) : (
              <button onClick={startRecording} className="record-button">
                Start Recording
              </button>
            )}
            <button
              className="note-button"
              onClick={handleCreate}
              disabled={!(note.title && note.description)}
            >
              Add Note
            </button>
          </div>
          {audioUrl && (
            <audio controls src={audioUrl} className="audio-player">
              Your browser does not support the audio element.
            </audio>
          )}
        </Modal>
      )}
    </div>
  );
};

export default Notes;
