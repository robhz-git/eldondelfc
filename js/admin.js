// ADMIN LOGIC V2

// ADMIN LOGIC V2
// Note: 'sbClient' is initialized in js/config.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("Admin Script Loaded. Checking Supabase...");

    // Safety Check
    if (!window.sbClient) {
        console.error("CRITICAL: Supabase client not found (sbClient).");
        // alert("System Error: Database connection missing."); // Suppress alert to avoid annoyance if config delayed
        return;
    }

    const supabase = window.sbClient; // Local alias for convenience

    // 1. Fake Login Logic (Simple Passcode for V1)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = document.getElementById('email').value; // Using Email field as Username
            const pass = document.getElementById('password').value;

            const btn = loginForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = "VERIFYING...";
            btn.disabled = true;

            try {
                // Secure Server-Side Check (Multi-User)
                const { data, error } = await supabase.rpc('verify_admin_access', {
                    input_user: user,
                    input_pass: pass
                });

                if (error) {
                    console.error(error);
                    alert("System Error: " + error.message);
                    btn.innerText = originalText;
                    btn.disabled = false;
                    return;
                }

                if (data === true) {
                    alert("Access Granted. Welcome, Commander.");
                    document.getElementById('login-screen').style.display = 'none';
                    document.getElementById('admin-dashboard').style.display = 'block';
                    loadActivePlayers();
                    loadPendingPlayers();
                } else {
                    alert("Access Denied: Invalid Username or Password.");
                    document.getElementById('login-error').style.display = 'block';
                    btn.innerText = originalText;
                    btn.disabled = false;
                }
            } catch (err) {
                console.error(err);
                alert("Critical Error: " + err.message);
                btn.innerText = originalText;
                btn.disabled = false;
            }

            // Old Hardcoded way removed:
            // if (pass === 'admin2026') { ... }
        });
    }

    // 2. Match Submission
    const matchForm = document.getElementById('match-form');
    if (matchForm) {
        matchForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const homeId = document.getElementById('home-team').value;
            const awayId = document.getElementById('away-team').value;
            const homeScore = parseInt(document.getElementById('home-score').value);
            const awayScore = parseInt(document.getElementById('away-score').value);

            if (homeId === awayId) {
                alert("Cannot play against self!");
                return;
            }
            if (!homeId || !awayId || isNaN(homeScore) || isNaN(awayScore)) {
                alert("Invalid Data");
                return;
            }

            // Insert Match
            const { error } = await supabase
                .from('league_matches')
                .insert([{
                    player_home_id: homeId,
                    player_away_id: awayId,
                    score_home: homeScore,
                    score_away: awayScore,
                    recorded_by: 'Admin'
                }]);

            if (error) {
                console.error(error);
                alert("Error saving match: " + error.message);
            } else {
                showKinetic("MATCH SAVED");
                matchForm.reset();
                // Ideally refresh logs here
            }
        });
    }

    // 3. Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm("Terminate Session?")) {
                window.location.href = 'index.html'; // Return to Home
            }
        });
    }
});



async function loadActivePlayers() {
    const sb = window.sbClient;
    if (!sb) return;

    // Fetch active players
    const { data, error } = await sb
        .from('league_players')
        .select('id, username')
        .eq('status', 'active')
        .order('username');

    if (data) {
        const homeSel = document.getElementById('home-team');
        const awaySel = document.getElementById('away-team');

        // Reset
        homeSel.innerHTML = '<option value="">Home Team</option>';
        awaySel.innerHTML = '<option value="">Away Team</option>';

        data.forEach(p => {
            const opt = `<option value="${p.id}">${p.username}</option>`;
            homeSel.insertAdjacentHTML('beforeend', opt);
            awaySel.insertAdjacentHTML('beforeend', opt);
        });
    }
}

async function loadPendingPlayers() {
    const sb = window.sbClient;
    if (!sb) return;

    const { data, error } = await sb
        .from('league_players')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    const list = document.getElementById('pending-list');
    list.innerHTML = '';

    if (data && data.length > 0) {
        data.forEach(p => {
            const item = document.createElement('div');
            item.style.display = 'flex';
            item.style.justifyContent = 'space-between';
            item.style.alignItems = 'center';
            item.style.padding = '10px';
            item.style.background = 'rgba(255, 153, 0, 0.1)';
            item.style.border = '1px solid #ff9900';
            item.style.borderRadius = '5px';

            item.innerHTML = `
                <div>
                    <div style="font-weight:bold; color:white;">${p.username}</div>
                    <div style="font-size:0.8rem; color:#aaa;">EA: ${p.ea_id} | ${p.contact_info}</div>
                </div>
                <button onclick="approvePlayer('${p.id}')" style="background:#ff9900; color:black; border:none; padding:5px 10px; cursor:pointer; font-weight:bold;">ACC</button>
            `;
            list.appendChild(item);
        });
    } else {
        list.innerHTML = '<div style="color:#666;">No pending requests.</div>';
    }
}

window.approvePlayer = async function (id) {
    const sb = window.sbClient;
    if (!sb) return;

    if (!confirm("Authorize this commander?")) return;

    const { error } = await sb
        .from('league_players')
        .update({ status: 'active' })
        .eq('id', id);

    if (error) {
        alert("Error: " + error.message);
    } else {
        showKinetic("APPROVED");
        loadPendingPlayers();
        loadActivePlayers();
    }
}

function showKinetic(msg) {
    const el = document.getElementById('kinetic-msg');
    el.innerText = msg;
    el.classList.add('kinetic-active');
    setTimeout(() => {
        el.classList.remove('kinetic-active');
    }, 1600);
}
