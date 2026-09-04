document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const passwordOutput = document.getElementById('passwordOutput');
    const generateButton = document.getElementById('generateButton');
    const clearButton = document.getElementById('clearButton');
    const copyButton = document.getElementById('copyButton');
    const passwordLength = document.getElementById('passwordLength');
    const lengthValue = document.getElementById('lengthValue');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    const historyContainer = document.getElementById('historyContainer');
    const clearHistory = document.getElementById('clearHistory');
    const themeToggle = document.getElementById('themeToggle');
    
    // Checkboxes
    const includeUppercase = document.getElementById('includeUppercase');
    const includeLowercase = document.getElementById('includeLowercase');
    const includeNumbers = document.getElementById('includeNumbers');
    const includeSymbols = document.getElementById('includeSymbols');
    
    // Chips
    const chips = document.querySelectorAll('.chip');

    // --- CONSTANTES ---
    const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
    const NUMBERS = '0123456789';
    const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // --- ESTADO ---
    let history = [];

    // --- FUNÇÕES PRINCIPAIS ---

    function generatePassword() {
        const length = parseInt(passwordLength.value);
        let chars = '';
        let password = '';

        if (includeUppercase.checked) chars += UPPERCASE;
        if (includeLowercase.checked) chars += LOWERCASE;
        if (includeNumbers.checked) chars += NUMBERS;
        if (includeSymbols.checked) chars += SYMBOLS;

        if (chars === '') {
            alert('Selecione pelo menos uma opção de caracteres!');
            return null;
        }

        // Garante pelo menos um caractere de cada tipo selecionado
        let guaranteed = '';
        if (includeUppercase.checked) guaranteed += UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)];
        if (includeLowercase.checked) guaranteed += LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)];
        if (includeNumbers.checked) guaranteed += NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
        if (includeSymbols.checked) guaranteed += SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

        // Preenche o resto
        for (let i = guaranteed.length; i < length; i++) {
            password += chars[Math.floor(Math.random() * chars.length)];
        }

        // Embaralha para não ficar com os garantidos no início
        password = guaranteed + password;
        password = password.split('').sort(() => Math.random() - 0.5).join('');
        
        // Corta no tamanho exato
        password = password.slice(0, length);

        return password;
    }

    function updateStrength(password) {
        if (!password || password === 'Clique em Gerar') {
            strengthBar.className = 'strength-bar';
            strengthText.textContent = 'Força: ';
            return;
        }

        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (password.length >= 16) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        let level = '';
        if (score <= 3) level = 'weak';
        else if (score <= 5) level = 'medium';
        else if (score <= 7) level = 'strong';
        else level = 'very-strong';

        strengthBar.className = `strength-bar ${level}`;
        
        const labels = {
            'weak': 'Fraca',
            'medium': 'Média',
            'strong': 'Forte',
            'very-strong': 'Muito Forte'
        };
        strengthText.textContent = `Força: ${labels[level]}`;
    }

    function displayPassword(password) {
        if (password) {
            passwordOutput.value = password;
            updateStrength(password);
        } else {
            passwordOutput.value = 'Clique em Gerar';
            updateStrength('');
        }
    }

    function addToHistory(password) {
        if (!password || password === 'Clique em Gerar') return;
        
        const entry = {
            password: password,
            date: new Date().toLocaleString()
        };
        
        history.unshift(entry); // Adiciona no início
        if (history.length > 20) history.pop(); // Limita a 20 itens
        renderHistory();
    }

    function renderHistory() {
        const placeholder = document.querySelector('.history-placeholder');
        
        if (history.length === 0) {
            historyContainer.innerHTML = `
                <div class="history-placeholder">
                    <span class="placeholder-icon">🕒</span>
                    <p>Nenhuma senha gerada ainda</p>
                </div>
            `;
            return;
        }

        historyContainer.innerHTML = '';
        history.forEach((entry, index) => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.innerHTML = `
                <span class="password">${entry.password}</span>
                <div style="display:flex;align-items:center;gap:0.5rem;">
                    <span class="date">${entry.date}</span>
                    <button class="btn-copy-small" data-index="${index}" title="Copiar">📋</button>
                </div>
            `;
            historyContainer.appendChild(item);
        });

        // Adiciona eventos de cópia nos itens do histórico
        document.querySelectorAll('.btn-copy-small').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                const password = history[index].password;
                copyToClipboard(password);
            });
        });
    }

    function copyToClipboard(text) {
        if (!text || text === 'Clique em Gerar') {
            alert('Gere uma senha primeiro!');
            return;
        }
        
        navigator.clipboard.writeText(text).then(() => {
            const originalText = copyButton.innerHTML;
            copyButton.innerHTML = '✅';
            setTimeout(() => {
                copyButton.innerHTML = originalText;
            }, 1500);
        }).catch(() => {
            // Fallback para navegadores antigos
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Senha copiada!');
        });
    }

    function clearAll() {
        passwordOutput.value = 'Clique em Gerar';
        updateStrength('');
        history = [];
        renderHistory();
    }

    // --- EVENT LISTENERS ---

    generateButton.addEventListener('click', () => {
        const password = generatePassword();
        if (password) {
            displayPassword(password);
            addToHistory(password);
        }
    });

    copyButton.addEventListener('click', () => {
        copyToClipboard(passwordOutput.value);
    });

    clearButton.addEventListener('click', clearAll);

    clearHistory.addEventListener('click', () => {
        if (history.length === 0) return;
        if (confirm('Limpar todo o histórico de senhas?')) {
            history = [];
            renderHistory();
        }
    });

    // Atualiza o valor do comprimento
    passwordLength.addEventListener('input', () => {
        lengthValue.textContent = passwordLength.value;
    });

    // Chips de comprimento rápido
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const length = parseInt(chip.dataset.length);
            if (length) {
                passwordLength.value = length;
                lengthValue.textContent = length;
                generateButton.click();
            }
        });
    });

    // Tecla Enter no campo (gera senha)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && document.activeElement === passwordOutput) {
            generateButton.click();
        }
    });

    // Alternar tema escuro
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });

    // --- INICIALIZAÇÃO ---
    // Gera uma senha padrão ao carregar
    setTimeout(() => {
        const defaultPassword = generatePassword();
        if (defaultPassword) {
            displayPassword(defaultPassword);
            addToHistory(defaultPassword);
        }
    }, 200);
});
