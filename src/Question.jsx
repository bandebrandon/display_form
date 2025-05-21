/**
 * Question Component
 * 
 * A reusable component that renders different types of questions (text, checkbox, radio)
 * and handles user responses for the Midlands State University evaluation form.
 * 
 * @param {Object} props
 * @param {Object} props.question - The question object containing question text, type, and options
 * @param {number} props.currentIndex - The current question number
 * @param {number} props.total - Total number of questions
 * @param {Function} props.onChange - Callback function to handle response changes
 */
import React, { useState } from 'react'

const Question = ({question, currentIndex, total, onChange}) => {
    // State to store the user's response
    const [feedback, setFeedback] = useState('');

    /**
     * Handles text input changes
     * @param {Event} e - The change event
     */
    const handleChangeText = (e) => {
        const value = e.target.value;
        setFeedback(value);
        onChange({
            question: question.$id,
            feedback: value,
        });
    };

    /**
     * Handles radio button selection
     * @param {Event} e - The change event
     * @param {string} option - The selected option
     */
    const handleChangeRadio = (e, option) => {
        const value = e.target.value;
        setFeedback(value);
        onChange({
            question: question.$id,
            feedback: value,
        });
    };

    /**
     * Handles checkbox selection (single selection)
     * @param {Event} e - The change event
     * @param {string} option - The selected option
     */
    const handleChangeCheckbox = (e, option) => {
        const isChecked = e.target.checked;
        // If checked, set as the only selected option
        // If unchecked, clear the selection
        const newFeedback = isChecked ? option : '';
        
        setFeedback(newFeedback);
        onChange({
            question: question.$id,
            feedback: newFeedback,
        });
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '25px',
            margin: '15px 0',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
            <div style={{ marginBottom: '20px' }}>
                <span style={{ 
                    color: '#1a237e', // MSU blue
                    fontSize: '0.9em',
                    backgroundColor: '#e8eaf6', // Light MSU blue
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontWeight: '500'
                }}>
                    Question {currentIndex} of {total}
                </span>
            </div>
            
            <p style={{ 
                fontSize: '1.2em', 
                marginBottom: '20px',
                color: '#333',
                fontWeight: '500',
                lineHeight: '1.5'
            }}>
                {question.question}
            </p>

            {question.type === 'text' ? (
                <textarea 
                    required 
                    style={{ 
                        marginTop: '10px', 
                        padding: '12px',
                        borderRadius: '4px',
                        border: '1px solid #e0e0e0',
                        minHeight: '120px',
                        width: '100%',
                        resize: 'vertical',
                        fontSize: '1em',
                        fontFamily: 'inherit',
                        transition: 'border-color 0.2s',
                        ':focus': {
                            borderColor: '#1a237e', // MSU blue
                            outline: 'none'
                        }
                    }} 
                    onChange={handleChangeText}
                    placeholder="Please type your answer here..."
                />
            ) : question.type === 'checkbox' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {question.options.map((option, index) => (
                        <label key={index} style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '4px',
                            transition: 'background-color 0.2s',
                            ':hover': {
                                backgroundColor: '#f5f5f5'
                            }
                        }}>
                            <input 
                                type="checkbox"
                                checked={feedback === option}
                                value={option}
                                onChange={(e) => handleChangeCheckbox(e, option)}
                                style={{ 
                                    cursor: 'pointer',
                                    width: '18px',
                                    height: '18px',
                                    accentColor: '#1a237e' // MSU blue
                                }}
                            />
                            <span style={{ fontSize: '1.1em' }}>{option}</span>
                        </label>
                    ))}
                </div>
            ) : question.type === 'radiobutton' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {question.options.map((option, index) => (
                        <label key={index} style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            padding: '8px',
                            borderRadius: '4px',
                            transition: 'background-color 0.2s',
                            ':hover': {
                                backgroundColor: '#f5f5f5'
                            }
                        }}>
                            <input 
                                type="radio"
                                name={`question-${currentIndex}`}
                                checked={feedback === option}
                                value={option}
                                onChange={(e) => handleChangeRadio(e, option)}
                                style={{ 
                                    cursor: 'pointer',
                                    width: '18px',
                                    height: '18px',
                                    accentColor: '#1a237e' // MSU blue
                                }}
                            />
                            <span style={{ fontSize: '1.1em' }}>{option}</span>
                        </label>
                    ))}
                </div>
            ) : (
                <p style={{ color: '#d32f2f' }}>Invalid question type</p>
            )}
        </div>
    );
};

export default Question;