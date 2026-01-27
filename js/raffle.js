// State
let participants = [];
let isDrawing = false;
let supabase;

// Init
document.addEventListener('DOMContentLoaded', () => {
    initSupabase();
    updateUI();
});

// Logic
function startDraw() {
    if (participants.length === 0) {
        alert("No participants yet!");
        return;
    }
    if (isDrawing) return;

    isDrawing = true;
    const display = document.getElementById('display-box');
    const btn = document.getElementById('draw-btn');

    // Reset Style
    display.classList.remove('winner');
    display.style.color = 'white';
    btn.disabled = true;
    btn.innerText = "ROLLING...";

    // Animation Params
    let speed = 50; // ms per name change
    let duration = 3000; // ms total spin time
    let elapsed = 0;

    const shuffleInterval = setInterval(() => {
        // Pick random name
        const randomName = participants[Math.floor(Math.random() * participants.length)];
        display.innerText = randomName;

        elapsed += speed;

        // Slow down effect
        if (elapsed > duration - 1000) speed += 20;

        if (elapsed >= duration) {
            clearInterval(shuffleInterval);
            finalizeWinner(randomName);
        }
    }, speed);
}

function finalizeWinner(name) {
    const display = document.getElementById('display-box');
    const btn = document.getElementById('draw-btn');

    // Visuals
    display.innerText = name;
    display.classList.add('winner'); // Turns green/neon via CSS

    // Cleanup
    isDrawing = false;
    btn.disabled = false;
    btn.innerText = "DRAW WINNER";

    // Celebrate
    createConfetti();
}

// Data Management
function addManual() {
    const input = document.getElementById('manual-name');
    const name = input.value.trim();
    if (name && !participants.includes(name)) {
        participants.push(name);
        input.value = '';
        updateUI();
        // Feedback
        const display = document.getElementById('display-box');
        if (!isDrawing && display.innerText === "WAITING...") {
            display.innerText = "READY";
        }
    }
}

function updateUI() {
    // Count
    document.getElementById('count').innerText = participants.length;

    // List
    const list = document.getElementById('participants-list');
    list.innerHTML = participants.map(p =>
        `<div class="participant-pill">${p}</div>`
    ).join('');
}

// Supabase & TikTok
function initSupabase() {
    if (typeof window.supabase !== 'undefined' && window.SUPABASE_URL) {
        supabase = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
        console.log("Supabase connected for Raffle.");

        supabase.channel('raffle-simple')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'raffle_participants' }, payload => {
                const newName = payload.new.username;
                if (newName && !participants.includes(newName)) {
                    participants.push(newName);
                    updateUI();

                    // Live Feedback on the big screen if idle
                    const display = document.getElementById('display-box');
                    if (!isDrawing) {
                        display.innerText = newName; // Show latest person
                        setTimeout(() => {
                            if (!isDrawing) display.innerText = "READY";
                        }, 2000);
                    }
                }
            })
            .subscribe();
    }
}

// Simple Confetti Effect
function createConfetti() {
    const colors = ['#FF003C', '#39FF14', '#00F0FF', '#FFFF00'];
    for (let i = 0; i < 50; i++) {
        const conf = document.createElement('div');
        conf.style.position = 'fixed';
        conf.style.left = Math.random() * 100 + 'vw';
        conf.style.top = '-10px';
        conf.style.width = '10px';
        conf.style.height = '10px';
        conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        conf.style.transition = 'top 3s ease-out, transform 3s linear';
        conf.style.zIndex = '9999';
        document.body.appendChild(conf);

        setTimeout(() => {
            conf.style.top = '110vh';
            conf.style.transform = `rotate(${Math.random() * 360}deg)`;
        }, 100);

        setTimeout(() => {
            conf.remove();
        }, 3000);
    }
}
