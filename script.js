const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

const chatWidget = document.querySelector('.chat-widget');
const chatLauncher = document.querySelector('.chat-launcher');
const chatPanel = document.querySelector('.chat-panel');
const chatClose = document.querySelector('.chat-close');
const chatForm = document.querySelector('.chat-form');
const chatInput = document.querySelector('#chat-input');
const chatMessages = document.querySelector('.chat-messages');
const helpForm = document.querySelector('#help-form');
const helpResponse = document.querySelector('#help-response');

const replies = [
  'That sounds exciting. Shiwant is learning through real projects and trying to turn ideas into useful experiences.',
  'He enjoys solving practical problems with a mix of curiosity, logic, and creativity.',
  'Good ideas grow stronger when they are tested, improved, and shared with real people.',
  'His focus is building a strong foundation while exploring AI, cybersecurity, and product thinking.',
  'That’s a great question. He likes ideas that are simple, useful, and meaningful to people.',
  'Shiwant is someone who learns by doing, experimenting, and improving with each project.'
];

const quickResponses = {
  about: 'Shiwant is a curious BCA student who enjoys building useful ideas, learning by doing, and solving problems with technology.',
  skills: 'His core focus includes coding, problem-solving, AI awareness, teamwork, and cybersecurity interest.',
  projects: 'He likes building practical ideas such as college utility tools, cybersecurity awareness portals, and AI-based learning concepts.',
  contact: 'You can reach out via email or connect through LinkedIn or GitHub. He is always open to thoughtful collaborations.',
  hello: 'Hi! I’m Shiwant’s AI assistant. Ask me about his projects, skills, goals, or how to connect with him.',
  default: 'I can help with Shiwant’s skills, projects, vision, and contact details. Ask me anything specific.'
};

const getAssistantReply = (text) => {
  const query = text.toLowerCase();

  if (query.includes('hello') || query.includes('hi') || query.includes('hey')) return quickResponses.hello;
  if (query.includes('about') || query.includes('who') || query.includes('yourself') || query.includes('shiwant')) return quickResponses.about;
  if (query.includes('skill') || query.includes('tech') || query.includes('learn') || query.includes('strength')) return quickResponses.skills;
  if (query.includes('project') || query.includes('work') || query.includes('idea') || query.includes('portfolio')) return quickResponses.projects;
  if (query.includes('contact') || query.includes('email') || query.includes('linkedin') || query.includes('github')) return quickResponses.contact;
  if (query.includes('sih') || query.includes('hackathon')) return 'Shiwant is aiming to participate in SIH 2026 and build a meaningful idea with real-world value.';
  if (query.includes('ai') || query.includes('cyber') || query.includes('security')) return 'He is especially interested in AI, cybersecurity, and practical digital problem-solving.';
  if (query.includes('goal') || query.includes('future') || query.includes('mca') || query.includes('placement')) return 'His long-term goal is to grow into a strong IT professional, pursue MCA, and build a successful career in technology.';
  if (query.includes('why') || query.includes('why not') || query.includes('tell me more')) return 'Because he enjoys turning curiosity into action. He likes learning through projects, improving ideas, and creating solutions that feel useful to people.';
  if (query.includes('can you') || query.includes('help me')) return 'Yes — I can help with his background, projects, skills, goals, and ways to connect with him.';

  return replies[Math.floor(Math.random() * replies.length)];
};

const setChatOpen = (isOpen) => {
  chatWidget.classList.toggle('is-open', isOpen);
  chatLauncher.setAttribute('aria-expanded', String(isOpen));
  chatLauncher.setAttribute('aria-label', isOpen ? 'Minimize chat' : 'Open chat');
  chatPanel.setAttribute('aria-hidden', String(!isOpen));

  if (isOpen) {
    const existingIntro = chatMessages.querySelector('.chat-message--intro');
    if (!existingIntro) {
      const intro = document.createElement('div');
      intro.className = 'chat-message chat-message--bot chat-message--intro';
      intro.textContent = 'How can I help you learn more about Shiwant?';
      chatMessages.append(intro);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    setTimeout(() => chatInput.focus(), 250);
  }
};

chatLauncher.addEventListener('click', () => setChatOpen(!chatWidget.classList.contains('is-open')));
chatClose.addEventListener('click', () => setChatOpen(false));

document.querySelectorAll('[data-open-chat]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    setChatOpen(true);
  });
});

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

  const responseText = getAssistantReply(text);

  window.setTimeout(() => {
    typing.remove();
    const reply = document.createElement('div');
    reply.className = 'chat-message chat-message--bot';
    reply.textContent = responseText;
    chatMessages.append(reply);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 900);
});

document.querySelectorAll('.chat-prompt').forEach((button) => {
  button.addEventListener('click', () => {
    const prompt = button.textContent.trim();
    chatInput.value = prompt;
    chatInput.focus();
    chatForm.requestSubmit();
  });
});

helpForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const question = new FormData(helpForm).get('question').trim();
  helpResponse.textContent = `Thanks for your question. ${getAssistantReply(question)} I’ll help you find the right details.`;
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
