// Heat Stress Assistant
// JavaScript-based Question Matching and Response Retrieval


// Load chatbot data

let trainingExamples = [];
let responseTemplates = {};

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");


// Load CSV and JSON files

async function loadChatbotData() {

    try {

        const trainingResponse = await fetch("./data/training_examples.csv");
        const templatesResponse = await fetch("./data/response_templates.json");

        if (!trainingResponse.ok || !templatesResponse.ok) {
            throw new Error("Could not load chatbot data.");
        }

        const csvData = await trainingResponse.text();

        responseTemplates = await templatesResponse.json();

        trainingExamples = parseCSV(csvData);

        addMessage(
            "Chatbot is ready! You can enter a question or keyword.",
            "bot"
        );

    }

    catch (error) {

        console.error("Loading error:", error);

        addMessage(
            "Sorry, the chatbot could not load its training data. Please refresh the page and try again.",
            "bot"
        );

    }

}


// Read CSV training examples

function parseCSV(csvData) {

    const rows = csvData.trim().split(/\r?\n/);

    const examples = [];

    for (let i = 1; i < rows.length; i++) {

        const values = rows[i].split(",");

        if (values.length >= 2) {

            examples.push({
                question: values[0].trim(),
                category: values[1].trim()
            });

        }

    }

    return examples;

}


// Normalize user questions

function normalizeText(text) {

    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

}


// Remove common words that do not add much meaning

function getKeywords(text) {

    const stopWords = [
        "i", "am", "is", "are", "the", "a", "an",
        "to", "do", "does", "did", "can", "could",
        "should", "would", "what", "how", "when",
        "where", "why", "after", "before", "my",
        "me", "you", "your", "and", "or", "in",
        "on", "for", "of", "it", "be", "again",
        "much", "some", "please"
    ];

    return normalizeText(text)
        .split(" ")
        .filter(word => word.length > 1 && !stopWords.includes(word));

}


// Match common keywords to chatbot categories

const categoryKeywords = {

    "Greeting": [
        "hello", "hey", "hi", "greetings"
    ],

    "Exercise Guidance": [
        "exercise", "jogging", "jog", "running",
        "training", "workout", "sport", "activity"
    ],

    "Hydration Guidance": [
        "water", "hydration", "hydrate", "rehydration",
        "electrolytes", "fluid", "fluids", "drinking"
    ],

    "Diet and Recovery Nutrition": [
        "food", "diet", "nutrition", "carbohydrates",
        "carbs", "protein", "meal", "eating", "recovery"
    ],

    "Cooling Strategies": [
        "cooling", "cool", "cold", "ice", "temperature",
        "towel", "cooldown"
    ],

    "Warning Symptoms": [
        "dizzy", "dizziness", "faint", "fainted",
        "confused", "confusion", "symptoms"
    ]

};


// Identify emergency warning symptoms

function checkEmergency(text) {

    const emergencyTerms = [
        "confusion",
        "confused",
        "faint",
        "fainted",
        "fainting",
        "collapse",
        "collapsed",
        "seizure",
        "seizures",
        "unconscious",
        "unresponsive",
        "altered consciousness",
        "heat stroke",
        "cannot wake",
        "unable to wake"
    ];

    const normalized = normalizeText(text);

    return emergencyTerms.some(term =>
        normalized.includes(term)
    );

}


// Find the closest matching training question

function findBestMatch(userQuestion) {

    const userKeywords = getKeywords(userQuestion);

    let bestMatch = null;
    let highestScore = 0;

    for (const example of trainingExamples) {

        const exampleKeywords = getKeywords(example.question);

        const matchingWords = userKeywords.filter(word =>
            exampleKeywords.includes(word)
        );

        const score = userKeywords.length === 0
            ? 0
            : matchingWords.length / userKeywords.length;

        if (score > highestScore) {

            highestScore = score;
            bestMatch = example;

        }

    }

    return {
        match: bestMatch,
        score: highestScore
    };

}


// Check whether the user entered a category keyword

function findCategoryKeyword(userQuestion) {

    const keywords = getKeywords(userQuestion);

    for (const category in categoryKeywords) {

        const matched = categoryKeywords[category].some(keyword =>
            keywords.includes(keyword)
        );

        if (matched) {
            return category;
        }

    }

    return null;

}


// Display messages in the chatbot

function addMessage(message, sender) {

    const messageElement = document.createElement("div");

    messageElement.classList.add("message");

    if (sender === "user") {

        messageElement.classList.add("user-message");

    }

    else {

        messageElement.classList.add("bot-message");

    }

    messageElement.textContent = message;

    chatBox.appendChild(messageElement);

    chatBox.scrollTop = chatBox.scrollHeight;

}


// Process the user's question

function getChatbotResponse(userQuestion) {

    const normalizedQuestion = normalizeText(userQuestion);

    if (normalizedQuestion.length === 0) {
        return "Please enter a question or keyword.";
    }


    // Emergency warning takes priority over normal matching

    if (checkEmergency(userQuestion)) {

        return "URGENT MEDICAL WARNING: Confusion, fainting, collapse, seizures, or altered consciousness during or after heat exposure may indicate a medical emergency. Stop activity and seek urgent medical help immediately. Do not wait for chatbot guidance.";

    }


    // Find the closest training example

    const result = findBestMatch(userQuestion);

    const categoryMatch = findCategoryKeyword(userQuestion);


    // Use the training example when the match is sufficiently strong

    if (result.match && result.score >= 0.30) {

        const category = result.match.category;

        return responseTemplates[category] ||
            "Sorry, I could not retrieve a response.";

    }


    // If the input is a recognizable category keyword

    if (categoryMatch) {

        return responseTemplates[categoryMatch] ||
            "Sorry, I could not retrieve a response.";

    }


    // If no reliable match is found

    return "I could not find a reliable match for your question. Please try asking about exercise, hydration, electrolytes, nutrition, cooling strategies, or warning symptoms.";

}


// Send the user's question

function sendMessage() {

    const question = userInput.value.trim();

    if (question === "") {
        return;
    }

    addMessage(question, "user");

    const response = getChatbotResponse(question);

    addMessage(response, "bot");

    userInput.value = "";

    userInput.focus();

}


// Ask button

sendButton.addEventListener("click", sendMessage);


// Allow the user to press Enter

userInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        sendMessage();

    }

});

// Example question buttons

const exampleButtons = document.querySelectorAll(
    ".example-button, .topic-card"
);

exampleButtons.forEach(button => {

    button.addEventListener("click", function() {

        const question = button.getAttribute("data-question");

        userInput.value = question;

        sendMessage();

        document.getElementById("assistant").scrollIntoView({
            behavior: "smooth"
        });

    });

});


// Start the chatbot

loadChatbotData();
