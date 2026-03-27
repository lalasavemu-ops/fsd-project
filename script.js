// Check Login Status and Display User Info
function checkUserLogin() {
  const isLoggedIn = localStorage.getItem("userLoggedIn");
  if (isLoggedIn !== "true") {
    // Not logged in, go back to login page
    if (!window.location.href.includes("login.html")) {
      window.location.href = "login.html";
    }
    return;
  }

  const userName = localStorage.getItem("userName");
  const userInfo = document.getElementById("user-info");
  const userNameElement = document.getElementById("user-name");
  const logoutBtn = document.getElementById("logout-btn");

  if (userName && userInfo && userNameElement) {
    userNameElement.textContent = `Welcome, ${userName}!`;
    userInfo.classList.remove("hidden");

    const heroWelcome = document.querySelector('.modern-home .welcome');
    if (heroWelcome) {
      heroWelcome.textContent = `Hi, ${userName} 👋`;
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
}

// Handle logout - clear all user data and analyzer state
function handleLogout() {
  // Clear all user session data
  localStorage.removeItem("userLoggedIn");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userMobile");
  
  // Clear analyzer data
  currentAnalysisData = null;
  
  // Reset UI elements
  const resultCard = document.getElementById("result");
  const skillsInput = document.getElementById("skills");
  const roleSelect = document.getElementById("role");
  
  if (resultCard) resultCard.classList.add("hidden");
  if (skillsInput) skillsInput.value = "";
  if (roleSelect) roleSelect.value = "";
  
  // Redirect to login
  window.location.href = "login.html";
}

// Role and required skills data object
const careerSkills = {
  frontend: ["HTML", "CSS", "JavaScript", "Git", "Communication"],
  backend: ["Node.js", "SQL", "Git", "Problem Solving"],
  fullstack: ["HTML", "CSS", "JavaScript", "Node.js", "SQL", "Git", "Problem Solving"],
  data: ["Python", "SQL", "Communication", "Problem Solving"],
  uiux: ["Figma", "Communication", "Problem Solving"],
  cyber: ["Python", "Problem Solving", "Communication"]
};

// Skill recommendations with resources
const skillRecommendations = {
  "HTML": {
    description: "Master the fundamentals of HTML markup and semantic structure.",
    resources: ["freeCodeCamp", "W3Schools", "MDN Web Docs"]
  },
  "CSS": {
    description: "Learn styling, layouts, flexbox, and CSS Grid for responsive design.",
    resources: ["freeCodeCamp", "W3Schools", "YouTube (Traversy Media)"]
  },
  "JavaScript": {
    description: "Build interactive web applications with modern JavaScript ES6+.",
    resources: ["freeCodeCamp", "YouTube (Programming with Mosh)", "Codecademy"]
  },
  "Git": {
    description: "Master version control and collaboration using Git and GitHub.",
    resources: ["GitHub Learning Lab", "freeCodeCamp", "Atlassian Tutorials"]
  },
  "Communication": {
    description: "Develop technical communication and presentation skills.",
    resources: ["Coursera", "LinkedIn Learning", "Toastmasters"]
  },
  "Node.js": {
    description: "Build server-side applications with Node.js and Express.js.",
    resources: ["freeCodeCamp", "YouTube (Traversy Media)", "Udemy"]
  },
  "SQL": {
    description: "Learn database design and SQL queries for data management.",
    resources: ["W3Schools", "freeCodeCamp", "LeetCode Database"]
  },
  "Problem Solving": {
    description: "Enhance algorithmic thinking and problem-solving techniques.",
    resources: ["LeetCode", "HackerRank", "CodeSignal"]
  },
  "Python": {
    description: "Master Python for data science, automation, and web development.",
    resources: ["freeCodeCamp", "Python.org", "YouTube (Programming with Mosh)"]
  },
  "Figma": {
    description: "Learn UI/UX design tools and prototyping with Figma.",
    resources: ["Figma Tutorials", "YouTube (AJ&Smart)", "Skillshare"]
  }
};

// Global variable for analysis data
let currentAnalysisData = null;

// Initialize all event listeners and DOM-dependent code
function initializeApp() {
  // Check user login status first
  checkUserLogin();
  
  // Dark Mode Toggle
  const themeBtn = document.getElementById("theme-btn");
  
  // Load saved theme preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark" && themeBtn) {
    document.body.classList.add("dark-mode");
    themeBtn.textContent = "☀️";
    document.body.style.background = "linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1a1f35 100%)";
  }
  
  // Toggle dark mode on button click
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      
      if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        themeBtn.textContent = "☀️";
        document.body.style.background = "linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1a1f35 100%)";
      } else {
        localStorage.setItem("theme", "light");
        themeBtn.textContent = "🌙";
        document.body.style.background = "linear-gradient(135deg, #e0f2fe 0%, #dbeafe 50%, #cffafe 100%)";
      }
    });
  }
  
  // Profile Modal
  const profileBtn = document.getElementById("profile-btn");
  const profileModal = document.getElementById("profile-modal");
  const closeModal = document.getElementById("close-modal");
  
  // Open profile modal
  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      if (currentAnalysisData) {
        updateProfileModal(currentAnalysisData);
      } else {
        alert("Please analyze your skills first to view your progress.");
      }
    });
  }
  
  // Close profile modal
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      if (profileModal) profileModal.classList.add("hidden");
    });
  }
  
  // Close modal when clicking outside
  if (profileModal) {
    profileModal.addEventListener("click", (e) => {
      if (e.target === profileModal) {
        profileModal.classList.add("hidden");
      }
    });
  }
  
  // Initialize other event listeners
  initializePageEventListeners();
}

