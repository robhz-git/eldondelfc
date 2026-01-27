// Matter.js module aliases
const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Events = Matter.Events,
    Body = Matter.Body;

let engine, render, runner;
let isPhysicsEnabled = false;
let originalPositions = [];

// Translations Dictionary
const translations = {
    es: {
        system_online: "SISTEMA EN LÍNEA",
        commander_center: "CENTRO DE COMANDO",
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
        system_online: "SYSTEM ONLINE",
        commander_center: "COMMAND CENTER",
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
        system_online: "SYSTÈME EN LIGNE",
        commander_center: "CENTRE DE COMMANDEMENT",
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
    // Physics Init
    const toggleBtn = document.getElementById('physics-toggle');
    toggleBtn.addEventListener('click', togglePhysics);

    // Theme Init
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    // Language Init
    const langSelect = document.getElementById('lang-select');
    const savedLang = localStorage.getItem('lang') || 'es';
    langSelect.value = savedLang;
    updateLanguage(savedLang);

    langSelect.addEventListener('change', (e) => {
        const lang = e.target.value;
        localStorage.setItem('lang', lang);
        updateLanguage(lang);
    });

    // Store original positions for reset
    const cards = document.querySelectorAll('.bento-card');
    cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        originalPositions.push({
            element: card,
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height
        });
    });


});



function updateLanguage(lang) {
    const t = translations[lang];
    if (!t) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.innerHTML = t[key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) {
            el.placeholder = t[key];
        }
    });

    // Update World Cup Fact
    updateDailyFact(lang);
}

function updateDailyFact(lang) {
    const factElement = document.getElementById('daily-fact-text');
    if (!factElement) return;

    const t = translations[lang];
    if (!t || !t.facts) return;

    // Use the day of the month to select a fact
    const day = new Date().getDate();
    const factIndex = day % t.facts.length;

    factElement.textContent = t.facts[factIndex];
}

function togglePhysics() {
    const grid = document.querySelector('.bento-grid');
    const body = document.body;

    if (!isPhysicsEnabled) {
        // Enable Physics
        isPhysicsEnabled = true;
        body.classList.add('physics-active');

        // Initialize Matter.js
        engine = Engine.create();
        engine.world.gravity.y = 1; // Normal gravity

        // Create boundaries
        const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 100, { isStatic: true });
        const leftWall = Bodies.rectangle(-50, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true });
        const rightWall = Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true });

        Composite.add(engine.world, [ground, leftWall, rightWall]);

        // Convert DOM cards to Physics bodies
        const cards = document.querySelectorAll('.bento-card');
        cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();

            // Create body at current position
            const body = Bodies.rectangle(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                rect.width,
                rect.height,
                {
                    restitution: 0.8, // Bouncy
                    friction: 0.1,
                    frictionAir: 0.02,
                    angle: (Math.random() - 0.5) * 0.2 // Slight random rotation
                }
            );

            // Attach body to DOM element
            card.id = `card-${index}`;
            body.label = `card-${index}`;

            Composite.add(engine.world, body);

            // Set DOM to absolute to follow physics
            card.style.position = 'fixed';
            card.style.width = `${rect.width}px`;
            card.style.height = `${rect.height}px`;
            card.style.left = '0';
            card.style.top = '0';
            card.style.margin = '0';
            card.style.zIndex = '100';
            // Initial sync
            card.style.transform = `translate(${body.position.x - rect.width / 2}px, ${body.position.y - rect.height / 2}px) rotate(${body.angle}rad)`;
        });

        // Add Mouse Interaction
        const mouse = Mouse.create(document.body);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });
        Composite.add(engine.world, mouseConstraint);

        // Sync loop
        runner = Runner.create();
        Runner.run(runner, engine);

        Events.on(engine, 'afterUpdate', () => {
            const bodies = Composite.allBodies(engine.world);
            bodies.forEach(body => {
                if (body.label.startsWith('card-')) {
                    const card = document.getElementById(body.label);
                    if (card) {
                        const width = parseFloat(card.style.width);
                        const height = parseFloat(card.style.height);
                        card.style.transform = `translate(${body.position.x - width / 2}px, ${body.position.y - height / 2}px) rotate(${body.angle}rad)`;
                    }
                }
            });
        });

    } else {
        // Disable Physics (Reset)
        isPhysicsEnabled = false;
        body.classList.remove('physics-active');

        // Stop engine
        Runner.stop(runner);
        Engine.clear(engine);
        engine = null;

        // Reset DOM
        const cards = document.querySelectorAll('.bento-card');
        cards.forEach((card, index) => {
            card.style.position = '';
            card.style.width = '';
            card.style.height = '';
            card.style.left = '';
            card.style.top = '';
            card.style.margin = '';
            card.style.zIndex = '';
            card.style.transform = '';
        });
    }
}
