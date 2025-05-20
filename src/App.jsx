import React ,{useState , useEffect} from 'react'
import Question from './Question'
import { db } from '../utilities/Appwrite/Database'

const App = () => {

  const [evaluationQuestions , setEvaluationQuestions] = useState([])
  const [userResponses, setUserResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  const init = async ()=>{
    try {
      const response = await db.evaluation_questions.list();
      setEvaluationQuestions(response.documents);
      setLoading(false)
  } catch (error) {
      console.error("Error fetching questions:", error); // Use console.error
  }  

  }

  // This function is passed to the Question component
  const grabFeedback = (value) =>{ 
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

  const addQuestion = (question , index)=>{  
    return <Question 
    key={question.$id} 
    question={question} 
    total={evaluationQuestions.length} 
    currentIndex={index + 1} 
    onChange = {grabFeedback} 
  />
  }
  
  const handleSubmit = async () =>{
    
    try {
      const response = await db.completed.create({
      user: 'test2',
      responses: userResponses
      });
      console.log('Submission successful:', response);
    } catch (error) {
      console.error('Error submitting responses:', error);
    }
    //console.log(response.message)
  }

  useEffect(() => {
    try {
      init()
    } catch (error) {
      console.log(error)
      
    }
    
  
  }, [])

  return (
    <div className='assessment' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <h1>
        {
          evaluationQuestions.length > 0 ? 'Welcome to the MSU evaluation form' : 'No questions available'
        }
      </h1>

      {
        loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #ccc',
              borderTop: '4px solid #0078d4',
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '600px' }}>
              <div>
                {evaluationQuestions.map((question, index) => (
                  addQuestion(question, index)
                ))}
              </div>
              <button 
                type="button"
                onClick={ handleSubmit }
                style={{ padding: '10px 20px', cursor: 'pointer', alignSelf: 'center' }}
              >
                Submit
              </button>
          </div>
        )
      }
    </div>
  )
}

export default App