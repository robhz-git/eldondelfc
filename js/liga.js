let currentTournamentId = null;

document.addEventListener('DOMContentLoaded', async () => {
    await loadSeasons();

    // Subscribe to real-time changes
    supabase
        .channel('public:matches')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, payload => {
            console.log('Change received!', payload);
            if (currentTournamentId) {
                loadStandings(currentTournamentId);
            }
        })
        .subscribe();
});

async function loadSeasons() {
    const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false });

    const nav = document.getElementById('season-nav');
    nav.innerHTML = '';

    if (data && data.length > 0) {
        data.forEach((t, index) => {
            const btn = document.createElement('button');
            btn.className = 'season-btn';
            btn.innerText = t.name;
            btn.onclick = () => {
                // Update active state
                document.querySelectorAll('.season-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentTournamentId = t.id;
                loadStandings(t.id);
            };
            nav.appendChild(btn);

            // Auto-select first one
            if (index === 0) {
                btn.click();
            }
        });
    } else {
        nav.innerHTML = '<span style="padding: 10px;">No active seasons found.</span>';
    }
}

async function loadStandings(tournamentId) {
    const tbody = document.getElementById('standings-body');
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Loading data...</td></tr>';

    // Call the RPC function we created in SQL
    const { data, error } = await supabase
        .rpc('get_standings', { p_tournament_id: tournamentId });

    if (error) {
        console.error(error);
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: red;">Error: ${error.message}</td></tr>`;
        return;
    }

    tbody.innerHTML = '';

    if (data && data.length > 0) {
        data.forEach((row, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="rank-cell">${index + 1}</td>
                <td class="team-cell">${row.team_name}</td>
                <td>${row.played}</td>
                <td>${row.won}</td>
                <td>${row.drawn}</td>
                <td>${row.lost}</td>
                <td>${row.gd > 0 ? '+' + row.gd : row.gd}</td>
                <td class="points-cell">${row.points}</td>
            `;
            tbody.appendChild(tr);
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No matches played yet.</td></tr>';
    }
}
