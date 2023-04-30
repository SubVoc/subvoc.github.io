// Get all the movie and TV series links
const links = document.querySelectorAll('a');

// Loop through each link and add a click event listener
links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault(); // Prevent the default link behavior
    const title = link.textContent; // Get the title of the movie or TV series
    speak(title); // Speak the title using the speak() function
  });
});

// Function to speak a given text using the SpeechSynthesis API
function speak(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  synth.speak(utterance);
}
