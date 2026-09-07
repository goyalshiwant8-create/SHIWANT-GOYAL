const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

const chatWidget = document.querySelector('.chat-widget');
const chatLauncher = document.querySelector('.chat-launcher');
const chatPanel = document.querySelector('.chat-panel');
const chatClose = document.querySelector('.chat-close');
const chatForm = document.querySelector('.chat-form');
const chatInput = document.querySelector('#chat-input');
const chatMessages = document.querySelector('.chat-messages');

const replies = [
  'That sounds exciting. I am learning, experimenting, and trying to turn ideas into useful projects.',
  'I love solving real problems with simple, thoughtful digital experiences.',
  'Good ideas become stronger when they are tested, improved, and shared with people who care.',
  'I am currently focused on building my foundations while exploring AI, security, and practical product thinking.',
  'Thanks for the message — let’s talk about a project, an idea, or a challenge worth solving.'
];

const setChatOpen = (isOpen) => {
  chatWidget.classList.toggle('is-open', isOpen);
  chatLauncher.setAttribute('aria-expanded', String(isOpen));
  chatLauncher.setAttribute('aria-label', isOpen ? 'Minimize chat' : 'Open chat');
  chatPanel.setAttribute('aria-hidden', String(!isOpen));
  if (isOpen) window.setTimeout(() => chatInput.focus(), 250);
};

chatLauncher.addEventListener('click', () => setChatOpen(!chatWidget.classList.contains('is-open')));
chatClose.addEventListener('click', () => setChatOpen(false));

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  const userMessage = document.createElement('div');
  userMessage.className = 'chat-message chat-message--user';
  userMessage.textContent = text;
  chatMessages.append(userMessage);
  chatInput.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;

  const typing = document.createElement('div');
  typing.className = 'chat-message chat-message--bot typing-indicator';
  typing.setAttribute('aria-label', 'Assistant is typing');
  typing.innerHTML = '<span></span><span></span><span></span>';
  chatMessages.append(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  const responseText = text.toLowerCase().includes('project')
    ? 'Projects are where theory becomes real impact. I enjoy ideas that are simple, useful, and genuinely solve a problem.'
    : text.toLowerCase().includes('skill')
      ? 'My current focus is on problem-solving, coding basics, AI awareness, and building confidence with real-world projects.'
      : text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')
        ? 'Hi! Nice to meet you. I am Shiwant, and I am building ideas that are practical, thoughtful, and useful.'
        : replies[Math.floor(Math.random() * replies.length)];

  window.setTimeout(() => {
    typing.remove();
    const reply = document.createElement('div');
    reply.className = 'chat-message chat-message--bot';
    reply.textContent = responseText;
    chatMessages.append(reply);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 900);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && chatWidget.classList.contains('is-open')) setChatOpen(false);
});

menuToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

document.querySelectorAll('.site-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  });
});

const particles = document.createElement('div');
particles.className = 'floating-particles';
for (let i = 0; i < 18; i += 1) {
  const particle = document.createElement('span');
  particle.style.left = `${Math.random() * 100}%`;
  particle.style.bottom = `${Math.random() * 10}%`;
  particle.style.opacity = String(0.3 + Math.random() * 0.7);
  particle.style.animationDelay = `${Math.random() * 12}s`;
  particle.style.animationDuration = `${10 + Math.random() * 10}s`;
  particle.style.width = `${4 + Math.random() * 10}px`;
  particle.style.height = particle.style.width;
  particles.appendChild(particle);
}
document.body.appendChild(particles);

const heroVisual = document.querySelector('.hero-visual');
if (heroVisual) {
  document.addEventListener('pointermove', (event) => {
    const { innerWidth, innerHeight } = window;
    const x = (event.clientX / innerWidth - 0.5) * 12;
    const y = (event.clientY / innerHeight - 0.5) * 12;
    heroVisual.style.transform = `translate(${x * 0.7}px, ${y * 0.7}px)`;
  });
}

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.site-nav a')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach((section) => sectionObserver.observe(section));
