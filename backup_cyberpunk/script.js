/**
 * ============================================================================
 * SHIWANT GOYAL // CYBERPUNK DEVELOPER PORTFOLIO JAVASCRIPT
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. WEB AUDIO API SYNTHESIZER (Sci-Fi Sound FX)
  // --------------------------------------------------------------------------
  let audioCtx = null;
  let sfxEnabled = true;

  const initAudio = () => {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
  };

  const playBeep = (freq = 440, type = 'sine', duration = 0.08, volume = 0.05) => {
    if (!sfxEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(volume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // Audio fallback silent
    }
  };

  const sfxToggleBtn = document.querySelector('#sfx-toggle');
  if (sfxToggleBtn) {
    sfxToggleBtn.addEventListener('click', () => {
      sfxEnabled = !sfxEnabled;
      sfxToggleBtn.querySelector('.sfx-icon').textContent = sfxEnabled ? '🔊' : '🔇';
      showToast(sfxEnabled ? 'Audio FX: Enabled' : 'Audio FX: Muted');
      if (sfxEnabled) playBeep(620, 'triangle', 0.1);
    });
  }

  // Play subtle clicks on cyber buttons
  document.querySelectorAll('.cyber-btn, .theme-btn, .term-chip, .filter-btn, .proj-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => playBeep(520, 'sine', 0.04, 0.03));
  });

  // --------------------------------------------------------------------------
  // 2. THEME SWITCHER
  // --------------------------------------------------------------------------
  const themeButtons = document.querySelectorAll('.theme-btn');
  const savedTheme = localStorage.getItem('shiwant-theme') || 'cyberpunk';
  
  const applyTheme = (themeName) => {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('shiwant-theme', themeName);
    themeButtons.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-theme') === themeName);
    });
    playBeep(480, 'triangle', 0.06);
  };

  applyTheme(savedTheme);

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      applyTheme(theme);
      showToast(`Cyber Theme: ${theme.toUpperCase()}`);
    });
  });

  // --------------------------------------------------------------------------
  // 3. MATRIX RAIN DIGITAL CANVAS
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('matrix-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let columns;
    let drops = [];
    const characters = '01SHIWANTGOYALBCABVIMR2026CPROGRAMMING0101011010{}<>#$*&';
    const fontSize = 14;

    const resizeCanvas = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = [];
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -height);
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let animationFrameId;
    let lastRender = 0;
    const renderMatrix = (timestamp) => {
      // Throttle to ~30 FPS for smooth efficiency
      if (timestamp - lastRender > 33) {
        lastRender = timestamp;

        ctx.fillStyle = 'rgba(7, 9, 14, 0.08)';
        ctx.fillRect(0, 0, width, height);

        const currentTheme = document.documentElement.getAttribute('data-theme') || 'cyberpunk';
        let charColor = '#00f0ff';
        if (currentTheme === 'matrix') charColor = '#00ff66';
        else if (currentTheme === 'synthwave') charColor = '#d946ef';
        else if (currentTheme === 'stealth') charColor = '#38bdf8';

        ctx.fillStyle = charColor;
        ctx.font = `${fontSize}px 'Fira Code', monospace`;

        for (let i = 0; i < drops.length; i++) {
          const char = characters.charAt(Math.floor(Math.random() * characters.length));
          ctx.fillText(char, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }
      animationFrameId = requestAnimationFrame(renderMatrix);
    };

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animationFrameId = requestAnimationFrame(renderMatrix);
    }
  }

  // --------------------------------------------------------------------------
  // 4. TYPEWRITER EFFECT IN HERO
  // --------------------------------------------------------------------------
  const typewriterElement = document.getElementById('typewriter-text');
  if (typewriterElement) {
    const phrases = [
      'BCA 1st Year @ BVIMR New Delhi',
      'C & Web Systems Developer',
      'Algorithmic Problem Solver',
      'Smart India Hackathon (SIH 2026) Aspirant',
      'Continuous Learner & Builder'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    const typeStep = () => {
      const currentPhrase = phrases[phraseIndex];
      if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
      } else {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 80;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 1600; // Pause at end of phrase
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 400; // Pause before typing next phrase
      }

      setTimeout(typeStep, typingSpeed);
    };

    typeStep();
  }

  // --------------------------------------------------------------------------
  // 5. 3D HERO CARD TILT EFFECT
  // --------------------------------------------------------------------------
  const portraitCard = document.getElementById('portrait-card');
  if (portraitCard && window.innerWidth > 768) {
    portraitCard.addEventListener('mousemove', (e) => {
      const rect = portraitCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -(y / rect.height) * 12;
      const rotateY = (x / rect.width) * 12;
      portraitCard.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    portraitCard.addEventListener('mouseleave', () => {
      portraitCard.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // --------------------------------------------------------------------------
  // 6. INTERACTIVE DEVELOPER TERMINAL (`shiwant@dev:~$`)
  // --------------------------------------------------------------------------
  const termOutput = document.getElementById('terminal-output');
  const termInput = document.getElementById('terminal-input');
  const termSubmitBtn = document.getElementById('terminal-submit-btn');
  const termClearBtn = document.getElementById('term-clear-btn');
  const termChips = document.querySelectorAll('.term-chip');
  const cmdHistory = [];
  let historyIndex = -1;

  const terminalResponses = {
    help: `AVAILABLE COMMANDS:
  about       - Read Shiwant's biography and educational journey
  skills      - Inspect programming languages, web dev & CS skills
  projects    - List real C programs and web applications
  education   - View BVIMR New Delhi course & academic credentials
  resume      - Display CV snapshot and open full resume
  contact     - Retrieve phone, email, WhatsApp, and GitHub links
  sih         - Smart India Hackathon (SIH 2026) innovation roadmap
  matrix      - Toggle background digital rain matrix
  theme <name>- Change cyber theme (cyberpunk, matrix, synthwave, stealth)
  clear       - Wipe the terminal screen
  date        - Print current system date and time
  sudo        - Request root administrative permissions`,

    about: `SHIWANT GOYAL // ABOUT:
Name:      Shiwant Goyal
Degree:    Bachelor of Computer Applications (BCA) - 1st Year (2026-2029)
College:   Bharati Vidyapeeth Institute of Management and Research (BVIMR), New Delhi
Location:  Rohtak, Haryana, India
Mission:   Build rigorous programming foundations, master C and modern web systems,
           and create high-impact software solutions for real-world problems.`,

    skills: `TECHNICAL ARSENAL:
  [Languages]       C (Primary), C++, Python (Data analysis basics), JavaScript (ES6+)
  [Web Frontend]    Semantic HTML5, CSS3 Grid/Flexbox, Animations, Responsive UI
  [Core CS]         Logic Building, Flowcharting, Code Debugging, Algorithm Dry Runs
  [Tools]           VS Code, GCC Compiler, Git, GitHub, PowerShell, Terminal`,

    projects: `SELECTED PROJECTS:
  1. ATM Banking Simulator (C)      - Transaction bounds, PIN auth, cash dispensing
  2. Student Result System (C)      - Multi-subject grade aggregation & metrics
  3. College Utility Web Hub        - Student schedule & notice portal for BVIMR
  4. Cyber-Safe Awareness Portal   - Interactive digital safety & anti-phishing guide
  5. AI Study Assistant (SIH 2026)  - Adaptive exam roadmapper concept`,

    education: `ACADEMIC CREDENTIALS:
  [2026 - 2029] BCA (Bachelor of Computer Applications)
  Bharati Vidyapeeth Institute of Management and Research (BVIMR), New Delhi
  Current: Semester 1 (Programming in C, Web Tech, Computer Fundamentals)
  Certificates: AIAD (AI Awareness) & CYWDA (Cyber Warfare Defense Awareness)`,

    contact: `TRANSMISSION CHANNELS:
  Email:    goyalshiwant8@gmail.com
  Mobile:   +91 9728010951
  WhatsApp: wa.me/919728010951
  GitHub:   github.com/goyalshiwant8-create
  LinkedIn: linkedin.com/in/shiwant-goyal`,

    sih: `SMART INDIA HACKATHON (SIH 2026):
  Track:     Student Utility & AI Education Assistant
  Status:    Ideation & Prototype Formulation
  Objective: Build scalable tools that empower students and universities across India.`
  };

  const executeCommand = (cmdRaw) => {
    const cmd = cmdRaw.trim();
    if (!cmd) return;

    cmdHistory.push(cmd);
    historyIndex = cmdHistory.length;

    // Echo user input
    const echoDiv = document.createElement('div');
    echoDiv.className = 'term-cmd-echo';
    echoDiv.innerHTML = `<span class="term-prompt">shiwant@dev:~$</span> <strong>${escapeHtml(cmd)}</strong>`;
    termOutput.appendChild(echoDiv);

    playBeep(700, 'square', 0.05, 0.03);

    const parts = cmd.split(' ');
    const root = parts[0].toLowerCase();

    if (root === 'clear') {
      termOutput.innerHTML = '';
      return;
    }

    if (root === 'theme') {
      const requestedTheme = parts[1]?.toLowerCase();
      if (['cyberpunk', 'matrix', 'synthwave', 'stealth'].includes(requestedTheme)) {
        applyTheme(requestedTheme);
        appendTermOutput(`Theme switched to: ${requestedTheme.toUpperCase()}`);
      } else {
        appendTermOutput(`Invalid theme. Options: cyberpunk, matrix, synthwave, stealth`);
      }
      return;
    }

    if (root === 'date') {
      appendTermOutput(new Date().toString());
      return;
    }

    if (root === 'sudo') {
      appendTermOutput(`[SECURITY ALERT]: User 'visitor' is not in the sudoers file. This incident has been logged.`);
      return;
    }

    if (root === 'resume') {
      appendTermOutput(terminalResponses.resume);
      const resumeModal = document.getElementById('resume-modal');
      if (resumeModal) resumeModal.showModal();
      return;
    }

    if (terminalResponses[root]) {
      appendTermOutput(terminalResponses[root]);
    } else {
      appendTermOutput(`command not found: '${escapeHtml(cmd)}'. Type 'help' for command list.`);
    }

    termOutput.scrollTop = termOutput.scrollHeight;
  };

  const appendTermOutput = (text) => {
    const outDiv = document.createElement('div');
    outDiv.className = 'term-output-block';
    outDiv.textContent = text;
    termOutput.appendChild(outDiv);
    termOutput.scrollTop = termOutput.scrollHeight;
  };

  if (termInput) {
    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = termInput.value;
        termInput.value = '';
        executeCommand(val);
      } else if (e.key === 'ArrowUp') {
        if (cmdHistory.length > 0 && historyIndex > 0) {
          historyIndex--;
          termInput.value = cmdHistory[historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        if (historyIndex < cmdHistory.length - 1) {
          historyIndex++;
          termInput.value = cmdHistory[historyIndex];
        } else {
          historyIndex = cmdHistory.length;
          termInput.value = '';
        }
      }
    });
  }

  if (termSubmitBtn && termInput) {
    termSubmitBtn.addEventListener('click', () => {
      const val = termInput.value;
      termInput.value = '';
      executeCommand(val);
      termInput.focus();
    });
  }

  if (termClearBtn) {
    termClearBtn.addEventListener('click', () => {
      termOutput.innerHTML = '';
      playBeep(350, 'sine', 0.05);
    });
  }

  termChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      executeCommand(cmd);
      termInput.focus();
    });
  });

  window.runCliCmd = (cmd) => {
    const termSection = document.getElementById('terminal-section');
    if (termSection) {
      termSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => executeCommand(cmd), 300);
    }
  };

  const openTerminalBtn = document.getElementById('open-terminal-btn');
  if (openTerminalBtn) {
    openTerminalBtn.addEventListener('click', () => {
      const termSection = document.getElementById('terminal-section');
      if (termSection) {
        termSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => termInput.focus(), 400);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. SKILL CATEGORY FILTERS
  // --------------------------------------------------------------------------
  const skillFilters = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      skillFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      skillCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 8. PROJECT CATEGORY FILTERS
  // --------------------------------------------------------------------------
  const projFilters = document.querySelectorAll('.proj-filter-btn');
  const projectCards = document.querySelectorAll('.project-cyber-card');

  projFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      projFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const cat = card.getAttribute('data-cat');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 9. MODALS SYSTEM (ATM Simulator, Student Result, Resume)
  // --------------------------------------------------------------------------
  const setupModal = (triggerSelector, modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    document.querySelectorAll(triggerSelector).forEach(btn => {
      btn.addEventListener('click', () => {
        modal.showModal();
        playBeep(650, 'triangle', 0.08);
      });
    });
  };

  setupModal('.btn-run-atm', 'atm-modal');
  setupModal('.btn-run-result', 'result-modal');
  setupModal('#hero-resume-btn, #open-resume-modal-btn', 'resume-modal');

  // Generic close for dialogs
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close-modal');
      const modal = document.getElementById(modalId);
      if (modal) modal.close();
      playBeep(400, 'sine', 0.04);
    });
  });

  // Close modal when clicking backdrop
  document.querySelectorAll('.cyber-modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const inBox = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!inBox) modal.close();
    });
  });

  // --------------------------------------------------------------------------
  // 10. ATM TRANSACTION SIMULATION ENGINE (C Logic Simulation)
  // --------------------------------------------------------------------------
  let atmBalance = 80000.00;
  let isAtmUnlocked = false;
  const atmDisplay = document.getElementById('atm-display');
  const atmInputField = document.getElementById('atm-input-field');

  const updateAtmClock = () => {
    const el = document.getElementById('atm-clock');
    if (el) el.textContent = new Date().toLocaleTimeString();
  };
  setInterval(updateAtmClock, 1000);
  updateAtmClock();

  document.getElementById('atm-btn-pin')?.addEventListener('click', () => {
    const val = atmInputField.value.trim() || '1234';
    if (val === '1234') {
      isAtmUnlocked = true;
      atmDisplay.innerHTML = `<span class="text-green">> PIN VERIFIED SUCCESSFULLY!</span><br />Welcome, Account Holder.<br />Current balance: ₹${atmBalance.toFixed(2)}<br />Select 'CHECK BALANCE' or enter amount to 'WITHDRAW'.`;
      playBeep(880, 'sine', 0.12);
    } else {
      atmDisplay.innerHTML = `<span class="text-pink">> ACCESS DENIED: Invalid PIN '${escapeHtml(val)}'.</span><br />Please enter 1234.`;
      playBeep(220, 'sawtooth', 0.15);
    }
    atmInputField.value = '';
  });

  document.getElementById('atm-btn-bal')?.addEventListener('click', () => {
    if (!isAtmUnlocked) {
      atmDisplay.innerHTML = `<span class="text-pink">> PLEASE ENTER PIN (1234) FIRST.</span>`;
      playBeep(260, 'sawtooth', 0.1);
      return;
    }
    atmDisplay.innerHTML = `> ACCOUNT BALANCE INQUIRY:<br /><strong style="font-size:16px;color:#39ff14;">₹${atmBalance.toFixed(2)}</strong><br />Available limit for instant ATM withdrawal: ₹20,000.00`;
    playBeep(600, 'sine', 0.08);
  });

  document.getElementById('atm-btn-withdraw')?.addEventListener('click', () => {
    if (!isAtmUnlocked) {
      atmDisplay.innerHTML = `<span class="text-pink">> PLEASE ENTER PIN (1234) FIRST.</span>`;
      playBeep(260, 'sawtooth', 0.1);
      return;
    }

    const amt = parseFloat(atmInputField.value);
    if (isNaN(amt) || amt <= 0) {
      atmDisplay.innerHTML = `<span class="text-amber">> ERROR: Enter a positive withdrawal amount in keypad.</span>`;
      return;
    }

    if (amt > atmBalance) {
      atmDisplay.innerHTML = `<span class="text-pink">> TRANSACTION DECLINED:</span><br />Requested ₹${amt.toFixed(2)} exceeds total balance ₹${atmBalance.toFixed(2)}.`;
      playBeep(220, 'sawtooth', 0.15);
    } else if (amt > 20000) {
      atmDisplay.innerHTML = `<span class="text-amber">> POLICY EXCEEDED:</span><br />Maximum single ATM withdrawal limit is ₹20,000.00.`;
      playBeep(320, 'square', 0.12);
    } else {
      atmBalance -= amt;
      atmDisplay.innerHTML = `<span class="text-green">> TRANSACTION SUCCESSFUL!</span><br />Dispensed: ₹${amt.toFixed(2)}<br />Remaining balance: <strong style="color:#39ff14;">₹${atmBalance.toFixed(2)}</strong><br />Thank you for banking with Bharati Co-op Bank.`;
      playBeep(980, 'sine', 0.15);
      showToast(`Dispensed ₹${amt.toFixed(2)} cash from ATM simulation`);
    }
    atmInputField.value = '';
  });

  document.getElementById('atm-btn-reset')?.addEventListener('click', () => {
    atmBalance = 80000.00;
    isAtmUnlocked = false;
    atmDisplay.innerHTML = `WELCOME TO SHIWANT ATM SYSTEM.<br />STEP 1: INSERT CARD OR ENTER CARD PIN (DEFAULT: 1234)`;
    atmInputField.value = '';
    playBeep(440, 'triangle', 0.08);
  });

  // --------------------------------------------------------------------------
  // 11. STUDENT RESULT CALCULATOR SIMULATION ENGINE
  // --------------------------------------------------------------------------
  document.getElementById('calc-result-btn')?.addEventListener('click', () => {
    const m1 = parseFloat(document.getElementById('mark-1').value) || 0;
    const m2 = parseFloat(document.getElementById('mark-2').value) || 0;
    const m3 = parseFloat(document.getElementById('mark-3').value) || 0;
    const m4 = parseFloat(document.getElementById('mark-4').value) || 0;
    const m5 = parseFloat(document.getElementById('mark-5').value) || 0;

    const total = m1 + m2 + m3 + m4 + m5;
    const percentage = (total / 500.0) * 100.0;
    const hasFailed = [m1, m2, m3, m4, m5].some(m => m < 40);

    let grade = 'F';
    if (!hasFailed) {
      if (percentage >= 85) grade = 'A+ (Distinction)';
      else if (percentage >= 75) grade = 'A (First Class)';
      else if (percentage >= 60) grade = 'B (Second Class)';
      else if (percentage >= 40) grade = 'C (Pass)';
    }

    const out = document.getElementById('result-output');
    out.innerHTML = `
      <div style="color:var(--text-main);font-size:14px;margin-bottom:8px;">
        <strong>ACADEMIC REPORT SUMMARY</strong>
      </div>
      <div>Total Marks: <strong>${total} / 500</strong></div>
      <div>Aggregate Percentage: <strong style="color:var(--accent-cyan);">${percentage.toFixed(2)}%</strong></div>
      <div>Result Status: <strong style="color:${hasFailed ? '#ff5f56' : '#27c93f'};">${hasFailed ? 'FAILED (Backlog in one or more subjects)' : 'PASSED'}</strong></div>
      <div>Awarded Grade: <strong>${grade}</strong></div>
    `;
    playBeep(750, 'sine', 0.1);
  });

  // --------------------------------------------------------------------------
  // 12. RESUME DOWNLOAD & COPY ENGINE
  // --------------------------------------------------------------------------
  const getResumePlainText = () => {
    return `================================================================================
SHIWANT GOYAL
BCA Student | Aspiring Software Developer | Rohtak / New Delhi, India
Phone: +91 9728010951 | Email: goyalshiwant8@gmail.com
LinkedIn: https://www.linkedin.com/in/shiwant-goyal
GitHub: https://github.com/goyalshiwant8-create
================================================================================

OBJECTIVE:
Enthusiastic and driven 1st-year Bachelor of Computer Applications (BCA) student
at Bharati Vidyapeeth Institute of Management and Research (BVIMR), New Delhi.
Passionate about C programming, web development, algorithms, and practical cybersecurity.
Committed to building real-world software and targeting Smart India Hackathon (SIH 2026).

EDUCATION:
- Bachelor of Computer Applications (BCA) [2026 - 2029]
  Bharati Vidyapeeth Institute of Management and Research (BVIMR), New Delhi
  Semester 1 | Focus: C Programming, Computer Fundamentals, Mathematics

TECHNICAL SKILLS:
- Languages: C (Pointers, Memory, CLI Apps), C++, Python (Data analysis basics), JavaScript (ES6+)
- Web Technologies: HTML5 Semantic Markup, CSS3 (Grid, Flexbox, Animations), DOM Manipulation
- Tools & Environments: Git, GitHub, VS Code, GCC Compiler, Windows PowerShell, Terminal
- Core Strengths: Algorithmic Logic, Flowcharts, Debugging, Teamwork, Rapid Learning

KEY PROJECTS:
1. ATM Banking & Cash Withdrawal Simulator (C Language)
   - Built a comprehensive transactional program handling PIN verification, card check,
     withdrawal limits (max Rs. 20,000), and balance arithmetic.
2. Student Result Management System (C Language)
   - Designed a marks calculation suite analyzing multi-subject performance, grade percentages,
     and pass/fail criteria.
3. College Utility Web Portal
   - Developed a student hub providing campus timetables, notices, and attendance tools.
4. Cyber-Safe Threat Awareness Portal
   - Created an interactive platform on digital hygiene, phishing awareness, and password security.
5. AI Study Assistant (SIH 2026 Concept)
   - Designed an adaptive study planner that breaks syllabi into daily active recall prompts.

ACHIEVEMENTS & COMMUNITIES:
- Smart India Hackathon (SIH 2026) Ideation Track participant
- Coursework: Foundations in Emerging Tech (AIAD & CYWDA)
- Community Learning: GeeksforGeeks & Aman Dhattarwal developer forums
================================================================================`;
  };

  const downloadResume = () => {
    const text = getResumePlainText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Shiwant_Goyal_Resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Resume downloaded successfully!');
    playBeep(880, 'sine', 0.1);
  };

  const copyResume = () => {
    const text = getResumePlainText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Resume copied to clipboard!');
        playBeep(780, 'sine', 0.08);
      }).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast('Resume copied to clipboard!');
    } catch {
      showToast('Could not auto-copy, please download resume instead.');
    }
    document.body.removeChild(textarea);
  };

  document.getElementById('download-resume-btn')?.addEventListener('click', downloadResume);
  document.getElementById('modal-download-btn')?.addEventListener('click', downloadResume);
  document.getElementById('copy-resume-btn')?.addEventListener('click', copyResume);

  // --------------------------------------------------------------------------
  // 13. INTERACTIVE AI ASSISTANT WIDGET
  // --------------------------------------------------------------------------
  const chatWidget = document.getElementById('chat-widget');
  const chatLauncher = document.getElementById('chat-toggle-launcher');
  const closeChatBtn = document.getElementById('close-chat-btn');
  const chatForm = document.getElementById('ai-chat-form');
  const chatInput = document.getElementById('ai-chat-input');
  const chatMessages = document.getElementById('chat-messages');

  const toggleChat = (forceState) => {
    const shouldOpen = forceState !== undefined ? forceState : !chatWidget.classList.contains('is-open');
    chatWidget.classList.toggle('is-open', shouldOpen);
    chatLauncher.setAttribute('aria-expanded', String(shouldOpen));
    if (shouldOpen) {
      chatInput.focus();
      playBeep(640, 'triangle', 0.08);
    } else {
      playBeep(320, 'sine', 0.05);
    }
  };

  chatLauncher?.addEventListener('click', () => toggleChat());
  closeChatBtn?.addEventListener('click', () => toggleChat(false));

  const getAiAnswer = (rawQuery) => {
    const q = rawQuery.toLowerCase();

    if (q.includes('who') || q.includes('shiwant') || q.includes('about')) {
      return `Shiwant Goyal is a 1st-year BCA student at Bharati Vidyapeeth (BVIMR), New Delhi. He builds in C, HTML5, CSS3, and JavaScript, with a strong focus on algorithmic problem-solving and software engineering.`;
    }
    if (q.includes('skill') || q.includes('tech') || q.includes('language') || q.includes('stack')) {
      return `Shiwant’s core technical stack includes C Programming, C++, Python (Data analysis basics), HTML5, CSS3 Grid/Flexbox, JavaScript (ES6+), Git/GitHub, and Command-Line tools.`;
    }
    if (q.includes('project') || q.includes('work') || q.includes('built')) {
      return `He has built real C systems like the ATM Transaction Simulator, Student Result Processing System, and web utilities like the BVIMR Campus Hub & Cyber-Safe Portal. Try the interactive simulations on this site!`;
    }
    if (q.includes('sih') || q.includes('hackathon')) {
      return `Shiwant is actively preparing for Smart India Hackathon (SIH 2026), targeting student utility and adaptive AI study assistant concepts.`;
    }
    if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('hire') || q.includes('reach')) {
      return `You can reach Shiwant at goyalshiwant8@gmail.com, call/WhatsApp him at +91 9728010951, or connect on LinkedIn and GitHub!`;
    }
    if (q.includes('college') || q.includes('bvimr') || q.includes('education') || q.includes('degree')) {
      return `He is pursuing his Bachelor of Computer Applications (BCA) at Bharati Vidyapeeth Institute of Management and Research (BVIMR), New Delhi (Batch 2026-2029).`;
    }
    if (q.includes('c') || q.includes('program') || q.includes('code')) {
      return `C is Shiwant’s foundational programming language. He loves understanding memory, pointers, loops, and building fast terminal utilities.`;
    }

    return `Shiwant is focused on building impactful software, mastering C and web technologies, and collaborating on meaningful hackathons like SIH 2026. Ask me about his projects, skills, or contact info!`;
  };

  const handleUserMessage = (userText) => {
    if (!userText.trim()) return;

    // Append user message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg chat-msg--user';
    userMsg.textContent = userText;
    chatMessages.appendChild(userMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Thinking indicator
    const botMsg = document.createElement('div');
    botMsg.className = 'chat-msg chat-msg--bot';
    botMsg.innerHTML = '<span class="status-pulse"></span> Analyzing query...';
    chatMessages.appendChild(botMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      botMsg.textContent = getAiAnswer(userText);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      playBeep(720, 'sine', 0.08);
    }, 450);
  };

  chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value;
    chatInput.value = '';
    handleUserMessage(text);
  });

  document.querySelectorAll('.chat-suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-query');
      handleUserMessage(q);
    });
  });

  // --------------------------------------------------------------------------
  // 14. CONTACT FORM INTERACTION
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('portfolio-contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const subject = formData.get('subject') || 'Portfolio Inquiry';
      const message = formData.get('message');

      formFeedback.className = 'form-feedback success';
      formFeedback.innerHTML = `> TRANSMISSION ENCRYPTED &amp; SENT!<br />Thank you ${escapeHtml(name)}. I will respond to <strong>${escapeHtml(email)}</strong> shortly.`;
      
      playBeep(900, 'sine', 0.15);
      showToast('Message transmitted successfully!');

      // Offer direct mailto backup
      setTimeout(() => {
        const mailtoUri = `mailto:goyalshiwant8@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Shiwant,\n\nName: ${name}\nEmail: ${email}\n\n${message}`)}`;
        window.location.href = mailtoUri;
      }, 1200);

      contactForm.reset();
    });
  }

  // --------------------------------------------------------------------------
  // 15. MOBILE MENU TOGGLE
  // --------------------------------------------------------------------------
  const menuToggle = document.querySelector('.hud-menu-toggle');
  const hudNav = document.getElementById('hud-nav');

  if (menuToggle && hudNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = hudNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      playBeep(450, 'sine', 0.05);
    });

    document.querySelectorAll('.hud-nav .nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hudNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 16. SCROLL SPY FOR NAVIGATION
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.hud-nav .nav-link');

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-30% 0px -50% 0px' });

  sections.forEach(s => scrollObserver.observe(s));

  // --------------------------------------------------------------------------
  // 17. TOAST NOTIFICATION UTILITY
  // --------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(msg) {
    const toast = document.getElementById('cyber-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // --------------------------------------------------------------------------
  // 18. ESCAPE HTML HELPER
  // --------------------------------------------------------------------------
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --------------------------------------------------------------------------
  // 19. SIH 2026 STATUS TICKER
  // --------------------------------------------------------------------------
  const sihEl = document.getElementById('sih-countdown');
  if (sihEl) {
    sihEl.textContent = 'TARGET: SIH 2026 ACTIVE';
  }

  // Welcome Audio & Toast on Load
  setTimeout(() => {
    showToast('SYSTEM ONLINE // Shiwant Goyal Portfolio Loaded');
  }, 600);
});
