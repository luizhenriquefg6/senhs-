document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const responseContainer = document.getElementById('responseContainer');
    const outputArea = document.getElementById('outputArea');
    const placeholder = document.querySelector('.output-placeholder');
    const chips = document.querySelectorAll('.chip');
    const themeToggle = document.getElementById('themeToggle');

    // --- Função Central de Resposta (MESMA LÓGICA) ---
    function generateResponse(prompt) {
        // Simula diferentes respostas baseadas no input
        const lowerPrompt = prompt.toLowerCase();
        
        if (lowerPrompt.includes('ia') || lowerPrompt.includes('inteligência') || lowerPrompt.includes('o que é')) {
            return {
                text: '🧠 A Inteligência Artificial é um campo da computação que cria sistemas capazes de realizar tarefas que normalmente requerem inteligência humana. Isso inclui aprendizado, raciocínio, percepção e até criatividade. Estamos simulando uma interação básica aqui!',
                meta: 'Resposta conceitual · Simulação'
            };
        } else if (lowerPrompt.includes('poema') || lowerPrompt.includes('verso')) {
            return {
                text: '📜 Na tela em branco, um código a brilhar,\nO pensamento artificial a dançar.\nDados e lógica, um novo olhar,\nNexus AI começa a criar.\n\n(Verso gerado por simulação)',
                meta: 'Poema sintético · Criatividade algorítmica'
            };
        } else if (lowerPrompt.includes('produtividade') || lowerPrompt.includes('dica')) {
            return {
                text: '⚡ 3 Dicas de produtividade para hoje:\n1. Faça uma pausa a cada 50 minutos (técnica Pomodoro).\n2. Priorize uma tarefa complexa pela manhã.\n3. Use ferramentas de IA para organizar suas notas.',
                meta: 'Dicas práticas · Otimização de tempo'
            };
        } else {
            // Resposta genérica com eco
            return {
                text: `📨 Você disse: "${prompt}"\n\nEsta é uma resposta simulada. Em uma aplicação real, aqui seria integrada uma API de IA (como OpenAI, Gemini, etc.) para gerar uma resposta contextualizada.`,
                meta: 'Resposta genérica · Modo simulação'
            };
        }
    }

    // --- Função para exibir resposta ---
    function displayResponse(prompt) {
        const response = generateResponse(prompt);
        
        // Remove placeholder se existir
        if (placeholder) placeholder.style.display = 'none';
        
        // Cria o elemento de resposta
        const responseDiv = document.createElement('div');
        responseDiv.className = 'response-container';
        responseDiv.innerHTML = `
            <p>${response.text.replace(/\n/g, '<br>')}</p>
            <div class="meta">${response.meta}</div>
        `;
        
        // Adiciona ao container (substitui a anterior se houver)
        responseContainer.innerHTML = '';
        responseContainer.appendChild(responseDiv);
        
        // Rolagem suave para a resposta
        responseContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // --- Event Listeners ---

    // Botão enviar
    sendButton.addEventListener('click', () => {
        const prompt = userInput.value.trim();
        if (prompt === '') {
            userInput.focus();
            return;
        }
        displayResponse(prompt);
        // Limpa o input (opcional) 
        // userInput.value = ''; 
    });

    // Tecla Enter (sem Shift) para enviar
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });

    // Chips de ação rápida
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const prompt = chip.getAttribute('data-prompt') || chip.textContent.trim();
            userInput.value = prompt;
            displayResponse(prompt);
        });
    });

    // Alternar tema (escuro/claro)
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });

    // --- Inicialização com uma mensagem amigável (opcional) ---
    // Descomente abaixo se quiser uma mensagem inicial:
    // setTimeout(() => {
    //     displayResponse('Olá! Como posso ajudar você hoje?');
    // }, 300);
});
