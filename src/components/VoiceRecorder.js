import React, { useState, useEffect } from 'react';
import { pushToDatabase, fetchUserNotes, updateDatabase } from '../res/FirebaseHandler';

import NotesList from './NotesList';  // <-- Add this at the top with other imports

import micIcon from '../img/mic-white.png';
import '../css/VoiceRecorder.css';  // <-- Import the CSS file here

const VoiceRecorder = () => {
    const [transcript, setTranscript] = useState('');
    const [language, setLanguage] = useState('sv-SE');  // Set Swedish as the default language
    const [countdown, setCountdown] = useState(5);
    const [isCountdownActive, setIsCountdownActive] = useState(false);
    const [shouldCancelSave, setShouldCancelSave] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [latestEntries, setLatestEntries] = useState([]);
    const [userId, setUserId] = useState('johmul012');

    
    // speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    const [isListening, setIsListening] = useState(false);
    const [longPressDuration] = useState(1000); // 1000ms or 1 second

    var selectedNote = null;

    useEffect(() => {
        fetchFromFirebase()
    }, []); // Empty dependency array to ensure it runs once when component mounts.

    
    recognition.onresult = (event) => {
        const currentTranscript = event.results[0][0].transcript;
        console.log('Transcript:', currentTranscript);

        setTranscript(currentTranscript);
        startCountdown(currentTranscript);
    };
    
    recognition.onend = () => {
        setIsListening(false);
        // TODO: Send `transcript` to Firebase here
        console.log('transcript is', transcript);
    };

    recognition.onerror = (event) => {
        console.error("Error occurred in recognition:", event.error);
        setIsListening(false);
    };


    const startSpeechRecognition = () => {
        recognition.lang = language;  // Update the language whenever it's changed

        recognition.start();
        setIsListening(true);
    };

    const stopSpeechRecognition = () => {
        recognition.stop();
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
        recognition.lang = e.target.value;  // Update the language whenever it's changed
    };

    const startCountdown = (_transcript) => {
        setIsCountdownActive(true);
        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
    
                    if (!shouldCancelSave) { // Only save if the save process hasn't been canceled
                        saveToFirebase(_transcript);
                    }
                    setShouldCancelSave(false); // Reset this back to false for next time
                    setIsCountdownActive(false);
                    return 5; // Reset the countdown
                }
                return prev - 1;
            });
        }, 1000);
    };
    

    const fetchFromFirebase = async () => {
        const fetchData = async () => {
            const entries = (await fetchUserNotes(userId)).reverse();
            
            console.log('entries are', entries);
            setLatestEntries(entries);
        };
    
        fetchData();
    }


    const saveToFirebase = async (_transcript) => {
        console.log('Saving transcript to Firebase transcript is', _transcript, 'language is', _transcript);
        if (_transcript) {

            const timestamp = new Date().toISOString();
            console.log('timestamp is', timestamp);
            console.log('user is', userId);
            console.log('selectedNote is', selectedNote);
            if (selectedNote) {
                // If a note was long-pressed, update it
                const updatedContent = selectedNote.content + ' ' + _transcript;
                console.log('updatedContent is', updatedContent, ' id is: ', selectedNote.id);
                
                await updateDatabase('notes', 
                    selectedNote.id, 
                    { content: updatedContent });  // Assuming you have a function to update notes in Firebase
            } else {
                // Else, create a new note
                await pushToDatabase('notes', { 
                    timeStamp: timestamp, 
                    content: _transcript, 
                    user: userId, 
                    language: language });
            }
            selectedNote = null; //always clear this here


            console.log('Transcript saved to Firebase');
            playSuccessSound();
            setShowSuccess(true);
            setTranscript('');
            fetchFromFirebase()
        }
    };

    const playSuccessSound = () => {
        const audio = new Audio('./sounds/success.mp3');
        audio.play();
    };

    const cancelSave = () => {
        setIsCountdownActive(false);
        setShouldCancelSave(true); // Indicate that the save should be canceled
        setCountdown(5); // Reset the countdown
    };
        
    const handleLongPress = (note) => {
        console.log('VoiceRecorde: handleLongPress', note);
        selectedNote = note;

        startSpeechRecognition(note);
    };
    
    

    return (
        <div>
            <div className="header">Memo Maker</div>
            <div className="container">
                <button 
                    className={isListening ? "recordButton listeningAnimation" : "recordButton"} 
                    onClick={isListening ? stopSpeechRecognition : startSpeechRecognition}>
                    <img src={micIcon} alt="Mic Icon" />
                </button>

                <div className="transcriptBox">{transcript}</div>

                <button onClick={cancelSave} disabled={!isCountdownActive}>
                    Cancel Saving ({countdown}s)
                </button>

                {showSuccess && <div className="successAnimation">✔️</div>}

            </div>

            <div>
                <input 
                    type="text" 
                    value={userId} 
                    onChange={(e) => setUserId(e.target.value)}
                />
                <select value={language} onChange={handleLanguageChange}>
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Spanish (Spain)</option>
                    <option value="fr-FR">French (France)</option>
                    <option value="de-DE">German (Germany)</option>
                    <option value="sv-SE">Swedish (Sweden)</option>
                    <option value="ar-SA">Arabic (Saudi Arabia)</option>
                    <option value="fa-IR">Persian (Iran)</option>
                    <option value="tr-TR">Turkish (Turkey)</option>  
                    <option value="fi-FI">Finnish (Finland)</option> 
                </select>
            </div>
            <NotesList notes={latestEntries} onLongPress={handleLongPress}/>  {/* <-- This renders the list of notes */}

        </div>
    );
};

export default VoiceRecorder;
