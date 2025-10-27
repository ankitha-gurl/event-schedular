import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function EventScheduler() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    endTime: "",
    location: "",
    category: "",
    description: "",
  });
  const [editingEvent, setEditingEvent] = useState(null);

  const currentUser = { id: 1, name: "Ankitha" };

  // 🔹 Fetch Events
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await axios.get("http://localhost:5000/api/events");
    setEvents(res.data);
  };

  // 🔹 Handle Input
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 🔹 Create / Update Event
  const handleSubmit = async () => {
    if (!formData.title || !formData.date || !formData.time) return;

    if (editingEvent) {
      const res = await axios.put(
        `http://localhost:5000/api/events/${editingEvent._id}`,
        formData
      );
      setEvents(events.map((e) => (e._id === res.data._id ? res.data : e)));
    } else {
      const res = await axios.post("http://localhost:5000/api/events", {
        ...formData,
        organizer: currentUser.name,
        organizerId: currentUser.id,
        attendees: [
          { id: currentUser.id, name: currentUser.name, status: "going" },
        ],
      });
      setEvents([...events, res.data]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      date: "",
      time: "",
      endTime: "",
      location: "",
      category: "",
      description: "",
    });
    setEditingEvent(null);
  };

  // 🔹 Edit Event
  const handleEdit = (event) => {
    setFormData(event);
    setEditingEvent(event);
  };

  // 🔹 Delete Event
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/events/${id}`);
    setEvents(events.filter((e) => e._id !== id));
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">📅 Event Management System</h2>

      <div className="card p-3 mb-4">
        <h5>{editingEvent ? "Edit Event" : "Create New Event"}</h5>
        <div className="row g-2">
          {["title", "date", "time", "endTime", "location", "category"].map(
            (field) => (
              <div className="col-md-4" key={field}>
                <input
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={field}
                  className="form-control"
                />
              </div>
            )
          )}
          <div className="col-12">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="form-control"
            />
          </div>
          <div className="col-12 text-center mt-3">
            <button className="btn btn-primary me-2" onClick={handleSubmit}>
              {editingEvent ? "Update Event" : "Add Event"}
            </button>
            <button className="btn btn-secondary" onClick={resetForm}>
              Reset
            </button>
          </div>
        </div>
      </div>

      <h4>📋 Events List</h4>
      <div className="row">
        {events.map((event) => (
          <div className="col-md-4 mb-3" key={event._id}>
            <div className="card p-3 shadow-sm">
              <h5>{event.title}</h5>
              <p>
                {event.date} | {event.time} - {event.endTime}
              </p>
              <p>
                📍 {event.location} | 🏷️ {event.category}
              </p>
              <small>{event.description}</small>
              <div className="mt-3">
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(event)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(event._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

