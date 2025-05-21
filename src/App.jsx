import React, { useState, useEffect } from 'react'
import Question from './Question'
import { db } from '../utilities/Appwrite/Database'

const App = () => {
  const [evaluationQuestions, setEvaluationQuestions] = useState([])
  const [userResponses, setUserResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const init = async () => {
    try {
      const response = await db.evaluation_questions.list();
      setEvaluationQuestions(response.documents);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setLoading(false);
    }
  }

  const grabFeedback = (value) => {
    setUserResponses((prevResponses) => {
      const existingResponseIndex = prevResponses.findIndex(
        (response) => response.question === value.question
      );

      if (existingResponseIndex !== -1) {
        const updatedResponses = [...prevResponses];
        updatedResponses[existingResponseIndex] = value;
        return updatedResponses;
      } else {
        return [...prevResponses, value];
      }
    });
  }

  const addQuestion = (question, index) => {
    return <Question
      key={question.$id}
      question={question}
      total={evaluationQuestions.length}
      currentIndex={index + 1}
      onChange={grabFeedback}
    />
  }

  const validateResponses = () => {
    if (userResponses.length !== evaluationQuestions.length) {
      return false;
    }
    return userResponses.every(response => response.feedback && response.feedback.trim() !== '');
  }

  const handleSubmit = async () => {
    if (!validateResponses()) {
      setSubmitStatus({
        type: 'error',
        message: 'Please answer all questions before submitting.'
      });
      return;
    }

    setSubmitting(true);
    setSubmitStatus(null);

    try {
      const formattedResponses = userResponses.map(response => ({
        questionId: response.question,
        answer: response.feedback
      }));

      const response = await db.completed.create({
        user: 'test2',
        responses: formattedResponses
      });
      
      console.log('Submission successful:', response);
      setSubmitStatus({
        type: 'success',
        message: 'Your responses have been submitted successfully!'
      });
      setUserResponses([]);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting responses:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit responses. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    init();
  }, []);

  const renderThankYouPage = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px 20px',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        fontSize: '48px',
        color: '#1a237e', // MSU blue
        marginBottom: '20px'
      }}>
        ✓
      </div>
      <h1 style={{
        color: '#1a237e', // MSU blue
        marginBottom: '20px',
        fontSize: '2em'
      }}>
        Thank You!
      </h1>
      <p style={{
        color: '#333',
        fontSize: '1.2em',
        lineHeight: '1.6',
        marginBottom: '30px'
      }}>
        Thank you for completing the Midlands State University evaluation form. Your feedback is valuable to us and will help us improve our services.
      </p>
      <button
        onClick={() => {
          setIsSubmitted(false);
          setUserResponses([]);
          setSubmitStatus(null);
        }}
        style={{
          padding: '12px 24px',
          backgroundColor: '#1a237e', // MSU blue
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1em',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
      >
        Submit Another Response
      </button>
    </div>
  );

  if (isSubmitted) {
    return renderThankYouPage();
  }

  return (
    <div className='assessment' style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{
        width: '100%',
        backgroundColor: '#1a237e', // MSU blue
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{
          margin: '0',
          fontSize: '2em',
          fontWeight: 'bold'
        }}>
          Midlands State University
        </h1>
        <h2 style={{
          margin: '10px 0 0 0',
          fontSize: '1.5em',
          fontWeight: 'normal'
        }}>
          Evaluation Form
        </h2>
      </div>

      {loading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100px' 
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #1a237e', // MSU blue
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      ) : (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px', 
          width: '100%'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {evaluationQuestions.map((question, index) => (
              addQuestion(question, index)
            ))}
          </div>

          {submitStatus && (
            <div style={{
              padding: '15px',
              borderRadius: '4px',
              backgroundColor: submitStatus.type === 'success' ? '#e8f5e9' : '#ffebee',
              color: submitStatus.type === 'success' ? '#2e7d32' : '#c62828',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              {submitStatus.message}
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              padding: '15px 30px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              alignSelf: 'center',
              backgroundColor: submitting ? '#9fa8da' : '#1a237e', // MSU blue
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1.1em',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              opacity: submitting ? 0.7 : 1,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Evaluation'}
          </button>
        </div>
      )}
    </div>
  )
}

export default App;