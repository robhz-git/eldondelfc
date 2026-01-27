// Tour Guide using Driver.js
document.addEventListener('DOMContentLoaded', () => {
    // Check if user has seen the tour
    const tourSeen = localStorage.getItem('tour_v1_completed');

    // Add "Start Tour" button logic if it exists (for manual replay)
    const helpBtn = document.getElementById('help-btn');
    if (helpBtn) {
        helpBtn.addEventListener('click', startTour);
    }

    // Auto-start if first time
    if (!tourSeen) {
        // small delay to ensure rendering
        setTimeout(startTour, 1000);
    }
});

function startTour() {
    const driver = window.driver.js.driver;

    const tourDriver = driver({
        showProgress: true,
        allowClose: true,
        animate: true,
        steps: [
            {
                element: '.card-hero',
                popover: {
                    title: '¡Bienvenido, Comandante!',
                    description: 'Este es tu centro de mando. Aquí verás el estado de la misión y datos curiosos diarios del Mundial 2026.',
                    side: "bottom",
                    align: 'start'
                }
            },
            {
                element: '.card-neon-red',
                popover: {
                    title: 'Códigos Activos',
                    description: '¿Buscas códigos nuevos? Haz clic aquí para ir al foro y encontrar los últimos códigos descubiertos.',
                    side: "right",
                    align: 'start'
                }
            },
            {
                element: '.card-neon-green',
                popover: {
                    title: 'Canjear Recompensas',
                    description: 'Enlace directo al sitio de EA para canjear tus códigos rápidamente.',
                    side: "left",
                    align: 'start'
                }
            },
            {
                element: 'a[href="sorteo.html"]',
                popover: {
                    title: 'Sorteo Digital',
                    description: '¡NUEVO! Participa en sorteos en vivo. Si estás en TikTok, escribe el comando para aparecer aquí.',
                    side: "top",
                    align: 'center'
                }
            },
            {
                element: '.card-accent',
                popover: {
                    title: 'Buzón de Estrategia',
                    description: 'Tu voz importa. Envía tus propias tácticas o sugerencias de contenido directamente a El Don.',
                    side: "top",
                    align: 'start'
                }
            },
            {
                element: '.social-sidebar',
                popover: {
                    title: 'Redes Sociales',
                    description: 'Síguenos en todas las plataformas para no perderte nada.',
                    side: "right",
                    align: 'center'
                }
            }
        ],
        doneBtnText: 'Listo', // Text for the final button
        nextBtnText: 'Siguiente', // Text for the next button
        prevBtnText: 'Atrás', // Text for the previous button
        onDestroyStarted: () => {
            // Just save the preference. 
            // Returning true/false or nothing allows the destruction to proceed naturally.
            // Do NOT call driver.destroy() here as it causes recursion/freeze.
            localStorage.setItem('tour_v1_completed', 'true');

            // If the library requires a return value to allow destruction:
            return true;
        },
        onPopoverRender: (popover, { config, state }) => {
            // Optional: You can inject custom classes here if the library supports it directly,
            // or we depend on global CSS overrides.
        }
    });

    tourDriver.drive();
}
