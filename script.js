// Pantalla de carga
document.addEventListener("DOMContentLoaded", function() {
    // Ocultar pantalla de carga después de 3 segundos
    setTimeout(function() {
        const loadingScreen = document.getElementById("loading-screen");
        if (loadingScreen) {
            loadingScreen.classList.add("hidden");
        }
    }, 3000);

    // Inicializar todas las funcionalidades
    initializeAnimations();
    initializeFooterAnimation();
    initializeScrollEffects();
    initializeResponsiveFeatures();
    setupFormValidation();
    setupLazyLoading();
    initializeAccessibility();
});

// Funciones responsivas
function initializeResponsiveFeatures() {
    // Manejo de navegación en móviles
    handleMobileNavigation();
    
    // Ajuste de imágenes responsivas
    handleResponsiveImages();
    
    // Manejo de orientación
    handleOrientationChange();
    
    // Optimización de rendimiento
    optimizePerformance();
}

// Navegación móvil mejorada
function handleMobileNavigation() {
    const nav = document.querySelector('nav');
    const navButtons = document.querySelectorAll('nav button');
    
    // Crear botón de menú hamburguesa para móviles muy pequeños
    if (window.innerWidth <= 480) {
        createMobileMenu(nav, navButtons);
    }
    
    // Manejar redimensionamiento de ventana
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth <= 480) {
            if (!document.querySelector('.mobile-menu-toggle')) {
                createMobileMenu(nav, navButtons);
            }
        } else {
            removeMobileMenu();
        }
    }, 250));
}

function createMobileMenu(nav, navButtons) {
    // Evitar crear múltiples menús
    if (document.querySelector('.mobile-menu-toggle')) return;
    
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-menu-toggle';
    mobileToggle.innerHTML = '<span></span><span></span><span></span>';
    mobileToggle.setAttribute('aria-label', 'Abrir menú de navegación');
    
    const navUl = nav.querySelector('ul');
    navUl.classList.add('mobile-nav-hidden');
    
    nav.insertBefore(mobileToggle, navUl);
    
    // Agregar estilos dinámicamente
    addMobileMenuStyles();
    
    mobileToggle.addEventListener('click', () => {
        const isOpen = navUl.classList.contains('mobile-nav-open');
        
        if (isOpen) {
            navUl.classList.remove('mobile-nav-open');
            navUl.classList.add('mobile-nav-hidden');
            mobileToggle.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
        } else {
            navUl.classList.remove('mobile-nav-hidden');
            navUl.classList.add('mobile-nav-open');
            mobileToggle.classList.add('active');
            mobileToggle.setAttribute('aria-expanded', 'true');
        }
    });
    
    // Cerrar menú al hacer clic en un enlace
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            navUl.classList.remove('mobile-nav-open');
            navUl.classList.add('mobile-nav-hidden');
            mobileToggle.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

function removeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navUl = document.querySelector('nav ul');
    
    if (mobileToggle) {
        mobileToggle.remove();
    }
    
    if (navUl) {
        navUl.classList.remove('mobile-nav-hidden', 'mobile-nav-open');
    }
}

function addMobileMenuStyles() {
    if (document.querySelector('#mobile-menu-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'mobile-menu-styles';
    style.textContent = `
        .mobile-menu-toggle {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            width: 30px;
            height: 30px;
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 0;
            z-index: 1001;
        }
        
        .mobile-menu-toggle span {
            width: 100%;
            height: 3px;
            background: var(--primary-color);
            border-radius: 2px;
            transition: all 0.3s ease;
            transform-origin: center;
        }
        
        .mobile-menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(7px, 7px);
        }
        
        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -7px);
        }
        
        .mobile-nav-hidden {
            display: none !important;
        }
        
        .mobile-nav-open {
            display: flex !important;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            flex-direction: column;
            padding: 1rem;
            box-shadow: var(--shadow);
            border-radius: 0 0 16px 16px;
            z-index: 1000;
        }
        
        .mobile-nav-open button {
            margin: 0.25rem 0;
            width: 100%;
        }
        
        @media (min-width: 481px) {
            .mobile-menu-toggle {
                display: none;
            }
            
            .mobile-nav-hidden,
            .mobile-nav-open {
                display: flex !important;
                position: static;
                background: none;
                flex-direction: row;
                padding: 0;
                box-shadow: none;
                border-radius: 0;
            }
            
            .mobile-nav-open button {
                margin: 0 0.25rem;
                width: auto;
            }
        }
    `;
    document.head.appendChild(style);
}

// Manejo de imágenes responsivas
function handleResponsiveImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Agregar loading lazy por defecto
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Manejar errores de carga
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Error loading image:', this.src);
        });
        
        // Optimizar imágenes grandes en móviles
        if (window.innerWidth <= 768) {
            img.addEventListener('load', function() {
                if (this.naturalWidth > window.innerWidth * 2) {
                    this.style.maxWidth = '100%';
                    this.style.height = 'auto';
                }
            });
        }
    });
}

