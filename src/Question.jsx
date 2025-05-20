import React, { useState } from 'react'

const Question = ({question , currentIndex , total , onChange}) => {
    const [feedback, setFeedback] = useState('');


const handleChangeText = async (e) => {
    e.preventDefault();
    onChange({
        question: question.$id,
        feedback: e.target.value,
    })
};

const handleChange = (e , option) => {
    e.preventDefault();
    onChange({
        question: question.$id,
        feedback: e.target.value,
    })
    
};


return (
    <div style={{
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '0 10px 10px',
            margin : '5px 0 4px 10px'
    }}>

         <p> Question {currentIndex} / {total}</p>
         <p>{question.question} <span>{question.$id}</span></p>
         {
            question.type === 'text' ? 
            <textarea 
                required 
                style={{ marginTop: '10px', padding: '5px' }} 
                onChange={(e) => handleChangeText(e)} 
            /> : 
                question.type ===  'checkbox' || question.type === 'radiobutton' ? 
                question.options.map((option, index) => (
                    <label key={index} style={{ marginTop: '5px' }}>
                        <input 
                            type="radio" 
                            name={`question-${currentIndex}`} 
                            checked={feedback === option}
                            value={option} 
                            onChange={(e) => handleChange(e, option)}
                        />
                        {option}
                    </label>
                )) : 
                'Invalid Response'
         }

    </div>
)
}

export default Question