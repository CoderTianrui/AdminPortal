import React, { useState } from 'react';
import './Calendar.css';

const Calendar = ({ initialEvents, sx }) => {
    const [events, setEvents] = useState(initialEvents);
    const [selectedDate, setSelectedDate] = useState(null);
    const [newEvent, setNewEvent] = useState('');
    const [showForm, setShowForm] = useState(false);

    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const handleDateClick = (day) => {
        setSelectedDate(new Date(currentYear, currentMonth, day).toISOString().split('T')[0]);
        setShowForm(true);
    };

    const handleClose = () => {
        setShowForm(false);
        setNewEvent('');
        setSelectedDate(null);
    };

    const handleSave = () => {
        setEvents([...events, { date: selectedDate, title: newEvent }]);
        setShowForm(false);
        setNewEvent('');
        setSelectedDate(null);
    };

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // 改为从星期天开始

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
            <h1>Calendar Management</h1>
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
                                    <div key={i} className="event">
                                        {event.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {showForm && (
                <div className="event-form-container">
                    <div className="event-form">
                        <h2>Add Event for {selectedDate}</h2>
                        <input
                            type="text"
                            placeholder="Event Title"
                            value={newEvent}
                            onChange={(e) => setNewEvent(e.target.value)}
                            className="form-input"
                        />
                        <div className="form-buttons">
                            <button onClick={handleClose} className="btn rectangular-button">Cancel</button>
                            <button onClick={handleSave} className="btn btn-save rectangular-button">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