// Manejo de cambio de orientación
function handleOrientationChange() {
    window.addEventListener('orientationchange', debounce(() => {
        // Recalcular dimensiones después del cambio de orientación
        setTimeout(() => {
            handleResponsiveImages();
            adjustLayoutForOrientation();
        }, 100);
    }, 250));
}

function adjustLayoutForOrientation() {
    const isLandscape = window.innerHeight < window.innerWidth;
    const isSmallScreen = window.innerHeight < 600;
    
    if (isLandscape && isSmallScreen) {
        document.body.classList.add('landscape-small');
    } else {
        document.body.classList.remove('landscape-small');
    }
}

// Optimización de rendimiento
function optimizePerformance() {
    // Lazy loading para elementos pesados
    const heavyElements = document.querySelectorAll('video, iframe');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                if (element.tagName === 'VIDEO') {
                    element.load();
                }
                
                observer.unobserve(element);
            }
        });
    }, { rootMargin: '50px' });
    
    heavyElements.forEach(element => observer.observe(element));
    
    // Optimizar animaciones en dispositivos de bajo rendimiento
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        document.body.classList.add('low-performance');
        addLowPerformanceStyles();
    }
}

function addLowPerformanceStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .low-performance * {
            animation-duration: 0.2s !important;
            transition-duration: 0.2s !important;
        }
        
        .low-performance .whatsapp-button {
            animation: none;
        }
        
        .low-performance .card:hover,
        .low-performance .card1:hover,
        .low-performance .card2:hover,
        .low-performance .card3:hover,
        .low-performance .card4:hover {
            transform: none;
        }
    `;
    document.head.appendChild(style);
}

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

    // Observar tarjetas y elementos con un pequeño retraso para mejor rendimiento
    setTimeout(() => {
        const animatedElements = document.querySelectorAll('.card, .card1, .card2, .card3, .card4, .experiencia, .video-experiencia');
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(el);
        });
    }, 100);
}

// Footer con animación mejorada y responsiva
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
                <span class="skill">Resolución de Problemas</span>
                <span class="skill">Trabajo en Equipo</span>
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

    // Agregar estilos CSS dinámicamente con mejoras responsivas
    const style = document.createElement('style');
    style.textContent = `
        .footer-animated-content {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: var(--spacing-lg);
            margin-bottom: var(--spacing-lg);
            align-items: start;
        }

        .capabilities-showcase {
            text-align: center;
        }

        .capabilities-title {
            font-family: 'Righteous', cursive;
            font-size: clamp(1.2rem, 4vw, 1.8rem);
            margin-bottom: var(--spacing-md);
            color: white;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            line-height: 1.3;
        }

        .rotating-skills {
            position: relative;
            height: clamp(50px, 10vw, 60px);
            overflow: hidden;
        }

        .skill {
            position: absolute;
            width: 100%;
            font-size: clamp(1rem, 3vw, 1.3rem);
            font-weight: 600;
            color: rgba(255,255,255,0.9);
            opacity: 0;
            transform: translateY(60px);
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
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
            font-size: clamp(1rem, 3vw, 1.3rem);
            margin-bottom: var(--spacing-sm);
            color: white;
        }

        .footer-nav-links {
            list-style: none;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: var(--spacing-xs);
        }

        .footer-nav-links li {
            margin-bottom: var(--spacing-xs);
        }

        .footer-nav-links a {
            color: rgba(255,255,255,0.8);
            text-decoration: none;
            transition: all 0.3s ease;
            padding: var(--spacing-xs);
            display: block;
            border-radius: 4px;
            font-weight: 500;
            font-size: var(--font-sm);
            text-align: center;
        }

        .footer-nav-links a:hover {
            color: white;
            background: rgba(255,255,255,0.1);
            transform: translateY(-2px);
        }

        @media (max-width: 768px) {
            .footer-animated-content {
                grid-template-columns: 1fr;
                text-align: center;
                gap: var(--spacing-md);
            }
            
            .capabilities-title {
                font-size: clamp(1rem, 5vw, 1.4rem);
            }
            
            .skill {
                font-size: clamp(0.9rem, 4vw, 1.1rem);
            }
            
            .footer-nav-links {
                grid-template-columns: repeat(2, 1fr);
                max-width: 300px;
                margin: 0 auto;
            }
        }

        @media (max-width: 480px) {
            .footer-nav-links {
                grid-template-columns: 1fr;
                max-width: 200px;
            }
            
            .rotating-skills {
                height: 40px;
            }
            
            .capabilities-title {
                margin-bottom: var(--spacing-sm);
            }
        }

        @media (orientation: landscape) and (max-height: 600px) {
            .footer-animated-content {
                grid-template-columns: 1fr;
                gap: var(--spacing-sm);
            }
            
            .rotating-skills {
                height: 40px;
            }
            
            .footer-nav-links {
                grid-template-columns: repeat(4, 1fr);
            }
        }
    `;
    document.head.appendChild(style);

    // Iniciar animación de habilidades rotativas
    startSkillRotation();
}

// Rotación de habilidades en el footer mejorada
function startSkillRotation() {
    const skills = document.querySelectorAll('.skill');
    if (skills.length === 0) return;

    let currentIndex = 0;
    let rotationInterval;

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

    // Iniciar rotación
    function startRotation() {
        rotationInterval = setInterval(rotateSkills, 3000);
    }

    // Pausar rotación cuando no está visible (optimización de rendimiento)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startRotation();
            } else {
                clearInterval(rotationInterval);
            }
        });
    });

    const footer = document.getElementById('pie');
    if (footer) {
        observer.observe(footer);
    }

    // Pausar en hover para mejor UX
    const skillsContainer = document.querySelector('.rotating-skills');
    if (skillsContainer) {
        skillsContainer.addEventListener('mouseenter', () => {
            clearInterval(rotationInterval);
        });

        skillsContainer.addEventListener('mouseleave', () => {
            startRotation();
        });
    }
}

// Efectos de scroll mejorados y responsivos
function initializeScrollEffects() {
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Efecto parallax sutil solo en dispositivos de escritorio
    if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const header = document.querySelector('header');
            
            if (header) {
                header.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
            
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }

    // Mostrar/ocultar botón de scroll to top
    createScrollToTopButton();
}

function createScrollToTopButton() {
    const scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top';
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.setAttribute('aria-label', 'Volver arriba');
    scrollButton.style.cssText = `
        position: fixed;
        bottom: calc(var(--spacing-md) + 70px);
        right: var(--spacing-md);
        width: clamp(45px, 10vw, 50px);
        height: clamp(45px, 10vw, 50px);
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: clamp(1rem, 2.5vw, 1.2rem);
        box-shadow: var(--shadow);
    `;

    document.body.appendChild(scrollButton);

    // Mostrar/ocultar botón basado en scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        
        if (window.pageYOffset > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
        }
        
        // Ocultar después de un tiempo sin scroll
        scrollTimeout = setTimeout(() => {
            if (window.pageYOffset > 300) {
                scrollButton.style.opacity = '0.5';
            }
        }, 2000);
    });

    // Funcionalidad del botón
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Mostrar completamente en hover
    scrollButton.addEventListener('mouseenter', () => {
        scrollButton.style.opacity = '1';
    });
}

// Animación de botones con efecto ripple mejorado
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
        z-index: 1;
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

// Validación mejorada del formulario con mejor UX
function setupFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', debounce(clearErrors, 300));
    });

    // Validación en tiempo real para mejor UX
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField({ target: input })) {
                isValid = false;
            }
        });

        if (isValid) {
            submitForm(form);
        } else {
            // Scroll al primer error
            const firstError = form.querySelector('.field-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
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
        
        if (field.type === 'tel' && value && !isValidPhone(value)) {
            showFieldError(field, 'Por favor ingresa un teléfono válido');
            return false;
        }
        
        if (field.name === 'mensaje' && value && value.length < 10) {
            showFieldError(field, 'El mensaje debe tener al menos 10 caracteres');
            return false;
        }
        
        return true;
    }
    
    function clearErrors(e) {
        clearFieldError(e.target);
    }
    
    function showFieldError(field, message) {
        field.style.borderColor = '#e74c3c';
        field.setAttribute('aria-invalid', 'true');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: var(--font-xs);
            margin-top: 0.25rem;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        `;
        
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        field.parentNode.insertBefore(errorDiv, field.nextSibling);
    }
    
    function clearFieldError(field) {
        field.style.borderColor = '';
        field.removeAttribute('aria-invalid');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function isValidPhone(phone) {
        return /^[\+]?[0-9\s\-\(\)]{10,}$/.test(phone);
    }

    function submitForm(form) {
        const formData = new FormData(form);
        const submitButton = form.querySelector('input[type="submit"]');
        const resultado = document.getElementById("resultado");
        
        // Deshabilitar botón y mostrar estado de carga
        submitButton.disabled = true;
        submitButton.value = "Enviando...";
        
        fetch("procesar_formulario.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            resultado.className = "form-result success";
            resultado.textContent = data;
            resultado.style.display = "block";
            
            // Limpiar formulario si fue exitoso
            if (data.includes("Gracias")) {
                form.reset();
                // Mostrar mensaje de éxito con animación
                showSuccessMessage();
            }
        })
        .catch(error => {
            resultado.className = "form-result error";
            resultado.textContent = "Error en el envío. Por favor intenta nuevamente.";
            resultado.style.display = "block";
        })
        .finally(() => {
            // Rehabilitar botón
            submitButton.disabled = false;
            submitButton.value = "Enviar Mensaje";
            
            // Ocultar mensaje después de 5 segundos
            setTimeout(() => {
                resultado.style.display = "none";
            }, 5000);
        });
    }

    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-popup';
        successDiv.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>¡Mensaje enviado!</h3>
                <p>Gracias por contactarme. Te responderé pronto.</p>
            </div>
        `;
        
        successDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .success-content {
                background: white;
                padding: 2rem;
                border-radius: 16px;
                text-align: center;
                max-width: 90vw;
                width: 400px;
                box-shadow: var(--shadow-hover);
            }
            
            .success-content i {
                font-size: 3rem;
                color: #4CAF50;
                margin-bottom: 1rem;
            }
            
            .success-content h3 {
                color: var(--primary-color);
                margin-bottom: 0.5rem;
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
            style.remove();
        }, 3000);
    }
}

// Lazy loading mejorado
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    images.forEach(img => {
        img.classList.add('lazy');
        imageObserver.observe(img);
    });

    // Agregar estilos para lazy loading
    const style = document.createElement('style');
    style.textContent = `
        .lazy {
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
}

