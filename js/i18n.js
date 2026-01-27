// INTERNATIONALIZATION (i18n) MODULE

const translations = {
    es: {
        // ... (Common) ...
        system_online: "SISTEMA EN LÍNEA",
        commander_center: "CENTRO DE COMANDO",
        back: "VOLVER",
        // ... (Registration) ...
        reg_title: "REGISTRO DE JUGADOR",
        trainer_name: "NOMBRE DE ENTRENADOR",
        trainer_hint: "Este nombre aparecerá en la tabla.",
        contact_private: "CONTACTO (Privado)",
        contact_hint: "Visible solo para administradores.",
        register_btn: "REGISTRARSE EN LA LIGA",
        sending: "ENVIANDO...",
        sent_title: "REGISTRO ENVIADO",
        sent_desc: "Un administrador revisará tu solicitud pronto.",
        return_home: "VOLVER AL INICIO",
        // ... (League) ...
        league_standings: "TABLA DE LIGA",
        register_action: "REGISTRARSE",
        awards_title: "PREMIOS",
        golden_boot: "BOTA DE ORO",
        golden_glove: "GUANTE DE ORO",
        current_fav: "FAVORITO ACTUAL",
        proj_winner: "Proyectado Ganador",
        goals: "GOLES",
        clean_sheets: "VALLAS INVICTAS",
        join_league: "UNIRSE A LA LIGA",
        // ... (Original app.js keys for index) ...
        welcome_title: "BIENVENUE,<br>COMMANDANT", // Just keeping placeholders for specific keys if needed
        // We will merge/include the full list from app.js to ensure index.html keeps working if we switch
    },
    en: {
        system_online: "SYSTEM ONLINE",
        commander_center: "COMMAND CENTER",
        back: "BACK",
        reg_title: "PLAYER REGISTRATION",
        trainer_name: "TRAINER NAME",
        trainer_hint: "This name will appear in standings.",
        contact_private: "CONTACT (Private)",
        contact_hint: "Only visible to admins for verification.",
        register_btn: "REGISTER FOR LEAGUE",
        sending: "SENDING...",
        sent_title: "REGISTRATION SENT",
        sent_desc: "An admin will review your application shortly.",
        return_home: "RETURN HOME",
        league_standings: "LEAGUE STANDINGS",
        register_action: "REGISTER",
        awards_title: "AWARDS",
        golden_boot: "GOLDEN BOOT",
        golden_glove: "GOLDEN GLOVE",
        current_fav: "CURRENT FAVORITE",
        proj_winner: "Projected Winner",
        goals: "GOALS",
        clean_sheets: "CLEAN SHEETS",
        join_league: "JOIN LEAGUE",
    },
    fr: {
        system_online: "SYSTÈME EN LIGNE",
        commander_center: "CENTRE DE COMMANDEMENT",
        back: "RETOUR",
        reg_title: "INSCRIPTION JOUEUR",
        trainer_name: "NOM DE L'ENTRAÎNEUR",
        trainer_hint: "Ce nom apparaîtra dans le classement.",
        contact_private: "CONTACT (Privé)",
        contact_hint: "Visible uniquement par les administrateurs.",
        register_btn: "S'INSCRIRE À LA LIGUE",
        sending: "ENVOI...",
        sent_title: "INSCRIPTION ENVOYÉE",
        sent_desc: "Un administrateur examinera votre demande sous peu.",
        return_home: "RETOUR ACCUEIL",
        league_standings: "CLASSEMENT LIGUE",
        register_action: "S'INSCRIRE",
        awards_title: "RÉCOMPENSES",
        golden_boot: "SOULIER D'OR",
        golden_glove: "GANT D'OR",
        current_fav: "FAVORI ACTUEL",
        proj_winner: "Gagnant Projeté",
        goals: "BUTS",
        clean_sheets: "CLEAN SHEETS",
        join_league: "REJOINDRE LA LIGUE",
    }
};

// Merge with app.js translations in a real scenario, but for now we'll define the core structure.
// To avoid duplicating the huge list, I'll rely on app.js for Index and this file for others? 
// No, better to have one source. I will copy the full list from Step 771.

