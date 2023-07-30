
let chatInput = document.querySelector('#chat-input');
let sendBtn = document.querySelector('#send-btn');
let introContainer = document.querySelector('.intro-container');
let chatContainer = document.querySelector('.chat-container');
let themeBtn = document.querySelector('#theme-btn');
let deleteBtn = document.querySelector('#delete-btn');
let body = document.body;

const API_KEY = key();
let userText = null;

function loadDataFromLocalstorage(){
    const themeColor = localStorage.getItem("theme-color");
    body.classList.toggle("light-mode", themeColor === "light-mode");
    if (body.classList.contains('light-mode')){
        themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }else{
        themeBtn.innerHTML = '<i class="fa-regular fa-sun">';
    }

    if (!localStorage.getItem('all-chats')){
        introContainer.style.display = "block";
        body.style.display = "flex";
    }else{
        introContainer.style.display = "none";
        body.style.display = "block";
        chatContainer.innerHTML = localStorage.getItem('all-chats');
        chatContainer.scrollTo(0, chatContainer.scrollHeight);
    };

    if (introContainer.style.display != "none"){
        document.querySelectorAll('.examples .def p').forEach(question => {
            question.addEventListener('click', function(){
                chatInput.value = question.innerText.slice(1,-1);
            })
        })
    }
}


async function getChatResponse(incomingChatDiv){
    const API_URL = "https://api.openai.com/v1/completions";
    const p = document.createElement('p');

    const requestOptions = {
        method : "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body : JSON.stringify({
            model: "text-davinci-003",
            prompt: userText,
            max_tokens: 2048,
            temperature: 0.2,
            n: 1,
            stop: null
        })
    }

    try{
        const response = await (await fetch(API_URL, requestOptions)).json();
        console.log(response);
        p.innerText = response.choices[0].text.trim();
    }catch(error){
        console.log(error);
        p.innerText = "Oops! Something went wrong while retrieving the response. Please try again.";
    }

    incomingChatDiv.querySelector('.typing-animation').remove();
    incomingChatDiv.querySelector('.chat-details').appendChild(p);
    localStorage.setItem('all-chats', chatContainer.innerHTML);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

function copyResponse(copyBtn){
    const responseTextElement = copyBtn.parentElement.querySelector('p');
    navigator.clipboard.writeText(responseTextElement.textContent);
    copyBtn.innerHTML = '<i class="fa-solid fa-clipboard-check"></i>';
    setTimeout(function(){
        copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
    }, 1000)
}


function createChatElement(content, className){
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = content;
    return chatDiv;
}

function showTypingAnimation(){
    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="./images/chatbot.jpg" alt="chatbot-img">
                        <div class="typing-animation">
                            <div class="typing-dot" style="--delay: 0.2s"></div>
                            <div class="typing-dot" style="--delay: 0.3s"></div>
                            <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>
                    </div>
                    <span onclick="copyResponse(this)" id="copy-content"><i class="fa-regular fa-copy"></i></span>
                </div>`;

    const incomingChatDiv = createChatElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
}
function key(){
    return "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";
}
function handleOutgoingChat(){
    userText = chatInput.value.trim();
    if (!userText){
        return;
    }
    chatInput.value = "";
    chatInput.style.height = `${initialInputHeight}`;

    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="./images/user.jpg" alt="user-img">
                        <p>${userText}</p>
                    </div>
                  </div>`;

    const outgoingChatDiv = createChatElement(html, "outgoing");
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);        
}

deleteBtn.addEventListener('click', function(){
    if (confirm("Are you sure you want to delete all the chats?")){
        chatContainer.innerHTML = "";
        localStorage.removeItem("all-chats");
        loadDataFromLocalstorage();
    }
})

themeBtn.addEventListener('click', function(){
    body.classList.toggle('light-mode');
    if (body.classList.contains('light-mode')){
        localStorage.setItem("theme-color", "light-mode");
        themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }else{
        localStorage.setItem("theme-color", "dark-mode");
        themeBtn.innerHTML = '<i class="fa-regular fa-sun">';
    }
})

const initialInputHeight = chatInput.scrollHeight;

chatInput.addEventListener('input', function(){
    chatInput.style.height = `${initialInputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`
})

chatInput.addEventListener('keydown', (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
        e.preventDefault();
        handleOutgoingChat();
    }
})

loadDataFromLocalstorage();

sendBtn.addEventListener('click', function(){
    if (chatInput.value.trim() != ""){
        introContainer.style.display = "none";
        body.style.display = "block";
    }else{
        introContainer.style.display = "block";
        body.style.display = "flex";
    }
    handleOutgoingChat();
})