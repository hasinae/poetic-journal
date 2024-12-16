const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#f7f7f7',
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };
  
  const game = new Phaser.Game(config);
  
  let journalEntries = []; // Stores journal entries
  const poetryLines = [
    "The stars whisper secrets to the night sky.",
    "Each raindrop holds a world of its own.",
    "The wind carries dreams untold.",
    "Time dances silently in the moonlight.",
    "A heartbeat is the universe's applause."
  ];
  
  function preload() {
  }
  

function create() {
    // Title
    this.add.text(20, 20, 'Poetic Journal', { 
      fontSize: '32px', 
      color: '#333', 
      fontFamily: 'Courier New' 
    });
  
    // Get DOM elements
    const inputElement = document.getElementById('journalInput');
    const buttonElement = document.getElementById('submitButton');
  
    // Event listener for submitting entries
    buttonElement.addEventListener('click', () => {
      const text = inputElement.value.trim();
      if (text) {
        const poetry = poetryLines[Math.floor(Math.random() * poetryLines.length)];
        addJournalEntry(this, text, poetry);
        inputElement.value = ''; // Clear input
      }
    });
  }
  
  function addJournalEntry(scene, text, poetry) {
    const offsetY = journalEntries.length * 60 + 80; // Dynamic spacing
  
    // Add the journal text
    scene.add.text(20, offsetY, text, {
      fontSize: '18px',
      color: '#000',
      fontFamily: 'Courier New' 
    });
  
    // Add the poetry below the journal text
    scene.add.text(40, offsetY + 30, poetry, {
      fontSize: '16px',
      color: '#7b4397',
      fontStyle: 'italic',
      fontFamily: 'Courier New' 
    });
  
    // Store the entry
    journalEntries.push({ text, poetry });
  }
  
function addJournalEntry(scene, text, poetry) {
    const offsetY = journalEntries.length * 60 + 80; // Dynamic spacing
  
    // Add the journal text
    scene.add.text(20, offsetY, text, {
      fontSize: '18px',
      color: '#000',
      fontFamily: 'Courier New' 
    });
  
    // Add the poetry below the journal text
    scene.add.text(40, offsetY + 30, poetry, {
      fontSize: '16px',
      color: '#7b4397',
      fontStyle: 'italic',
      fontFamily: 'Courier New' 
    });
  
    // Store the entry
    journalEntries.push({ text, poetry });
  }
  function update() {
  }
  