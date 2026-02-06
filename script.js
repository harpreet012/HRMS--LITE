// Resume JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the resume
    initializeResume();
});

function initializeResume() {
    // Add event listeners
    const printBtn = document.getElementById('print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', printResume);
    }

    // Add smooth scrolling for anchor links (if any)
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

    // Add animation to project sections on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all project elements
    const projects = document.querySelectorAll('.project');
    projects.forEach(project => {
        project.style.opacity = '0';
        project.style.transform = 'translateY(20px)';
        project.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(project);
    });

    // Add hover effects for skill items
    const skillItems = document.querySelectorAll('.skill-category li');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#007acc';
            this.style.color = 'white';
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'all 0.3s ease';
        });

        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#f0f8ff';
            this.style.color = '#333';
            this.style.transform = 'scale(1)';
        });
    });

    // Add click effects for project titles
    const projectTitles = document.querySelectorAll('.project h3');
    projectTitles.forEach(title => {
        title.addEventListener('click', function() {
            const project = this.parentElement;
            const details = project.querySelector('ul');
            if (details.style.display === 'none' || details.style.display === '') {
                details.style.display = 'block';
                this.style.color = '#005999';
            } else {
                details.style.display = 'none';
                this.style.color = '#007acc';
            }
        });
        title.style.cursor = 'pointer';
    });
}

function printResume() {
    // Hide the print button before printing
    const printBtn = document.getElementById('print-btn');
    if (printBtn) {
        printBtn.style.display = 'none';
    }

    // Trigger print dialog
    window.print();

    // Show the print button again after printing
    setTimeout(() => {
        if (printBtn) {
            printBtn.style.display = 'block';
        }
    }, 100);
}

function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
        const offsetTop = targetElement.offsetTop - 20; // 20px offset from top
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl + P to print (in addition to the button)
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        printResume();
    }

    // Escape key to scroll to top
    if (e.key === 'Escape') {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});

// Add dynamic year update for copyright (if added later)
function updateCopyrightYear() {
    const currentYear = new Date().getFullYear();
    const copyrightElements = document.querySelectorAll('.copyright-year');
    copyrightElements.forEach(element => {
        element.textContent = currentYear;
    });
}

// Call updateCopyrightYear on load
updateCopyrightYear();

// Add loading animation for projects
function addLoadingAnimation() {
    const projects = document.querySelectorAll('.project');
    let delay = 0;

    projects.forEach(project => {
        project.style.animationDelay = `${delay}s`;
        project.style.animation = 'fadeInUp 0.8s ease forwards';
        delay += 0.2;
    });
}

// Add CSS animation keyframes dynamically
function addCSSAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .project {
            animation-fill-mode: both;
        }
    `;
    document.head.appendChild(style);
}

// Initialize animations
addCSSAnimations();
addLoadingAnimation();

// Add responsive design adjustments
function handleResize() {
    const width = window.innerWidth;
    const container = document.querySelector('.container');

    if (width < 768) {
        container.style.padding = '15px';
    } else {
        container.style.padding = '40px';
    }
}

window.addEventListener('resize', handleResize);
handleResize(); // Initial call

// Add touch support for mobile devices
if ('ontouchstart' in window) {
    const projects = document.querySelectorAll('.project');
    projects.forEach(project => {
        project.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });

        project.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Export functions for potential external use
window.resumeUtils = {
    printResume: printResume,
    smoothScroll: smoothScroll,
    updateCopyrightYear: updateCopyrightYear
};
