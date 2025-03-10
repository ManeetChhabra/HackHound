import React, { useState, useEffect } from 'react';

// Pre-made modules (10 modules)
const initialModules = [
  { title: 'Web Development', active: false, duration: "30 mins" },
  { title: 'Machine Learning', active: false, duration: "30 mins" },
  { title: 'Data Structures', active: false, duration: "30 mins" },
  { title: 'Algorithms', active: false, duration: "30 mins" },
  { title: 'Databases', active: false, duration: "30 mins" },
  { title: 'Networking', active: false, duration: "30 mins" },
  { title: 'Operating Systems', active: false, duration: "30 mins" },
  { title: 'Cybersecurity', active: false, duration: "30 mins" },
  { title: 'Cloud Computing', active: false, duration: "30 mins" },
  { title: 'UI/UX Design', active: false, duration: "30 mins" }
];

const Mockinterview = () => {
  const [moduleName, setModuleName] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modules, setModules] = useState(initialModules);
  const [showModuleInput, setShowModuleInput] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Hardcoded Gemini API key (replace with your actual key)
  const GEMINI_API_KEY = "AIzaSyCw0xpPJR6XxDv0eN9KXLKZEaEujHEYHzY";
  
  // Timer effect
  useEffect(() => {
    let timer;
    if (timerActive && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0 && timerActive) {
      handleNextQuestion();
    }
    return () => clearTimeout(timer);
  }, [timeRemaining, timerActive]);

  // Helper function to calculate reward points based on percentage score.
  // For example:
  // 100% (6/6) => 50 points
  // 83%-99% (5/6) => 40 points
  // 67%-82% (4/6) => 30 points
  // 50%-66% (3/6) => 20 points
  // 33%-49% (2/6) => 10 points
  // 17%-32% (1/6) => 5 points
  // 0%-16% (0/6) => 0 points
  const getRewardPoints = (score, total) => {
    if (score === total) return 50;
    if (score >= total * 0.83) return 40;
    if (score >= total * 0.67) return 30;
    if (score >= total * 0.5) return 20;
    if (score >= total * 0.33) return 10;
    if (score >= total * 0.17) return 5;
    return 0;
  };

  const fetchQuestionsFromGemini = async (module) => {
    setLoading(true);
    setError('');
    
    try {
      // Include difficulty in the prompt
      const prompt = `Generate 6 multiple-choice questions about ${module} at ${difficulty} difficulty. 
Each question should have 4 options with exactly one correct answer. 
Format the response as a JSON array of objects with the following structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "The correct option (exactly matching one of the options)"
  }
]`;
      
      const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: prompt }] }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      const generatedText = data.candidates[0]?.content?.parts[0]?.text;
      
      if (!generatedText) {
        throw new Error('No content received from API');
      }
      
      // Extract JSON array from response
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      const parsedQuestions = JSON.parse(jsonMatch[0]);
      const questionsWithIds = parsedQuestions.map((q, idx) => ({ ...q, id: idx + 1 }));
      
      setQuestions(questionsWithIds);
      setCurrentQuestionIndex(0);
      setSelectedAnswer('');
      setAnswerSubmitted(false);
      setTimeRemaining(30);
      setTimerActive(true);
      
      // Mark the selected module as active
      setModules(modules.map(m => ({ ...m, active: m.title === module })));
      setShowModuleInput(false);
      // Reset score and quiz completion status
      setScore(0);
      setQuizCompleted(false);
    } catch (err) {
      console.error('Error fetching questions:', err);
      
      // Fallback questions (6 questions)
      const fallbackQuestions = [
        {
          id: 1,
          question: `What is the main concept of ${module}?`,
          options: [
            'Learning through practice',
            'Memorization techniques',
            'Visual comprehension',
            'Auditory learning'
          ],
          correctAnswer: 'Learning through practice'
        },
        {
          id: 2,
          question: `Which of these is NOT a benefit of ${module}?`,
          options: [
            'Improved retention',
            'Faster learning',
            'Guaranteed job placement',
            'Better understanding'
          ],
          correctAnswer: 'Guaranteed job placement'
        },
        {
          id: 3,
          question: `Who is considered a key figure in ${module}?`,
          options: [
            'Person A',
            'Person B',
            'Person C',
            'Person D'
          ],
          correctAnswer: 'Person B'
        },
        {
          id: 4,
          question: `How does ${module} impact modern technology?`,
          options: [
            'It has minimal impact',
            'It revolutionizes connectivity',
            'It is only theoretical',
            'It replaces all other technologies'
          ],
          correctAnswer: 'It revolutionizes connectivity'
        },
        {
          id: 5,
          question: `What is a common challenge in ${module}?`,
          options: [
            'Scalability issues',
            'Excessive funding',
            'Overregulation',
            'Lack of interest'
          ],
          correctAnswer: 'Scalability issues'
        },
        {
          id: 6,
          question: `Which tool is frequently used in ${module}?`,
          options: [
            'Tool X',
            'Tool Y',
            'Tool Z',
            'Tool W'
          ],
          correctAnswer: 'Tool X'
        }
      ];
      
      setError('Failed to fetch from Gemini API. Using fallback questions.');
      setQuestions(fallbackQuestions);
      setTimeRemaining(30);
      setTimerActive(true);
      setModules(modules.map(m => ({ ...m, active: m.title === module })));
      setShowModuleInput(false);
      // Reset score and quiz completion status
      setScore(0);
      setQuizCompleted(false);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleSubmit = (e) => {
    e.preventDefault();
    if (moduleName.trim()) {
      fetchQuestionsFromGemini(moduleName);
    } else {
      setError('Please enter a module name');
    }
  };

  const handleModuleClick = (clickedModule) => {
    setModuleName(clickedModule.title);
    fetchQuestionsFromGemini(clickedModule.title);
  };

  const handleAnswerSelect = (answer) => {
    if (!answerSubmitted) {
      setSelectedAnswer(answer);
    }
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer) {
      const currentQuestion = questions[currentQuestionIndex];
      const correct = selectedAnswer === currentQuestion.correctAnswer;
      setIsCorrect(correct);
      if (correct) {
        setScore(prevScore => prevScore + 1);
      }
      setAnswerSubmitted(true);
      setTimerActive(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setAnswerSubmitted(false);
      setTimeRemaining(30);
      setTimerActive(true);
    } else {
      setQuizCompleted(true);
      setTimerActive(false);
    }
  };

  const handleAddNewModule = () => {
    setShowModuleInput(true);
    setQuestions([]);
    setTimerActive(false);
    setScore(0);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
  };

  // Calculate the percentage score and reward points
  const percentageScore = Math.round((score / questions.length) * 100);
  const rewardPoints = getRewardPoints(score, questions.length);

  return (
    <div className="min-h-screen mt-24 bg-gray-50 py-14 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 bg-white border-r border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">PRACTICE QUIZ</h2>
        <div className="space-y-2">
          {modules.map((module, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition transform duration-300 hover:scale-105 ${
                module.active
                  ? "bg-orange-100 border-l-4 border-orange-500"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => handleModuleClick(module)}
            >
              <div className="flex items-center space-x-2">
                <span className="text-orange-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6m0 0l3-3m-3 3l-3-3m0 12a9 9 0 100-18 9 9 0 000 18z"
                    />
                  </svg>
                </span>
                <span className="text-sm text-gray-700">{module.title}</span>
              </div>
              <span className="text-xs text-gray-500">{module.duration}</span>
            </div>
          ))}
          <div
            className="flex items-center p-3 rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition transform duration-300 hover:scale-105"
            onClick={handleAddNewModule}
          >
            <div className="flex items-center space-x-2">
              <span className="text-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </span>
              <span className="text-sm text-gray-700">Add New Module</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-orange-50 p-6">
        {showModuleInput ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Enter Module Name
            </h2>
            <form onSubmit={handleModuleSubmit}>
              <div className="mb-4">
                <label htmlFor="moduleName" className="block text-sm font-medium text-gray-700 mb-2">
                  Module Topic:
                </label>
                <input
                  type="text"
                  id="moduleName"
                  value={moduleName}
                  onChange={(e) => setModuleName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g. Machine Learning, Quantum Physics, Web Development"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Difficulty:
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                disabled={loading}
              >
                {loading ? 'Loading Questions...' : 'Generate Quiz'}
              </button>
              {error && <p className="mt-2 text-red-600">{error}</p>}
            </form>
          </div>
        ) : quizCompleted ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Completed!</h2>
            <div className="mb-6">
              <p className="text-xl text-gray-700">
                Your score: <span className="font-bold">{score}</span> out of <span className="font-bold">{questions.length}</span>
              </p>
              <p className="text-xl text-gray-700">
                Percentage: <span className="font-bold">{percentageScore}%</span>
              </p>
              <p className="text-xl text-gray-700">
                Reward Points Earned: <span className="font-bold">{rewardPoints}</span>
              </p>
            </div>
            <div className="mb-6">
              <div className="relative h-4 w-full bg-gray-200 rounded-full">
                <div style={{ width: `${(score / questions.length) * 100}%` }} className="absolute h-4 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <div className="text-left mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Reward Points Mapping:</h3>
              <ul className="list-disc ml-6 text-gray-700">
                <li>6/6 correct (100%): 50 points</li>
                <li>5/6 correct (≈83%): 40 points</li>
                <li>4/6 correct (≈67%): 30 points</li>
                <li>3/6 correct (50%): 20 points</li>
                <li>2/6 correct (≈33%): 10 points</li>
                <li>1/6 correct (≈17%): 5 points</li>
                <li>0/6 correct (0%): 0 points</li>
              </ul>
            </div>
            <button
              onClick={handleAddNewModule}
              className="mt-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition duration-200"
            >
              Return to Modules
            </button>
          </div>
        ) : (
          <>
            {currentQuestionIndex === 0 && (
              <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <h2 className="text-lg font-bold text-gray-800 mb-2">
                  Instructions: Please Read Carefully
                </h2>
                <ul className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                  <li>
                    <span className="font-medium">Answer the Questions:</span>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Select one of the multiple-choice options for each question.</li>
                      <li>Click "Submit Answer" when you're ready to check your answer.</li>
                    </ul>
                  </li>
                  <li>
                    <span className="font-medium">Time Limit:</span>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>You have 30 seconds to answer each question.</li>
                      <li>If time runs out, you'll automatically move to the next question.</li>
                    </ul>
                  </li>
                  <li>
                    <span className="font-medium">Results:</span>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>You'll get immediate feedback on whether your answer is correct.</li>
                      <li>After all questions are completed, your final score, percentage, and reward points will be displayed.</li>
                    </ul>
                  </li>
                </ul>
              </div>
            )}

            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  Module: {moduleName}
                </h1>
                <div className="text-sm text-gray-500 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 mr-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {timerActive ? (
                    <span className={`font-medium ${timeRemaining < 10 ? 'text-red-500' : ''}`}>
                      {timeRemaining} seconds remaining
                    </span>
                  ) : (
                    <span>Time: 30 seconds per question</span>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Question {currentQuestionIndex + 1} of {questions.length}: {questions[currentQuestionIndex]?.question}
              </h3>
              
              <div className="space-y-3 mt-4">
                {questions[currentQuestionIndex]?.options.map((option, index) => (
                  <div 
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                      selectedAnswer === option 
                        ? answerSubmitted
                          ? isCorrect 
                            ? "bg-green-100 border-green-500" 
                            : "bg-red-100 border-red-500"
                          : "bg-orange-100 border-orange-500"
                        : answerSubmitted && option === questions[currentQuestionIndex].correctAnswer
                          ? "bg-green-100 border-green-500"
                          : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${
                        selectedAnswer === option ? "bg-orange-500 text-white" : "bg-gray-200"
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <div className="text-gray-700">{option}</div>
                    </div>
                  </div>
                ))}
              </div>

              {answerSubmitted && (
                <div className={`mt-4 p-4 rounded-md ${isCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                  <div className="flex items-start">
                    <div className="mr-2">
                      {isCorrect ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {isCorrect ? "Correct!" : "Incorrect!"}
                      </p>
                      {!isCorrect && (
                        <p>
                          The correct answer is: {questions[currentQuestionIndex].correctAnswer}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-between">
                {!answerSubmitted ? (
                  <button
                    onClick={handleAnswerSubmit}
                    disabled={!selectedAnswer}
                    className={`px-4 py-2 rounded-md ${
                      selectedAnswer 
                        ? "bg-orange-500 hover:bg-orange-600 text-white" 
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    } transition duration-200`}
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition duration-200"
                  >
                    {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Mockinterview;
