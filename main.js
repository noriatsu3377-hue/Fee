document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust for fixed header height
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Accordion exclusive open (optional UX enhancement)
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach(acc => {
        acc.addEventListener('toggle', (e) => {
            if (acc.open) {
                accordions.forEach(otherAcc => {
                    if (otherAcc !== acc && otherAcc.open) {
                        otherAcc.open = false;
                    }
                });
            }
        });
    });
});
