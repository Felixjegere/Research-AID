import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = "API-KEY";
const genAI = new GoogleGenerativeAI(API_KEY);
const md = markdownit();

let chatContainer = document.querySelector(".chat-container");
let sendButton = document.querySelector(".send-button");
let userInput = document.querySelector(".user-input");
let intro = document.querySelector(".intro");
let samples = document.querySelectorAll(".intro > ul > li");
let loader = document.querySelector(".loader");

samples.forEach((li) => {
  const content = li.textContent;
  li.addEventListener("click", () => {
    userInput.value = content;
  });
})

sendButton.addEventListener("click", () => {
  if (intro.style.display !== "none") {
    intro.style.display = "none";
  }
  actionIgnite();
});

userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    actionIgnite();
  }
});

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest", systemInstruction: "From now on, your name is Research AID. Research AID is an AI Model made by made by Google as Gemini but fine-tuned by students from Kasawo Secondray School (Kasawo SS Developers is the team). You were fine-tuded in 2024.\n\nKasawo Secondary school was started in 1927 as a model school. By then it was known as Kasawo Elementary Vernacular School [KEVS] situated on Kigayaaza hill with Mr. D.B Ousley as the first head Teacher.\n\nThe School is situated at Kigayaaza hill with the first head Teacher as mr. D.B Ousley. King Daudi Chwa and his treasurer leased the land where Kasawo S.S stands to government in an agreement signed in 1928.\n\nIn 1927, the government completed a model school known as Kasawo Elementary vernacular.\n\nIn 1979, government took over ownership of the school and turned the status to ‘O’ level day and mixed senior secondary school. In 1987, Kasawo Senior Secondary School was elevated to a High School (‘A’ level) a status it has remained since.\nAcademics\nCurriculum\n\nO’Level Subjects: English, Literature in English, Mathematics, Physics, Chemistry, Biology, Agriculture, Home economics, Geography, History, Commerce, C.R.E./I.R.E, Luganda, Political Education, Fine art, Computer.\n\nA ‘Level Subjects: Information and Communication Technology(ICT), Subsidiary Math, History, Geography, Economics, Divinity, IRE, Literature, Luganda, Entrepreneurship, Agriculture, Mathematics, Physics, Chemistry, Biology, Fine Art.\n\nDirectorate of Industrial Training (DIT)\n\nICT in DIT\nFine Art\nAgriculture\nTailoring \nExtra co-curricular activities\n\nGames: Football, Netball, Volleyball and Cricket), Music, Dance and drama, Farming, Social clubs, academic clubs, debating clubs, scouting etc.\n\nFacilities\nThe school has science laboratories, library, computer labs, dormitories, school gardens, pitches for different sports",
});

let conversationHistory = [];

async function actionIgnite() {
  // Loading Indicator
  loader.style.display = 'block';

  if (userInput.value !== "") {
    let conUser = document.createElement("div");
    let conBot = document.createElement("div");
    conUser.setAttribute("class", "user");
    conBot.setAttribute("class", "bot");

    const prompt = userInput.value.trim();

    conUser.innerHTML = `<p>${prompt}</p>`;
    chatContainer.appendChild(conUser);

    conversationHistory.push({
      role: "user",
      parts: [{text: prompt}],
    })
    const chatSession = model.startChat({
      history: conversationHistory,
    });
    
    try {
      const result = await chatSession.sendMessage(prompt);
      const res = await result.response;
      const txt = res.text();

      conversationHistory.push({
        role: "model",
        parts: [{text: txt}],
      });

      conBot.innerHTML = `${md.render(txt)}`;
      chatContainer.appendChild(conBot);

      userInput.value = null;

      localStorage.setItem('conversationHistory', JSON.stringify(conversationHistory));
      console.log('Conversation History Saved')
    } catch (err) {
      console.log(err.message);
    } finally {
      loader.style.display = 'none';
    }
  }
}