// Update profile modal with analysis data
function updateProfileModal(data) {
  document.getElementById("profileRole").textContent = data.role;
  document.getElementById("profilePercentage").textContent = data.percentage;
  document.getElementById("profileMatched").textContent = data.matched;
  document.getElementById("profileTotal").textContent = data.total;
  document.getElementById("profileMissing").textContent = data.missing;
  
  profileModal.classList.remove("hidden");
  drawPieChart(data.percentage);
}

// Draw pie chart
function drawPieChart(percentage) {
  const canvas = document.getElementById("pie-chart");
  const ctx = canvas.getContext("2d");
  const radius = 75;
  const centerX = 75;
  const centerY = 75;
  
  // Determine colors based on dark mode
  const isDarkMode = document.body.classList.contains("dark-mode");
  const bgColor = isDarkMode ? "#475569" : "#e5e7eb";
  const textColor = isDarkMode ? "#e2e8f0" : "#1f2937";
  
  // Clear canvas
  ctx.clearRect(0, 0, 150, 150);
  
  // Draw background circle
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw completed percentage
  ctx.fillStyle = "#16a34a";
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + (percentage / 100) * Math.PI * 2);
  ctx.lineTo(centerX, centerY);
  ctx.fill();
  
  // Draw text
  ctx.fillStyle = textColor;
  ctx.font = "bold 24px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${percentage}%`, centerX, centerY);
}

// Generate Learning Roadmap
function generateLearningRoadmap(missingSkills) {
  const roadmapSection = document.getElementById("roadmap");
  const roadmapList = document.getElementById("roadmap-list");
  
  roadmapList.innerHTML = "";
  
  if (missingSkills.length === 0) {
    roadmapSection.classList.add("hidden");
    return;
  }
  
  roadmapSection.classList.remove("hidden");
  
  missingSkills.forEach((skill, index) => {
    const recommendation = skillRecommendations[skill] || {
      description: `Learn and master the skill of ${skill}.`,
      resources: ["Online Learning Platforms", "Practice Projects"]
    };
    
    const stepDiv = document.createElement("div");
    stepDiv.className = "roadmap-step";
    
    const stepHTML = `
      <div class="step-skill">
        <span class="step-number">${index + 1}</span>
        ${skill}
      </div>
      <p class="step-description">${recommendation.description}</p>
      <div class="step-resources">
        <strong>Suggested Resources:</strong>
        <div class="resources-list">
          ${recommendation.resources.map(resource => `<span class="resource-badge">${resource}</span>`).join("")}
        </div>
      </div>
    `;
    
    stepDiv.innerHTML = stepHTML;
    roadmapList.appendChild(stepDiv);
  });
}

