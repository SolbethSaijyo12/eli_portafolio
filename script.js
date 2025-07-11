// Pantalla de carga
document.addEventListener("DOMContentLoaded", function() {
    // Ocultar pantalla de carga después de 3 segundos
    setTimeout(function() {
        const loadingScreen = document.getElementById("loading-screen");
        if (loadingScreen) {
            loadingScreen.classList.add("hidden");
        }
    }, 3000);

    // Inicializar animaciones
    initializeAnimations();
    
    // Inicializar footer animado
    initializeFooterAnimation();
    
    // Inicializar efectos de scroll
    initializeScrollEffects();
});

// Animaciones de entrada para elementos
function initializeAnimations() {
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

    // Observar tarjetas y elementos
    const animatedElements = document.querySelectorAll('.card, .card1, .card2, .card3, .card4, .experiencia, .video-experiencia');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Footer con animación de texto rotativo
function initializeFooterAnimation() {
    const footer = document.getElementById('pie');
    if (!footer) return;

    // Crear contenido animado para el footer
    const animatedContent = document.createElement('div');
    animatedContent.className = 'footer-animated-content';
    animatedContent.innerHTML = `
        <div class="capabilities-showcase">
            <h3 class="capabilities-title">Conoce mis capacidades que podrían brindarte un gran apoyo en tu empresa</h3>
            <div class="rotating-skills">
                <span class="skill active">Desarrollo Web Frontend</span>
                <span class="skill">Bases de Datos SQL</span>
                <span class="skill">Programación en Java</span>
                <span class="skill">Desarrollo con Python</span>
                <span class="skill">Diseño UI/UX</span>
                <span class="skill">Gestión de Proyectos</span>
            </div>
        </div>
        <div class="footer-navigation">
            <h4>Navegación</h4>
            <ul class="footer-nav-links">
                <li><a href="index.html">Inicio</a></li>
                <li><a href="sobremi.html">Sobre Mí</a></li>
                <li><a href="EXPERIENCIA.html">Experiencia</a></li>
                <li><a href="habilidades.html">Habilidades</a></li>
                <li><a href="CERTIFICADOS.html">Certificados</a></li>
                <li><a href="referencias.html">Referencias</a></li>
                <li><a href="evidencia.html">Evidencias</a></li>
                <li><a href="CONTACTOS.html">Contacto</a></li>
            </ul>
        </div>
    `;

    // Insertar antes del contenido existente del footer
    footer.insertBefore(animatedContent, footer.firstChild);

    // Agregar estilos CSS dinámicamente
    const style = document.createElement('style');
    style.textContent = `
        .footer-animated-content {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 3rem;
            margin-bottom: 3rem;
            align-items: start;
        }

        .capabilities-showcase {
            text-align: center;
        }

        .capabilities-title {
            font-family: 'Righteous', cursive;
            font-size: 1.8rem;
            margin-bottom: 2rem;
            color: white;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .rotating-skills {
            position: relative;
            height: 60px;
            overflow: hidden;
        }

        .skill {
            position: absolute;
            width: 100%;
            font-size: 1.3rem;
            font-weight: 600;
            color: rgba(255,255,255,0.9);
            opacity: 0;
            transform: translateY(60px);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }

        .skill.active {
            opacity: 1;
            transform: translateY(0);
        }

        .skill.exit {
            opacity: 0;
            transform: translateY(-60px);
        }

        .footer-navigation h4 {
            font-family: 'Righteous', cursive;
            font-size: 1.3rem;
            margin-bottom: 1rem;
            color: white;
        }

        .footer-nav-links {
            list-style: none;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
        }

        .footer-nav-links li {
            margin-bottom: 0.5rem;
        }

        .footer-nav-links a {
            color: rgba(255,255,255,0.8);
            text-decoration: none;
            transition: all 0.3s ease;
            padding: 0.3rem 0;
            display: block;
            border-radius: 4px;
            font-weight: 500;
        }

        .footer-nav-links a:hover {
            color: white;
            background: rgba(255,255,255,0.1);
            padding-left: 0.5rem;
            transform: translateX(5px);
        }

        @media (max-width: 768px) {
            .footer-animated-content {
                grid-template-columns: 1fr;
                text-align: center;
            }
            
            .capabilities-title {
                font-size: 1.4rem;
            }
            
            .skill {
                font-size: 1.1rem;
            }
            
            .footer-nav-links {
                grid-template-columns: 1fr;
                max-width: 200px;
                margin: 0 auto;
            }
        }
    `;
    document.head.appendChild(style);

    // Iniciar animación de habilidades rotativas
    startSkillRotation();
}

// Rotación de habilidades en el footer
function startSkillRotation() {
    const skills = document.querySelectorAll('.skill');
    if (skills.length === 0) return;

    let currentIndex = 0;

    function rotateSkills() {
        // Remover clase active de la habilidad actual
        skills[currentIndex].classList.remove('active');
        skills[currentIndex].classList.add('exit');

        // Después de la animación de salida, mostrar la siguiente
        setTimeout(() => {
            skills[currentIndex].classList.remove('exit');
            currentIndex = (currentIndex + 1) % skills.length;
            skills[currentIndex].classList.add('active');
        }, 400);
    }

    // Iniciar rotación cada 3 segundos
    setInterval(rotateSkills, 3000);
}

// Efectos de scroll suaves
function initializeScrollEffects() {
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Efecto parallax sutil en el header
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('header');
        if (header) {
            header.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });
}

// Animación de botones con efecto ripple
document.addEventListener('click', function(e) {
    if (e.target.matches('button, .cv, .evi, .Autobiografia, .Habilidades, .referencias, input[type="submit"]')) {
        createRippleEffect(e);
    }
});

function createRippleEffect(e) {
    const button = e.target;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    // Agregar keyframes si no existen
    if (!document.querySelector('#ripple-keyframes')) {
        const style = document.createElement('style');
        style.id = 'ripple-keyframes';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Validación mejorada del formulario
function setupFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearErrors);
    });

    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        // Remover errores previos
        clearFieldError(field);
        
        // Validaciones específicas
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, 'Este campo es obligatorio');
            return false;
        }
        
        if (field.type === 'email' && value && !isValidEmail(value)) {
            showFieldError(field, 'Por favor ingresa un email válido');
            return false;
        }
        
        return true;
    }
    
    function clearErrors(e) {
        clearFieldError(e.target);
    }
    
    function showFieldError(field, message) {
        field.style.borderColor = '#e74c3c';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: 0.8rem;
            margin-top: 0.25rem;
            margin-bottom: 0.5rem;
        `;
        
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
    }
    
    function clearFieldError(field) {
        field.style.borderColor = '';
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

// Inicializar validación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', setupFormValidation);

// Efecto de escritura para títulos
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Aplicar efecto de escritura a títulos principales
document.addEventListener('DOMContentLoaded', function() {
    const mainTitle = document.querySelector('h1');
    if (mainTitle && mainTitle.textContent.includes('Castro Jiménez')) {
        const originalText = mainTitle.textContent;
        setTimeout(() => {
            typeWriter(mainTitle, originalText, 80);
        }, 3500); // Después de que se oculte la pantalla de carga
    }
});

// Contador animado para estadísticas (si se necesita en el futuro)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Lazy loading para imágenes
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Inicializar todas las funcionalidades
document.addEventListener('DOMContentLoaded', function() {
    setupLazyLoading();
});