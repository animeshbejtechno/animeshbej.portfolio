/* ========================================
   PORTFOLIO - MAIN.JS
   Interactivity & Animations
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- Navbar Scroll Effect + Scroll Indicator Hide ---
    const navbar = document.getElementById('navbar');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        // Hide scroll indicator once user scrolls
        if (scrollIndicator) {
            if (window.scrollY > 80) {
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
        }
    });

    // --- Load Profile Picture from localStorage ---
    const savedProfilePic = localStorage.getItem('portfolio_profilePic');
    if (savedProfilePic) {
        document.querySelectorAll('img[alt="Animesh Bej"]').forEach(img => {
            img.src = savedProfilePic;
            img.onerror = null; // Remove fallback since we have a saved pic
        });
    }

    // --- Mobile Menu ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    // --- Typing Effect ---
    const typedText = document.getElementById('typed-text');
    if (typedText) {
        const phrases = [
            'Cybersecurity Associate 🔒',
            'Junior Penetration Tester 🎯',
            'SOC Analyst (Aspiring) 🛡️',
            'VAPT Specialist 🔍',
            'MCA Student @ Techno India 🎓'
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 80;

        function typeEffect() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typedText.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 40;
            } else {
                typedText.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 80;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause before deleting
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500; // Pause before next phrase
            }

            setTimeout(typeEffect, typingSpeed);
        }

        typeEffect();
    }

    // --- Scroll Animations (AOS-like) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, parseInt(delay));
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });

    // --- Skill Bar Animation ---
    const skillBars = document.querySelectorAll('.skill-progress');
    if (skillBars.length > 0) {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = entry.target.getAttribute('data-progress');
                    entry.target.style.width = progress + '%';
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => skillObserver.observe(bar));
    }

    // --- Floating Particles Background ---
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        createParticles();
    }

    function createParticles() {
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: rgba(108, 92, 231, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${Math.random() * 20 + 10}s linear infinite;
                animation-delay: ${Math.random() * 10}s;
            `;
            particlesContainer.appendChild(particle);
        }

        // Add keyframes for particle animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFloat {
                0% {
                    transform: translate(0, 0) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translate(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 200}px, -${Math.random() * 500 + 300}px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // --- Contact Form Handler ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Create mailto link
            const mailtoLink = `mailto:animeshbej399@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`)}`;
            window.location.href = mailtoLink;

            // Show success feedback
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Opening Mail Client...';
            btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                contactForm.reset();
            }, 3000);
        });
    }

    // --- Smooth page load ---
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });

    // --- Active nav link highlight ---
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else if (currentPage === '' && href === 'index.html') {
            link.classList.add('active');
        }
    });

    // --- Load Admin-Added Dynamic Content ---
    function getAdminData(key) {
        try { return JSON.parse(localStorage.getItem('portfolio_' + key)) || []; }
        catch { return []; }
    }

    // Dynamic Skills
    if (currentPage === 'skills.html') {
        const adminSkills = getAdminData('skills');
        const categoryMap = {
            programming: 0,
            pentesting: 1,
            networking: 2,
            frameworks: 3
        };
        adminSkills.forEach(skill => {
            const catIndex = categoryMap[skill.category];
            const categories = document.querySelectorAll('.skill-category .skill-items');
            if (categories[catIndex]) {
                const el = document.createElement('div');
                el.className = 'skill-item';
                el.innerHTML = `
                    <div class="skill-info">
                        <span>${skill.name}</span>
                        <span>${skill.progress}%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-progress" data-progress="${skill.progress}"></div>
                    </div>`;
                categories[catIndex].appendChild(el);
                // Animate the new bar
                const bar = el.querySelector('.skill-progress');
                setTimeout(() => { bar.style.width = skill.progress + '%'; }, 300);
            }
        });
    }

    // Dynamic Certificates
    if (currentPage === 'certificates.html') {
        const adminCerts = getAdminData('certificates');
        const certsGrid = document.querySelector('.certificates-grid');
        if (certsGrid && adminCerts.length > 0) {
            adminCerts.forEach((cert, i) => {
                const el = document.createElement('div');
                el.className = 'certificate-card';
                el.setAttribute('data-aos', 'fade-up');
                el.setAttribute('data-aos-delay', (600 + i * 100).toString());
                const icon = cert.status === 'ongoing' ? 'fa-spinner' : 'fa-check-circle';
                const label = cert.status === 'ongoing' ? 'Ongoing' : 'Completed';
                el.innerHTML = `
                    <div class="cert-icon"><i class="fas fa-certificate"></i></div>
                    <div class="cert-info">
                        <h3>${cert.title}</h3>
                        <p class="cert-issuer"><i class="fas fa-building"></i> ${cert.issuer}</p>
                        <p class="cert-date"><i class="fas fa-calendar"></i> ${cert.date}</p>
                        <span class="cert-link"><i class="fas ${icon}"></i> ${label}</span>
                    </div>`;
                certsGrid.appendChild(el);
            });
        }
    }

    // Dynamic Projects
    if (currentPage === 'projects.html') {
        const adminProjects = getAdminData('projects');
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid && adminProjects.length > 0) {
            adminProjects.forEach((proj, i) => {
                const title = (proj && proj.title ? String(proj.title) : 'Untitled Project').trim();
                const desc = (proj && proj.desc ? String(proj.desc) : 'No description provided.').trim();
                const techRaw = proj && (proj.tech || proj.techStack || proj.tags) ? String(proj.tech || proj.techStack || proj.tags) : '';
                const tags = techRaw
                    ? techRaw.split(',').map(t => t.trim()).filter(Boolean).map(t => `<span class="tag">${t}</span>`).join('')
                    : '<span class="tag">Project</span>';
                const safeLink = proj && proj.link ? String(proj.link).trim() : '';

                const el = document.createElement('div');
                el.className = 'project-card';
                el.setAttribute('data-aos', 'fade-up');
                el.setAttribute('data-aos-delay', (500 + i * 100).toString());
                el.innerHTML = `
                    <div class="project-image">
                        <div class="project-placeholder">
                            <i class="fas fa-terminal"></i>
                        </div>
                        <div class="project-overlay">
                            <div class="project-links">
                                ${safeLink ? '<a href="' + safeLink + '" target="_blank" rel="noopener noreferrer" class="project-link"><i class="fab fa-github"></i></a>' : ''}
                            </div>
                        </div>
                    </div>
                    <div class="project-info">
                        <h3>${title}</h3>
                        <p>${desc}</p>
                        <div class="project-tags">${tags}</div>
                    </div>
                `;
                projectsGrid.appendChild(el);
            });
        }
    }
});