// Initialize all page-specific event listeners
function initializePageEventListeners() {
  const roleSelect = document.getElementById("role") || document.getElementById("career-select");
  const skillsInput = document.getElementById("skills");
  const analyzeBtn = document.getElementById("analyze-btn");
  const resultCard = document.getElementById("result");
  const resRole = document.getElementById("res-role");
  const resRequired = document.getElementById("res-required");
  const resSelected = document.getElementById("res-selected");
  const resMatched = document.getElementById("res-matched");
  const resMissing = document.getElementById("res-missing");
  const resPercentage = document.getElementById("res-percentage");
  const progressFill = document.getElementById("progress-fill");
  const suggestionList = document.getElementById("suggestion-list");
  
  // Mobile menu toggle
  const menuBtn = document.getElementById("menu-btn");
  const navLinks = document.querySelector(".nav-links");
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }
  
  // Analyze button event (only in analyze UI page)
  if (analyzeBtn && roleSelect) {
    analyzeBtn.addEventListener("click", () => {
      const selectedRole = roleSelect.value;
      if (!selectedRole) {
        alert("Please select a career role first.");
        return;
      }
  
      let selectedSkills = [];
      let selectedSkillsDisplay = "";
  
      if (skillsInput) {
        const skillsText = skillsInput.value.trim();
        if (!skillsText) {
          alert("Please enter your skills.");
          return;
        }
        selectedSkills = skillsText
          .split(/[,\s]+/)
          .map((skill) => skill.trim().toLowerCase())
          .filter(Boolean);
        selectedSkillsDisplay = skillsText;
      } else {
        const selectedCheckboxes = document.querySelectorAll(".skill-checkbox:checked");
        if (selectedCheckboxes.length === 0) {
          alert("Please select at least one skill.");
          return;
        }
        selectedSkills = Array.from(selectedCheckboxes).map((el) => el.value.toLowerCase());
        selectedSkillsDisplay = Array.from(selectedCheckboxes).map((el) => el.value).join(", ");
      }
  
      const requiredSkills = careerSkills[selectedRole] || [];
      const matchedSkills = requiredSkills.filter((skill) =>
        selectedSkills.includes(skill.toLowerCase())
      );
      const missingSkills = requiredSkills.filter((skill) =>
        !selectedSkills.includes(skill.toLowerCase())
      );
  
      const readiness = requiredSkills.length
        ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
        : 0;
  
      // Store analysis data for profile modal
      currentAnalysisData = {
        role: roleSelect.options[roleSelect.selectedIndex].text,
        percentage: readiness,
        matched: matchedSkills.length,
        total: requiredSkills.length,
        missing: missingSkills.length
      };
  
      if (resRole) resRole.textContent = roleSelect.options[roleSelect.selectedIndex].text;
      if (resRequired) resRequired.textContent = careerSkills[selectedRole].join(", ");
      if (resSelected) resSelected.textContent = selectedSkills.length ? selectedSkills.join(", ") : "No skills entered";
      if (resMatched) resMatched.textContent = matchedSkills.length ? matchedSkills.join(", ") : "None yet";
      if (resMissing) resMissing.textContent = missingSkills.length ? missingSkills.join(", ") : "Great! You have all required skills";
      if (resPercentage) resPercentage.textContent = `${readiness}%`;
      if (progressFill) progressFill.style.width = `${readiness}%`;
  
      if (suggestionList) {
        suggestionList.innerHTML = "";
        if (missingSkills.length === 0) {
          const li = document.createElement("li");
          li.textContent = "Excellent progress! Keep practicing and updating your portfolio.";
          suggestionList.appendChild(li);
        } else {
          missingSkills.forEach((skill) => {
            const li = document.createElement("li");
            li.textContent = `Learn or improve ${skill} through online tutorials, practice projects, and hands-on tasks.`;
            suggestionList.appendChild(li);
          });
        }
      }
  
      generateLearningRoadmap(missingSkills);
  
      if (resultCard) resultCard.classList.remove("hidden");
    });
  }
  
  // Simple contact form action
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thanks! Your message is received (in a real app, this would be sent to the team).");
      contactForm.reset();
    });
  }
}

// Load app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  // DOM is already loaded
  initializeApp();
}