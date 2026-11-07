
// ========================================
// MANSAROVAR DIWALI SURPRISE
// One consistent version - Firebase ready
// ========================================

// 1. FIREBASE CONFIGURATION
// Replace these values with your Firebase config later.

const firebaseConfig = {
    apiKey: "PASTE_YOUR_API_KEY",
    authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
    projectId: "PASTE_YOUR_PROJECT_ID",
    storageBucket: "PASTE_YOUR_STORAGE_BUCKET",
    messagingSenderId: "PASTE_YOUR_SENDER_ID",
    appId: "PASTE_YOUR_APP_ID"
};

let db = null;
let firebaseReady = false;

// 2. QUESTIONS AND PERSONALIZED REPLIES

const questions = [
    {
        question: "Did you sleep well, my love? 🥰",
        answers: [
            {
                text: "Very well ❤️",
                reply: "That makes me so happy, sweetheart! I hope your day is as beautiful as your smile. ❤️"
            },
            {
                text: "Not really 🥺",
                reply: "Aww my baby! I wish I could be beside you, hold you close and make you feel comfortable. 🤗"
            },
            {
                text: "I missed you 💗",
                reply: "I missed you more, Mansarovar! You are the first thought in my morning and the last thought at night. 💕"
            }
        ]
    },
    {
        question: "How is your heart feeling today? 💕",
        answers: [
            {
                text: "Happy 😊",
                reply: "Your happiness is everything to me. Keep that beautiful smile shining, my sunshine! 🌸"
            },
            {
                text: "A little sad 🥺",
                reply: "Come here, my love. Imagine me giving you the biggest hug. You can always share your feelings with me. 🫂"
            },
            {
                text: "Missing you ❤️",
                reply: "I wish I could magically appear beside you and spend the whole day with you. I miss you too! 💗"
            }
        ]
    },
    {
        question: "Did you miss me today? 😘",
        answers: [
            {
                text: "Of course! ❤️",
                reply: "Hehe! I knew it. But remember, I am always the one who misses you more! 😘"
            },
            {
                text: "So much! 🥹",
                reply: "Awww! Sending you endless hugs and kisses. I wish I could see you right now. 💋"
            },
            {
                text: "Every second 💗",
                reply: "Then we definitely need more moments together. You are my favourite person! ❤️"
            }
        ]
    },
    {
        question: "What would make you feel loved right now? 💌",
        answers: [
            {
                text: "A sweet message 💕",
                reply: "You are precious to me. You deserve happiness, care and all the love in this world. I love you! 💗"
            },
            {
                text: "A big hug 🤗",
                reply: "Imagine my arms around you right now. A warm hug, a forehead kiss and a promise that you are special to me. 🫂"
            },
            {
                text: "More attention ❤️",
                reply: "You deserve my time, attention and care. I want my actions to make you feel loved every day. ❤️"
            }
        ]
    }
];

let currentQuestion = 0;
let selectedAnswer = null;

// 3. LOAD PREVIOUS LOCAL ANSWERS

let answers = JSON.parse(
    localStorage.getItem("mansarovarAnswers") || "[]"
);

// 4. FIREBASE INITIALIZATION
// Firebase is optional for now.

async function initializeFirebase() {
    if (
        !firebaseConfig.apiKey ||
        firebaseConfig.apiKey.startsWith("PASTE_")
    ) {
        console.log("Firebase not connected. Local saving is active.");
        return;
    }

    try {
        const { initializeApp } =
            await import("https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js");

        const { getAuth, signInAnonymously } =
            await import("https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js");

        const { getFirestore, collection, addDoc, serverTimestamp } =
            await import("https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js");

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);

        await signInAnonymously(auth);

        db = getFirestore(app);
        firebaseReady = true;

        window.firebaseDatabase = {
            collection,
            addDoc,
            serverTimestamp
        };

        console.log("Firebase connected successfully ❤️");

    } catch (error) {
        console.error("Firebase connection error:", error);
        console.log("Local saving will continue.");
    }
}

// 5. SAVE ANSWERS

