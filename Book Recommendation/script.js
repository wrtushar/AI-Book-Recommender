import { GoogleGenerativeAI } from "@google/generative-ai";

document.getElementById('questionnaire').onsubmit = async function(event) {
  event.preventDefault(); // Prevent form from submitting normally
  
  // Gather answers
  const formData = new FormData(event.target);
  const answers = {};
  
  formData.forEach((value, key) => {
    if (!answers[key]) {
      answers[key] = [];
    }
    answers[key].push(value);
  });

  try {
    const prompt = generatePrompt(answers);
    console.log("Generated prompt:", prompt); // Debug: Log the generated prompt

    const recommendations = await fetchBookRecommendations(prompt);
    displayRecommendations(recommendations);
  } catch (error) {
    console.error('Error in recommendation process:', error);
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = '<p>An error occurred while fetching recommendations. Please try again.</p>';
  }
};

function generatePrompt(answers) {
  let prompt = `You need to recommend 3 books to a user based on their answers to a form.the answer should mention user as second person. 
                The questions evaluate their reading preferences and personality. Here are the questions and answers:

                Q1 - Which genres do you enjoy the most?
                Ans1 - I enjoy ${answers.genre}
                Q2 - How often do you read books?
                Ans2 - ${answers.frequency}
                Q3 - Which is your preferred book length?
                Ans3 - ${answers.length}
                Q4 - Do you prefer books that are plot-driven or character-driven?
                Ans4 - ${answers.plotOrCharacter}
                Q5 - What pacing do you prefer in a book?
                Ans5 - ${answers.pacing}
                Q6 - Are you an introvert or an extrovert?
                Ans6 - ${answers.introvertExtrovert}
                Q7 - Do you prefer adventure and spontaneity or routine and predictability?
                Ans7 - ${answers.adventureRoutine}
                Q8 - Do you make decisions based on emotions or logic?
                Ans8 - ${answers.emotionsLogic}
                Q9 - Are you an optimist or a realist?
                Ans9 - ${answers.optimistRealist}
                Q10 - How do you handle conflict?
                Ans10 - ${answers.conflict}
                Q11 - Do you prefer spending time alone or with others?
                Ans11 - ${answers.aloneSocial}
                
                Please provide exactly 3 book recommendations. For each recommendation, use the following format:

                Title: [Book Title]
                Author: [Book Author]
                Description: [300-word description of the book]
                Reasoning: [400-word explanation of why this book is a good fit for the user, and also roast the users taste and preferences ]

                Separate each recommendation with a blank line. Do not include any additional text or formatting.`;

  return prompt;
}

async function fetchBookRecommendations(prompt) {
  const API_KEY = ""; // Replace with your Gemini API key
  const genAI = new GoogleGenerativeAI(API_KEY);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Raw API response:", text); // Debug: Log the raw response

    // Parse the text into structured data
    const books = text.split('\n\n').filter(book => book.trim() !== '').map(bookText => {
      const lines = bookText.split('\n');
      const book = {};
      lines.forEach(line => {
        const [key, value] = line.split(': ');
        if (key && value) {
          book[key.toLowerCase()] = value.trim();
        }
      });
      return book;
    }).filter(book => Object.keys(book).length === 4); // Ensure all 4 fields are present

    console.log("Parsed books:", books); // Debug: Log the parsed books

    return books;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
}

function displayRecommendations(recommendations) {
  const resultElement = document.getElementById('result');
  resultElement.innerHTML = ''; // Clear previous results

  if (recommendations.length === 0) {
    resultElement.innerHTML = '<p>No recommendations available. Please try again.</p>';
    return;
  }

  recommendations.forEach(book => {
    const bookElement = document.createElement('div');
    bookElement.className = 'book-recommendation';
    bookElement.innerHTML = `
      <h3>${book.title || 'No title'}</h3>
      <h4>by ${book.author || 'Unknown author'}</h4>
      <p><strong>Description:</strong> ${book.description || 'No description available'}</p>
      <p><strong>Why it's a good fit:</strong> ${book.reasoning || 'No reasoning provided'}</p>
    `;
    resultElement.appendChild(bookElement);
  });
}

// If you have a showSection function, keep it here
showSection(currentSection);
