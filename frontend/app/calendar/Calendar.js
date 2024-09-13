import React, { useState } from 'react';
import './Calendar.css';

const Calendar = ({ initialEvents, sx }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [events, setEvents] = useState(initialEvents);
    const [selectedDate, setSelectedDate] = useState(null);
    const [newEvent, setNewEvent] = useState({ title: '', startTime: '', endTime: '', memo: '' });
    const [showForm, setShowForm] = useState(false);
    const [editEvent, setEditEvent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleDateClick = (day) => {
        const date = new Date(currentYear, currentMonth, day);
        const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setSelectedDate(formattedDate);
        setShowForm(true);
    };

    const handleClose = () => {
        setShowForm(false);
        setNewEvent({ title: '', startTime: '', endTime: '', memo: '' });
        setSelectedDate(null);
        setEditEvent(null);
        setIsEditing(false);
    };

    const handleSave = () => {
        if (newEvent.startTime >= newEvent.endTime) {
            alert("Start time cannot be later than end time.");
            return;
        }
        if (isEditing) {
            handleSaveEdit();
        } else {
            setEvents([...events, { date: selectedDate, title: newEvent.title, startTime: newEvent.startTime, endTime: newEvent.endTime, memo: newEvent.memo }]);
            handleClose();
        }
    };

    const handleSaveEdit = () => {
        if (newEvent.startTime >= newEvent.endTime) {
            alert("Start time cannot be later than end time.");
            return;
        }
        setEvents(events.map(event =>
            event.date === editEvent.date && event.title === editEvent.title ? { ...editEvent, ...newEvent } : event
        ));
        handleClose();
    };

    const handleEdit = (event) => {
        setEditEvent(event);
        setNewEvent({
            title: event.title,
            startTime: event.startTime,
            endTime: event.endTime,
            memo: event.memo || ''
        });
        setSelectedDate(event.date); 
        setIsEditing(true);
        setShowForm(true);
    };

    const handleDelete = (eventToDelete) => {
        setEvents(events.filter(event => event !== eventToDelete));
        if (showForm) {
            handleClose();
        }
    };

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month, year) => {
        return new Date(year, month, 1).getDay();
    };

    const handlePreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const blankDays = Array(firstDayOfMonth).fill(null);

    return (
        <div className="calendar-container" style={sx}>
            <h1 style={{ fontSize: '2.0rem', fontWeight: 'bold', marginBottom: '30px' }}>Calendar Management</h1>
            <div className="calendar-header">
                <button className="nav-button rectangular-button" onClick={handlePreviousMonth}>&lt;</button>
                <span>{monthNames[currentMonth]} {currentYear}</span>
                <button className="nav-button rectangular-button" onClick={handleNextMonth}>&gt;</button>
            </div>
            <div className="calendar-grid">
                {daysOfWeek.map((day, index) => (
                    <div key={index} className="day-header">
                        {day}
                    </div>
                ))}
                {blankDays.map((_, index) => (
                    <div key={index} className="calendar-cell empty"></div>
                ))}
                {[...Array(daysInMonth)].map((_, index) => {
                    const day = index + 1;
                    return (
                        <div key={day} className="calendar-cell" onClick={() => handleDateClick(day)}>
                        <div className="date">{day}</div>
                        <div className="events">
                            {events.filter(event => {
                            const eventDate = new Date(event.date);
                            return (
                                eventDate.getDate() === day &&
                                eventDate.getMonth() === currentMonth &&
                                eventDate.getFullYear() === currentYear
                            );
                            }).map((event, i) => (
                            <div key={i} className="event-dot" 
                                onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(event);
                                }}
                            />
                            ))}
                        </div>
                        </div>
                    );
                })}
            </div>

            {showForm && (
                <div className="modal-background">
                    <div className="modal-container">
                        <button className="modal-close-button" onClick={handleClose}>&times;</button>
                        <input
                            type="text"
                            placeholder="Title"
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                            className="modal-input"
                        />
                        <textarea
                            placeholder="Memo"
                            value={newEvent.memo}
                            onChange={(e) => setNewEvent({ ...newEvent, memo: e.target.value })}
                            className="modal-input"
                            rows="3"
                        ></textarea>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <input
                                type="text"
                                value={selectedDate}
                                readOnly
                                className="modal-input"
                            />
                            <input
                                type="time"
                                value={newEvent.startTime}
                                onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                                className="modal-input"
                                style={{ width: '45%' }}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <input
                                type="text"
                                value={selectedDate}
                                readOnly
                                className="modal-input"
                            />
                            <input
                                type="time"
                                value={newEvent.endTime}
                                onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                                className="modal-input"
                                style={{ width: '45%' }}
                            />
                        </div>
                        <button onClick={handleSave} className="modal-add-button">{isEditing ? 'Save Changes' : 'Add'}</button>
                        {isEditing && (
                            <button onClick={() => handleDelete(editEvent)} className="modal-delete-button">Delete Event</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
