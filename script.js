const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

const chatWidget = document.querySelector('.chat-widget');
const chatLauncher = document.querySelector('.chat-launcher');
const chatPanel = document.querySelector('.chat-panel');
const chatClose = document.querySelector('.chat-close');
const chatForm = document.querySelector('.chat-form');
const chatInput = document.querySelector('#chat-input');
const chatMessages = document.querySelector('.chat-messages');

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

  window.setTimeout(() => {
    typing.remove();
    const reply = document.createElement('div');
    reply.className = 'chat-message chat-message--bot';
    reply.textContent = 'Thanks for reaching out! I am currently learning, building, and always open to good ideas.';
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
