// Supabase Configuration
// REPLACE THESE WITH YOUR ACTUAL SUPABASE PROJECT DETAILS
const SUPABASE_URL = 'https://vixhoswiutdirpnlwnex.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_pvP4-QrXTvzj2QbuKau-KA_xLJQ5n-H';

// Initialize Client
// Note: This assumes the supabase-js script is loaded in the HTML
// Initialize Client
// We attach to window.sbClient to avoid name collision with the library 'supabase' variable
window.sbClient = null;

if (window.supabase) {
    window.sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.error("Supabase CDN not loaded.");
}

if (!window.sbClient) {
    console.error("Supabase client init failed.");
}
