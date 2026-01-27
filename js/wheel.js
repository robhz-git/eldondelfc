// --- CONFIGURATION ---
const COLORS = [
    '#FF003C', // Neon Red
    '#00F0FF', // Neon Blue
    '#39FF14', // Neon Green
    '#F0F2F0', // Cloud Dancer
    '#8A2BE2', // Blue Violet
    '#FFD700', // Gold
    '#FF1493', // Deep Pink
    '#00FFFF'  // Aqua
];

// --- STATE ---
let canvas, ctx;
let segments = ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5', 'Player 6'];
let currentAngle = 0;
let isSpinning = false;
let spinVelocity = 0;
let spinFriction = 0.985; // How quickly it slows down (closer to 1 = longer spin)
let supabase;
let animationFrameId;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    initSupabase();
    drawWheel();
    updateParticipantsList();
});

function initCanvas() {
    const container = document.getElementById('wheel-container');
    if (!container) {
        console.error("Canvas container not found!");
        return;
    }

    // Clear container
    container.innerHTML = '';

    // Create Canvas
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    // Responsive scaling
    canvas.style.maxWidth = '100%';
    canvas.style.height = 'auto';

    container.appendChild(canvas);
    ctx = canvas.getContext('2d');
}

// --- DRAWING LOOP ---
function drawWheel() {
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 250;

    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Segments
    const numSegments = segments.length || 1;
    const angleStep = (Math.PI * 2) / numSegments;

    // Save context for rotation
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentAngle);

    for (let i = 0; i < numSegments; i++) {
        const segStartAngle = i * angleStep;
        const segEndAngle = (i + 1) * angleStep;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, segStartAngle, segEndAngle);
        ctx.closePath();

        // Color
        ctx.fillStyle = COLORS[i % COLORS.length];
        ctx.fill();

        // Border
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#1A1A1A';
        ctx.stroke();

        // Text
        ctx.save();
        ctx.rotate(segStartAngle + angleStep / 2);
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#FFFFFF'; // White text for contrast
        ctx.font = 'bold 18px Rajdhani';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;

        let text = segments[i] || 'Empty';
        // Truncate long names
        if (text.length > 15) text = text.substring(0, 12) + '...';

        ctx.fillText(text, radius - 20, 0);
        ctx.restore();
    }

    // Restore context (undo rotation)
    ctx.restore();

    // 2. Draw Center Cap
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#1A1A1A';
    ctx.fill();
    ctx.strokeStyle = '#FF003C';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 3. Draw Pointer (Triangle at top)
    // The pointer is static at 12 o'clock (270 degrees visual, or -PI/2)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius + 10); // Tip overlapping wheel slightly
    ctx.lineTo(centerX - 15, centerY - radius - 20);
    ctx.lineTo(centerX + 15, centerY - radius - 20);
    ctx.closePath();

    ctx.fillStyle = '#FF003C'; // Neon Red
    ctx.shadowColor = '#FF003C';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0; // Reset shadow
}

// --- ANIMATION ---
function spinWheel() {
    if (isSpinning) return;
    if (segments.length === 0) {
        alert("Add participants first!");
        return;
    }

    isSpinning = true;
    const display = document.getElementById('winner-display');
    if (display) display.innerText = "SPINNING...";

    // Random initial push (0.3 to 0.8 rad/frame)
    spinVelocity = Math.random() * 0.4 + 0.3;

    animate();
}

function animate() {
    if (!isSpinning) return;

    // Apply Velocity
    currentAngle += spinVelocity;

    // Apply Friction (Decay)
    spinVelocity *= spinFriction;

    // Stop threshold
    if (spinVelocity < 0.002) {
        isSpinning = false;
        determineWinner();
    } else {
        drawWheel(); // Redraw at new angle
        animationFrameId = requestAnimationFrame(animate);
    }
}

function determineWinner() {
    // Math to find which segment is under the pointer
    // Pointer is at Top (-PI/2 or 270 degrees)
    // Wheel rotates clockwise (positive angle).

    // Normalize current angle to 0 - 2PI
    // Note: % (Math.PI * 2) can be negative if we spun weirdly, but usually positive with addition
    let normalizedRotation = currentAngle % (Math.PI * 2);

    // Explanation:
    // If we rotated 90 deg (PI/2), segment 0 moved from 0 to PI/2.
    // The pointer is at 3PI/2 (270).
    // We need to 'counter-rotate' the pointer to see where it lands on the original 0-indexed circle.

    const numSegments = segments.length;
    const angleStep = (Math.PI * 2) / numSegments;

    // Pointer is effectively at angle 3PI/2.
    // Relative angle on the wheel = (PointerPos - WheelRotation)
    let pointerRelativeAngle = (3 * Math.PI / 2) - normalizedRotation;

    // Wrap to 0-2PI
    while (pointerRelativeAngle < 0) pointerRelativeAngle += Math.PI * 2;
    pointerRelativeAngle = pointerRelativeAngle % (Math.PI * 2);

    const index = Math.floor(pointerRelativeAngle / angleStep);
    const winner = segments[index];

    const display = document.getElementById('winner-display');
    if (display) {
        display.innerText = `WINNER: ${winner}`;
        display.style.color = '#39FF14'; // Green for winner
        display.style.textShadow = '0 0 20px #39FF14';
    }

    drawWheel(); // Final static draw
}

// --- DATA MANAGEMENT ---
function addName() {
    const input = document.getElementById('new-name');
    const name = input.value.trim();
    if (name) {
        segments.push(name);
        input.value = '';
        drawWheel();
        updateParticipantsList();
    }
}

function updateParticipantsList() {
    const list = document.getElementById('participants-list');
    if (list) {
        list.innerHTML = segments.map(name =>
            `<span style="background: rgba(255,255,255,0.1); padding: 5px 10px; border-radius: 4px; font-size: 0.8rem; border: 1px solid #333; color: var(--text-dark);">${name}</span>`
        ).join('');
    }
}

// --- SUPABASE & TIKTOK ---
function initSupabase() {
    if (typeof supabase === 'undefined' && window.SUPABASE_URL && window.SUPABASE_ANON_KEY) {
        const { createClient } = window.supabase;
        supabase = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
        subscribeToRaffle();
    }
}

function subscribeToRaffle() {
    if (!supabase) return;
    supabase.channel('raffle-channel')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'raffle_participants' }, payload => {
            const newName = payload.new.username;
            addNameFromStream(newName);
        })
        .subscribe();
}

function addNameFromStream(name) {
    if (name && !segments.includes(name)) {
        segments.push(name);
        if (!isSpinning) drawWheel(); // Update visual if not busy
        updateParticipantsList();
    }
}

function syncWithFirebase() {
    alert("System uses TikTok Live Automation. Type /participar in chat!");
}
