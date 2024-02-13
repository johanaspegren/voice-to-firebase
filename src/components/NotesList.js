// NotesList.js
import React, { useState } from 'react';
import '../css/NotesList.css';

const NotesList = ({ notes, onLongPress }) => {
    const [expandedNoteId, setExpandedNoteId] = useState(null);
    let pressTimer = null;

    const handleNoteClick = (noteId) => {
        if (expandedNoteId === noteId) {
            setExpandedNoteId(null);  // Collapse the note if it's already expanded
        } else {
            setExpandedNoteId(noteId);  // Expand the note
        }
    };


    const handlePressStart = (note) => {
        const pressTimer = setTimeout(() => {
            onLongPress(note);
        }, 1000); // Long-press for 1 second

        window.addEventListener('mouseup', () => clearTimeout(pressTimer), { once: true });
    };


    const handlePressEnd = () => {
        if (pressTimer) {
            clearTimeout(pressTimer);
            pressTimer = null;
        }
    };


    return (
        <div className="notes-list">
            {notes.map(note => (
                <div 
                    key={note.id} 
                    className="note-item"
                    onClick={() => handleNoteClick(note.id)}
                    onMouseDown={() => handlePressStart(note)}
                    onMouseUp={handlePressEnd}   // Clear any active timers on mouseup
                    onTouchStart={() => handlePressStart(note)}  // Touch event for mobile devices
                    onTouchEnd={handlePressEnd}  // Clear any active timers on touch end
                >
                    {note.id === expandedNoteId ? note.content : `${note.content.slice(0, 20)}...`}
                </div>
            ))}
        </div>
    );
}

export default NotesList;