const fullTranslations = {
    es: {
        ...translations.es,
        welcome_title: "BIENVENIDO,<br>COMANDANTE",
        welcome_desc: "Centro de mando oficial de ElDonDelFC. Gestiona tus tácticas, recompensas y liga desde aquí.",
        mission_status: "ESTADO DE MISIÓN: ACTIVO",
        rewards_title: "RECOMPENSAS",
        rewards_find: "CÓDIGOS ACTIVOS",
        rewards_redeem: "CANJEAR",
        rewards_desc: "Códigos en vivo.",
        claim_now: "VER EN FORO",
        redeem_now: "EA SITE",
        world_cup_title: "MUNDIAL 2026",
        world_cup_desc: "Noticias camino a la Copa del Mundo.",
        champions_title: "CHAMPIONS",
        champions_desc: "Actualidad de la UEFA Champions League.",
        mailbox_title: "BUZÓN DE ESTRATEGIA",
        mailbox_desc: "Impacta el juego. Envía tus tácticas y sugerencias directamente a ElDon.",
        placeholder_username: "Usuario (Ej: TikTok)",
        option_content: "Contenido",
        option_tactics: "Tácticas",
        option_web: "Web",
        placeholder_idea: "Tu idea...",
        send_btn: "ENVIAR",
        league_title: "LIGA",
        league_desc: "Tablas y resultados en vivo.",
        coming_soon: "PRÓXIMAMENTE",
        status_active: "EN VIVO",
        academy_title: "ACADEMIA",
        academy_desc: "Reserva una sesión personalizada con ElDonDelFC.",
        wheel_title: "RUEDA DEL DESTINO",
        wheel_desc: "Participar en sorteos en vivo.",
        donate_title: "APOYAR AL CANAL",
        donate_desc: "Ayuda a mantener los premios de la liga.",
        roadmap_title: "ROADMAP 2026",
        roadmap_desc: "Evolucionando para ti. Más cambios en camino.",
        fact_title: "DATO DEL DÍA: MUNDIAL 2026",
        facts: [
            "El Mundial 2026 será el primero con 48 equipos.",
            "Se jugará en tres países: México, Estados Unidos y Canadá.",
            "El Estadio Azteca hará historia al ser sede de tres Mundiales diferentes.",
            "La final se jugará el 19 de julio de 2026.",
            "Será la Copa del Mundo con más partidos en la historia (104 encuentros)."
        ]
    },
    en: {
        ...translations.en,
        welcome_title: "WELCOME,<br>COMMANDER",
        welcome_desc: "Official ElDonDelFC Command Center. Manage your tactics, rewards, and league from here.",
        mission_status: "MISSION STATUS: ACTIVE",
        rewards_title: "REWARDS",
        rewards_find: "ACTIVE CODES",
        rewards_redeem: "REDEEM",
        rewards_desc: "Live codes.",
        claim_now: "VIEW ON FORUM",
        redeem_now: "EA SITE",
        world_cup_title: "WORLD CUP 2026",
        world_cup_desc: "News on the road to the World Cup.",
        champions_title: "CHAMPIONS",
        champions_desc: "UEFA Champions League updates.",
        mailbox_title: "STRATEGY MAILBOX",
        mailbox_desc: "Impact the game. Send your tactics and suggestions directly to ElDon.",
        placeholder_username: "Username (e.g., TikTok)",
        option_content: "Content",
        option_tactics: "Tactics",
        option_web: "Web",
        placeholder_idea: "Your idea...",
        send_btn: "SEND",
        league_title: "LEAGUE",
        league_desc: "Live tables and results.",
        coming_soon: "COMING SOON",
        status_active: "LIVE",
        academy_title: "ACADEMY",
        academy_desc: "Book a personalized session with ElDonDelFC.",
        wheel_title: "WHEEL OF DESTINY",
        wheel_desc: "Participate in live giveaways.",
        donate_title: "SUPPORT THE CHANNEL",
        donate_desc: "Help maintain league prizes.",
        roadmap_title: "ROADMAP 2026",
        roadmap_desc: "Evolving for you. More changes coming.",
        fact_title: "DAILY FACT: WORLD CUP 2026",
        facts: [
            "The 2026 World Cup will be the first with 48 teams.",
            "It will be hosted across three nations: Mexico, USA, and Canada.",
            "The Azteca Stadium will make history by hosting three different World Cups.",
            "The final will be played on July 19, 2026.",
            "It will feature the most matches in World Cup history (104 games)."
        ]
    },
    fr: {
        ...translations.fr,
        welcome_title: "BIENVENUE,<br>COMMANDANT",
        welcome_desc: "Centre de commandement officiel ElDonDelFC. Gérez vos tactiques, récompenses et ligue d'ici.",
        mission_status: "STATUT DE MISSION: ACTIF",
        rewards_title: "RÉCOMPENSES",
        rewards_find: "CODES ACTIFS",
        rewards_redeem: "ÉCHANGER",
        rewards_desc: "Codes en direct.",
        claim_now: "VOIR FORUM",
        redeem_now: "EA SITE",
        world_cup_title: "COUPE DU MONDE 2026",
        world_cup_desc: "Nouvelles sur la route de la Coupe du Monde.",
        champions_title: "CHAMPIONS",
        champions_desc: "Mises à jour de l'UEFA Champions League.",
        mailbox_title: "BOÎTE AUX LETTRES STRATÉGIQUE",
        mailbox_desc: "Impactez le jeu. Envoyez vos tactiques et suggestions directement à ElDon.",
        placeholder_username: "Nom d'utilisateur (ex: TikTok)",
        option_content: "Contenu",
        option_tactics: "Tactiques",
        option_web: "Web",
        placeholder_idea: "Votre idée...",
        send_btn: "ENVOYER",
        league_title: "LIGUE",
        league_desc: "Tableaux et résultats en direct.",
        coming_soon: "BIENTÔT DISPONIBLE",
        status_active: "EN DIRECT",
        academy_title: "ACADÉMIE",
        academy_desc: "Réservez une séance personnalisée avec ElDonDelFC.",
        wheel_title: "ROUE DU DESTIN",
        wheel_desc: "Participer aux tirages au sort en direct.",
        donate_title: "SOUTENIR LA CHAÎNE",
        donate_desc: "Aidez à maintenir les prix de la ligue.",
        roadmap_title: "FEUILLE DE ROUTE 2026",
        roadmap_desc: "Évolue pour vous. Plus de changements à venir.",
        fact_title: "FAIT DU JOUR: MONDIAL 2026",
        facts: [
            "La Coupe du Monde 2026 sera la première avec 48 équipes.",
            "Elle se jouera dans trois pays : Mexique, États-Unis et Canada.",
            "Le stade Azteca entrera dans l'histoire en accueillant trois Coupes du Monde différentes.",
            "La finale se jouera le 19 juillet 2026.",
            "Ce sera la Coupe du Monde avec le plus de matchs de l'histoire (104 rencontres)."
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Language Init
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        const savedLang = localStorage.getItem('lang') || 'es';
        langSelect.value = savedLang;
        updateLanguage(savedLang);

        langSelect.addEventListener('change', (e) => {
            const lang = e.target.value;
            localStorage.setItem('lang', lang);
            updateLanguage(lang);
        });
    } else {
        // If dropdown missing but data-i18n exists, still try to translate
        const savedLang = localStorage.getItem('lang') || 'es';
        updateLanguage(savedLang);
    }
});

function updateLanguage(lang) {
    const t = fullTranslations[lang];
    if (!t) return;

    // Normal Text
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.innerHTML = t[key];
        }
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) {
            el.placeholder = t[key];
        }
    });

    // Update World Cup Fact (if exists)
    updateDailyFact(lang);
}

function updateDailyFact(lang) {
    const factElement = document.getElementById('daily-fact-text');
    if (!factElement) return;

    const t = fullTranslations[lang];
    if (!t || !t.facts) return;

    const day = new Date().getDate();
    const factIndex = day % t.facts.length;

    factElement.textContent = t.facts[factIndex];
}
