// --- CONFIGURATION ---
const COLORS = [
    '#FF003C', // Red
    '#00F0FF', // Blue
    '#39FF14', // Green
    '#FFD700', // Gold
    '#9900FF', // Purple
    '#FF0099'  // Pink
];

// --- STATE ---
let canvas, ctx;
let segments = ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5', 'Player 6'];
let currentAngle = 0;
let isSpinning = false;
let spinVelocity = 0;
const FRICTION = 0.99; // 0.99 = slow decay, 0.95 = fast decay

let supabase;

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Wheel V2 initializing...");
    canvas = document.getElementById('wheelCanvas');
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }
    ctx = canvas.getContext('2d');

    // Initial Render
    draw();
    updateUI();

    // Connect DB
    initSupabase();
});


// --- DRAWING ENGINE ---
function draw() {
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 260;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Wheel Segments
    const len = segments.length || 1;
    const step = (Math.PI * 2) / len;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentAngle);

    for (let i = 0; i < len; i++) {
        const startRad = i * step;
        const endRad = (i + 1) * step;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startRad, endRad);
        ctx.closePath();

        // Slice Color
        ctx.fillStyle = COLORS[i % COLORS.length];
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#111';
        ctx.stroke();

        // Text
        ctx.save();
        ctx.rotate(startRad + step / 2);
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 20px sans-serif';
        // Shadow for readability
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 4;

        const text = segments[i] || 'Empty';
        ctx.fillText(text, radius - 20, 0);
        ctx.restore();
    }
    ctx.restore();

    // 2. Center Pin
    ctx.beginPath();
    ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
    ctx.fillStyle = '#White';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#333';
    ctx.stroke();

    // 3. Pointer (Triangle at TOP aka 270 deg)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius + 20); // Tip
    ctx.lineTo(centerX - 20, centerY - radius - 20); // Left
    ctx.lineTo(centerX + 20, centerY - radius - 20); // Right
    ctx.closePath();
    ctx.fillStyle = '#FFF';
    ctx.fill();
    ctx.stroke();
}


// --- ANIMATION LOOP ---
function spin() {
    if (isSpinning) return;
    if (segments.length === 0) {
        alert("Nobody to spin!");
        return;
    }

    isSpinning = true;
    spinVelocity = Math.random() * 0.3 + 0.4; // Initial push
    document.getElementById('winner-text').innerText = "SPINNING...";
    document.getElementById('winner-text').style.color = "#FFF";

    requestAnimationFrame(animateLoop);
}

function animateLoop() {
    if (!isSpinning) return;

    // Move
    currentAngle += spinVelocity;

    // Slow down
    spinVelocity *= FRICTION;

    // Stop?
    if (spinVelocity < 0.001) {
        isSpinning = false;
        determineWinner();
    } else {
        draw();
        requestAnimationFrame(animateLoop);
    }
}

function determineWinner() {
    // Normalize angle to 0..2PI
    // Angle increases clockwise
    // Pointer is at 270 deg (3PI/2)

    const len = segments.length;
    const step = (Math.PI * 2) / len;

    let normAngle = currentAngle % (Math.PI * 2);

    // Logic: The slice at the pointer is actually (PointerPos - WheelRot)
    let relativeAngle = (3 * Math.PI / 2) - normAngle;

    // Fix negatives
    while (relativeAngle < 0) relativeAngle += Math.PI * 2;
    relativeAngle = relativeAngle % (Math.PI * 2);

    const index = Math.floor(relativeAngle / step);
    const winner = segments[index] || "Unknown";

    const winText = document.getElementById('winner-text');
    winText.innerText = `WINNER: ${winner}`;
    winText.style.color = "#39FF14"; // Green neon

    draw(); // Final clean draw
}


// --- DATA & UI ---
function addManualName() {
    const input = document.getElementById('nameInput');
    const val = input.value.trim();
    if (val) {
        segments.push(val);
        input.value = '';
        updateUI();
        if (!isSpinning) draw();
    }
}

function updateUI() {
    const container = document.getElementById('participants-container');
    const countSpan = document.getElementById('count');

    countSpan.innerText = segments.length;

    container.innerHTML = segments.map(s =>
        `<div style="background:#333; color:white; padding:4px 10px; border-radius:4px; font-size:0.9rem;">${s}</div>`
    ).join('');
}

// --- SUPABASE INTEGRATION ---
function initSupabase() {
    // Must be defined in config.js
    if (typeof window.supabase !== 'undefined' && window.SUPABASE_URL) {
        // Init
        supabase = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
        console.log("Supabase connected.");

        // Subscribe
        supabase.channel('raffle-v2')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'raffle_participants' }, payload => {
                const newName = payload.new.username;
                console.log("New User:", newName);

                if (newName && !segments.includes(newName)) {
                    segments.push(newName);
                    updateUI();
                    if (!isSpinning) draw();
                }
            })
            .subscribe();

    } else {
        console.warn("Supabase credentials missing in window scope.");
    }
}
