let currentSection = 0;
const sections = document.querySelectorAll('.questionnaire-section');

function showSection(index) {
  sections.forEach((section, i) => {
    section.style.display = (i === index) ? 'block' : 'none';
  });
}

function nextSection() {
  if (currentSection < sections.length - 1) {
    currentSection++;
    showSection(currentSection);
  }
}

function prevSection() {
  if (currentSection > 0) {
    currentSection--;
    showSection(currentSection);
  }
}