// Funciones de accesibilidad
function initializeAccessibility() {
    // Agregar skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Saltar al contenido principal';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Mejorar navegación por teclado
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach(element => {
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && this.tagName === 'BUTTON') {
                this.click();
            }
        });
    });

    // Anunciar cambios dinámicos para lectores de pantalla
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);

    window.announceToScreenReader = function(message) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    };
}

// Utilidades
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Efecto de escritura para títulos (optimizado)
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
            if (window.innerWidth > 768) { // Solo en desktop para mejor rendimiento
                typeWriter(mainTitle, originalText, 80);
            }
        }, 3500);
    }
});

// Manejo de errores global
window.addEventListener('error', function(e) {
    console.error('Error en el portafolio:', e.error);
    // Aquí podrías enviar errores a un servicio de monitoreo
});

// Optimización para dispositivos táctiles
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // Mejorar experiencia táctil
    const style = document.createElement('style');
    style.textContent = `
        .touch-device button,
        .touch-device .cv,
        .touch-device .evi,
        .touch-device .Autobiografia,
        .touch-device .Habilidades,
        .touch-device .referencias {
            min-height: 44px;
            min-width: 44px;
        }
        
        .touch-device .social-icons a {
            min-height: 44px;
            min-width: 44px;
        }
    `;
    document.head.appendChild(style);
}

// Detección de conexión lenta
if ('connection' in navigator) {
    const connection = navigator.connection;
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        document.body.classList.add('slow-connection');
        
        // Reducir animaciones en conexiones lentas
        const style = document.createElement('style');
        style.textContent = `
            .slow-connection * {
                animation-duration: 0.1s !important;
                transition-duration: 0.1s !important;
            }
        `;
        document.head.appendChild(style);
    }
}