async function saveAnswer(question, answer) {
    const data = {
        question: question,
        answer: answer,
        date: new Date().toLocaleString(),
        type: "website-response"
    };

    // Save locally
    answers.push(data);

    localStorage.setItem(
        "mansarovarAnswers",
        JSON.stringify(answers)
    );

    // Save to Firebase if connected
    if (firebaseReady && db) {
        try {
            const { collection, addDoc, serverTimestamp } =
                window.firebaseDatabase;

            await addDoc(collection(db, "responses"), {
                ...data,
                createdAt: serverTimestamp()
            });

            console.log("Answer saved to Firebase ❤️");

        } catch (error) {
            console.error("Firebase save failed:", error);
        }
    }
}

// 6. DISPLAY QUESTIONS

function showQuestion() {
    const question = questions[currentQuestion];

    document.getElementById("questionText").textContent =
        question.question;

    const options = document.getElementById("answerOptions");

    options.innerHTML = "";

    selectedAnswer = null;

    question.answers.forEach(answer => {
        const button = document.createElement("button");

        button.textContent = answer.text;

        button.onclick = () => {
            selectedAnswer = answer;

            document.querySelectorAll("#answerOptions button")
                .forEach(btn => {
                    btn.style.background = "";
                    btn.style.color = "";
                });

            button.style.background = "#e84e82";
            button.style.color = "#ffffff";

            document.getElementById("feedback").textContent =
                answer.reply;
        };

        options.appendChild(button);
    });

    document.getElementById("feedback").textContent = "";

    const nextBtn = document.getElementById("nextBtn");

    nextBtn.style.display = "inline-block";

    nextBtn.textContent =
        currentQuestion === questions.length - 1
            ? "Finish 💖"
            : "Next Question ➜";
}

// 7. NEXT QUESTION

async function nextQuestion() {
    if (!selectedAnswer) {
        document.getElementById("feedback").textContent =
            "Choose an answer first, sweetheart! 💗";
        return;
    }

    const nextBtn = document.getElementById("nextBtn");

    nextBtn.disabled = true;

    const question = questions[currentQuestion].question;
    const answer = selectedAnswer.text;

    await saveAnswer(question, answer);

    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion();
    } else {
        document.getElementById("questionText").textContent =
            "Thank you for sharing your feelings with me! ❤️";

        document.getElementById("answerOptions").innerHTML = "";

        document.getElementById("feedback").textContent =
            "Every little answer matters to me, my love. I hope I made you smile! 💕";

        nextBtn.style.display = "none";
    }

    nextBtn.disabled = false;
}

// 8. ATTENTION SECTION

function chooseNeed(need) {
    const replies = {
        "A long hug 🤗":
            "Imagine me hugging you tightly and never letting go! 🤗❤️",

        "More attention ❤️":
            "You deserve my time, care and attention. I want you to feel special every day! 💗",

        "Cute messages 💌":
            "You are my favourite notification and my sweetest thought! 💕",

        "Make me laugh 😂":
            "Challenge accepted! Your smile is my favourite achievement. 😂❤️",

        "Just stay with me 🫂":
            "I am here to listen, support you and spend time with you. You matter to me! 🫂"
    };

    document.getElementById("needFeedback").textContent =
        replies[need] || "I want to make you happy, sweetheart! ❤️";

    saveAnswer("What would make you happy?", need);
}

// 9. I LOVE YOU MORE CHALLENGE

function loveReply(reply) {
    document.getElementById("loveReplyText").textContent =
        reply + " But I still love you more, Mansarovar! ❤️";

    saveAnswer("Who loves more?", reply);
}

// 10. FINAL SURPRISE

function finalSurprise() {
    document.getElementById("finalMessage").innerHTML =
        "Mansarovar, you are my favourite blessing! ❤️<br>" +
        "I loved you yesterday, I love you today, and I'll love you more with every tomorrow. 💗";

    for (let i = 0; i < 35; i++) {
        createHeart();
    }
}

// 11. FLOATING HEARTS

function createHeart() {
    const heart = document.createElement("div");

    heart.className = "heart";

    heart.textContent = ["❤️", "💕", "💗", "💖", "💘"][
        Math.floor(Math.random() * 5)
    ];

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize =
        (15 + Math.random() * 25) + "px";

    heart.style.animationDuration =
        (4 + Math.random() * 5) + "s";

    document.getElementById("hearts").appendChild(heart);

    setTimeout(() => heart.remove(), 9000);
}

// 12. START WEBSITE

initializeFirebase();

setInterval(createHeart, 900);

showQuestion();
