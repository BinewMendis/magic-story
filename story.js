const question = document.getElementById("question");
const choices = document.getElementById("choices");

const storySteps = [
  {
    text: "Hi there! You just met a guy who likes coding, music, and cricket. What do you do?",
    options: [
      { text: "Ignore him 😏", reply: "Haha, playing hard to get? Cute 😉", next: 1 },
      { text: "Talk to him 😊", reply: "Smart choice! I promise I don't bite… much 😜", next: 1 },
    ]
  },
  {
    text: "You notice he can sing! What do you do?",
    options: [
      { text: "Ask him to sing for you 🎤", reply: "You know the way to my heart! ❤️", next: 2 },
      { text: "Smile and listen 😌", reply: "Ah, you like my voice… I can tell 😏", next: 2 },
    ]
  },
  {
    text: "He asks: 'Do you like music as much as I do?'",
    options: [
      { text: "Yes! 🎶", reply: "Perfect, we can jam together 😎", next: 3 },
      { text: "Absolutely! 🎵", reply: "I knew we’d vibe instantly 😘", next: 3 },
    ]
  },
  {
    text: "He admits: 'I play cricket too. Do you want to watch me play sometime?'",
    options: [
      { text: "Yes, of course! 🏏", reply: "Deal! I’ll impress you with my batting 😎", next: 4 },
      { text: "Definitely! 😄", reply: "Yay! I hope you’re ready for my best shots 😏", next: 4 },
    ]
  },
  {
    text: "He’s a little shy but excited: 'Can I sing a song just for you?'",
    options: [
      { text: "Yes, please! 🎤", reply: "Get ready… it’s all for you 😏", next: 6 },
      { text: "Absolutely! 😍", reply: "I knew you’d say that… my favorite listener 😘", next: 6 },
    ]
  },
  {
    text: "He suddenly gets nervous: 'I might be a little obsessed… is that okay?'",
    options: [
      { text: "Of course! 😄", reply: "Phew! I can keep crushing on you then 😏", next: 7 },
      { text: "It’s cute! ❤️", reply: "I knew you’d like it… can’t help it 😎", next: 7 },
    ]
  },
  {
  text: "Let me ask you something… Do you like me?",
    options: [
      { text: "Of course! 😄", reply: "Haha, you got no option other than yes 😎😏", next: 7 },
      { text: "Yes! ❤️", reply: "Haha, you got no option other than yes 😎😏", next: 7 },
    ]
  },
  {
    text: "But sorry I have a crush on someone! Do you know her name? 😏'",
    options: [
      { text: "No! 😄", reply: "Brace yourself then😎😏", next: null },
      {  text: "Who? ❤️", reply: "Haha, so you are curious?😍", next: null },
    ]
  },
];

let step = 0;

function fadeOut(element, callback) {
  element.style.transition = "opacity 0.5s";
  element.style.opacity = 0;
  setTimeout(callback, 500); // wait for fade out
}

function fadeIn(element) {
  element.style.transition = "opacity 0.5s";
  element.style.opacity = 1;
}

function render() {
  choices.innerHTML = "";
  fadeIn(question);

  // show current story text
  question.innerText = storySteps[step].text;

  // add buttons for each option
  storySteps[step].options.forEach(option => {
    const btn = document.createElement("button");
    btn.innerText = option.text;

    btn.onclick = () => {

  console.log("Button clicked:", option.text);

  // hide all options
  choices.innerHTML = "";

  fadeOut(question, () => {

    console.log("Showing reply:", option.reply);

    question.innerText = option.reply;
    fadeIn(question);

    setTimeout(() => {

      console.log("Next step:", option.next);

      if (option.next == null) {

        console.log("END OF STORY - starting particles");

        document.getElementById("story").style.display = "none";

        if (window.startParticles) {
          console.log("startParticles exists");
          window.startParticles();
        } else {
          console.log("ERROR: startParticles NOT found");
        }

      } else {

        step = option.next;
        render();

      }

    }, 3000);

  });

    };

    choices.appendChild(btn);
  });
}

// set initial opacity
question.style.opacity = 1;

// start story
render();