// ===============================
// Azure OpenAI Config
// ===============================
const apiKey = '7bRmjDBN7TpKLn1PDkN9BzHk19aeHQ9OJkjjmVaM31yUQmmjWwxVJQQJ99CGACR0EKYXJ3w3AAABACOG9Fry';
const endpoint = 'https://aiweek2026.openai.azure.com/';
const deployment = 'gpt-5.1';
const apiVersion = '2025-03-01-preview';



window.onload = () => {
  setTimeout(() => {
    document.getElementById("chatWindow").classList.add("open");
  }, 800);
};
// ===============================
// Conversation Memory
// ===============================
let conversation = [];


// ===============================
// ===== STUDENT KNOWLEDGE AREA =====
// ===============================
async function loadKnowledge() {
    return `
    
Business Info:

- Service providers: any field, varified
- Collaboration: TUT, UJ, UP and other varsities
- Internships available: on the intership page
- Service location: All provices in SA

`;
}
// ===============================
// ===== END KNOWLEDGE AREA =====
// ===============================


// ===============================
// Typing Effect (optional but nice)
// ===============================
function typeText(element, text, speed = 15) {
    let i = 0;
    function typing() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }
    typing();
}


// ===============================
// AI Chat Function
// ===============================
async function handleChat() {

    const inputField = document.getElementById('chatInput');
    const input = inputField.value.trim();
    const chatBox = document.getElementById('chatBox');

    if (!input) return;

    // Clear textbox
    inputField.value = "";

    // ===============================
    // 1. Show USER message
    // ===============================
    chatBox.innerHTML += `
      <div class="message user">
        <div class="avatar">👨‍🌾</div>
        <div class="bubble">${input}</div>
      </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;


    // ===============================
    // 2. Show THINKING message
    // ===============================
    chatBox.innerHTML += `
      <div class="message ai" id="thinkingMsg">
        <div class="avatar">🤖</div>
        <div class="bubble">Thinking<span class="dots"></span></div>
      </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;

    // Allow UI to render
    await new Promise(resolve => setTimeout(resolve, 50));


    try {

        const knowledge = await loadKnowledge();

        // ===============================
        // Save USER message to memory
        // ===============================
        conversation.push({
            role: "user",
            content: [{ type: "input_text", text: input }]
        });

        if (conversation.length > 10) {
            conversation.shift();
        }


        // ===============================
        // API CALL
        // ===============================
        const response = await fetch(
            `${endpoint}openai/responses?api-version=${apiVersion}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "api-key": apiKey
                },
                body: JSON.stringify({
                    model: deployment,

                    instructions: `
					You are a helpful clothing store assistant.

					IMPORTANT RULES:
					- ONLY answer questions related to the store, orders, sizes, colors, delivery, or store information
					- DO NOT answer questions outside of this business context
					- If the user asks something unrelated, politely refuse

					You can:
					- Help users choose the correct shoe size from cm
					- Recommend available products from the store knowledge
					- Answer questions about delivery, colors, and availability

					Be friendly, short, and conversational.

					Store Knowledge:
					---------------------
					${knowledge}
					---------------------
					`,

                    input: conversation,
                    max_output_tokens: 500
                })
            }
        );

        const data = await response.json();
        console.log("Azure Response:", data);

        if (!response.ok) {
            throw new Error(JSON.stringify(data));
        }


        // ===============================
        // Extract AI reply
        // ===============================
        let reply = "";

        if (data.output) {
            data.output.forEach(item => {
                if (item.content) {
                    item.content.forEach(content => {
                        if (content.type === "output_text") {
                            reply += content.text;
                        }
                    });
                }
            });
        }

        if (!reply) {
            reply = data.output_text || "No response.";
        }


        // ===============================
        // Remove THINKING
        // ===============================
        const thinking = document.getElementById("thinkingMsg");
        if (thinking) thinking.remove();


        // ===============================
        // Save AI response to memory
        // ===============================
        conversation.push({
            role: "assistant",
            content: [{ type: "output_text", text: reply }]
        });


        // ===============================
        // Show AI message (typing effect)
        // ===============================
        const aiMessage = document.createElement("div");
        aiMessage.className = "message ai";

        aiMessage.innerHTML = `
            <div class="avatar">🤖</div>
            <div class="bubble"></div>
        `;

        chatBox.appendChild(aiMessage);

        const bubble = aiMessage.querySelector(".bubble");

        typeText(bubble, reply);

        chatBox.scrollTop = chatBox.scrollHeight;


    } catch (error) {

        console.error("Error:", error);

        const thinking = document.getElementById("thinkingMsg");
        if (thinking) thinking.remove();

        chatBox.innerHTML += `
          <div class="message ai">
            <div class="avatar">🤖</div>
            <div class="bubble">⚠️ Error communicating with AI service.</div>
          </div>
        `;
    }
}
