const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
const themeIcon = document.querySelector('.theme-icon');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
const mobileNav = document.getElementById('mobile-nav');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const demoForm = document.getElementById('demoForm');
const recipientEmail = document.getElementById('recipientEmail');
const templateSelect = document.getElementById('templateSelect');
const liveCode = document.getElementById('liveCode');
const demoResult = document.getElementById('demoResult');
const submitButton = demoForm.querySelector('button[type="submit"]');



function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }
}

function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '🌞' : '🌓';
}

function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}



function toggleMobileMenu() {
    mobileNav.classList.toggle('hidden');
    document.body.classList.toggle('overflow-hidden');
}



function updateLiveCode() {
    const email = recipientEmail.value || 'user@domain.com';
    const template = templateSelect.value;
    
    const code = `// Initialize EasyMailer
const mailer = new EasyMailer(
  process.env.EMAIL,
  process.env.PASSWORD
);

// Prepare email data
const emailData = {
  to: '${email}',
  templateName: '${template}',
  templateData: {
    name: 'User',
    company: 'EasyMailer'
  }
};

// Send email
try {
  const result = await mailer.sendEmail(emailData);
  console.log('Email sent:', result);
} catch (error) {
  console.error('Error:', error);
}`;

    liveCode.textContent = code;
    hljs.highlightElement(liveCode);
}



async function handleFormSubmit(e) {
    e.preventDefault();
    


    if (!recipientEmail.value || !recipientEmail.checkValidity()) {
        showResult('error', '❌ Please enter a valid email address');
        return;
    }



    setLoadingState(true);
    showResult('loading', 'Sending email...');
    
    try {
        const response = await fetch('http://localhost:45701/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: recipientEmail.value,
                template: templateSelect.value,
                templateData: {
                    name: 'User'
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to send email');
        }

        showResult('success', '✅ Email sent successfully!');
    } catch (error) {
        showResult('error', '❌ ' + error.message);
    } finally {
        setLoadingState(false);
    }
}



function showResult(type, message) {
    demoResult.className = type;
    demoResult.textContent = message;
    demoResult.classList.remove('hidden');
}

function setLoadingState(isLoading) {
    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading ? '🔄 Sending...' : '🚀 Send Test Email';
}



function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}



function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);



    document.querySelectorAll('.feature-content, .security-card').forEach(element => {
        observer.observe(element);
    });
}



function initializeEventListeners() {



    themeToggle.addEventListener('click', toggleTheme);


    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    closeMobileMenuBtn.addEventListener('click', toggleMobileMenu);
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', toggleMobileMenu);
    });



    recipientEmail.addEventListener('input', updateLiveCode);
    templateSelect.addEventListener('change', updateLiveCode);
    demoForm.addEventListener('submit', handleFormSubmit);



    document.addEventListener('click', (e) => {
        if (!mobileNav.classList.contains('hidden') &&
            !mobileNav.contains(e.target) &&
            !mobileMenuBtn.contains(e.target)) {
            toggleMobileMenu();
       
 }
    });


}





function initializeCodeCopy() {
    const codeBlocks = document.querySelectorAll('.code-block');
    
    codeBlocks.forEach(block => {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '📋';
        copyButton.title = 'Copy to clipboard';
        
        copyButton.addEventListener('click', async () => {
            const code = block.querySelector('code').textContent;
            try {
                await navigator.clipboard.writeText(code);
                copyButton.innerHTML = '✅';
                setTimeout(() => {
                    copyButton.innerHTML = '📋';
                }, 2000);
            } catch (err) {
                copyButton.innerHTML = '❌';
                setTimeout(() => {
                    copyButton.innerHTML = '📋';
                }, 2000);
            }

        });


        block.style.position = 'relative';
        block.appendChild(copyButton);
    });
}



document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    initializeEventListeners();
    initializeSmoothScrolling();
    initializeScrollAnimations();
    initializeCodeCopy();
    hljs.highlightAll();
    updateLiveCode();
});



window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    showResult('error', '❌ Something went wrong. Please try again later.');
});


window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    showResult('error', '❌ Something went wrong. Please try again later.');
});