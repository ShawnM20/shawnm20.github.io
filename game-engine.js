// Game Engine - Core Game Logic and State Management
class PortfolioGame {
  constructor() {
    this.gameState = 'loading'; // loading, menu, playing, paused, gameover
    this.score = 0;
    this.objectives = {
      total: 8,
      found: 0,
      crystals: []
    };
    this.gameTime = 0;
    this.playerEnergy = 100;
    this.isPaused = false;
    this.gameStartTime = 0;
    
    this.init();
  }
  
  init() {
    this.setupLoadingScreen();
    this.loadGameAssets();
  }
  
  setupLoadingScreen() {
    const loadingScreen = document.getElementById('gameLoading');
    if (loadingScreen) {
      loadingScreen.classList.remove('hidden');
      this.simulateLoadingProgress();
    }
  }
  
  simulateLoadingProgress() {
    const progressBar = document.querySelector('.loading-progress');
    const loadingText = document.querySelector('.loading-text');
    const loadingSubtitle = document.querySelector('.loading-subtitle');
    
    let progress = 0;
    const loadingSteps = [
      { progress: 20, text: 'INITIALIZING...', subtitle: 'Loading game engine...' },
      { progress: 40, text: 'LOADING ASSETS...', subtitle: 'Preparing 3D models...' },
      { progress: 60, text: 'BUILDING WORLD...', subtitle: 'Generating environment...' },
      { progress: 80, text: 'SPAWNING OBJECTS...', subtitle: 'Placing interactive elements...' },
      { progress: 100, text: 'READY!', subtitle: 'Click to start exploration!' }
    ];
    
    const updateProgress = () => {
      const currentStep = loadingSteps.find(step => progress <= step.progress);
      if (currentStep) {
        progressBar.style.width = progress + '%';
        loadingText.textContent = currentStep.text;
        loadingSubtitle.textContent = currentStep.subtitle;
      }
      
      progress += 2;
      if (progress <= 100) {
        setTimeout(updateProgress, 50);
      } else {
        setTimeout(() => this.showGameMenu(), 1000);
      }
    };
    
    updateProgress();
  }
  
  loadGameAssets() {
    // Simulate asset loading
    setTimeout(() => {
      this.gameAssetsLoaded = true;
    }, 3000);
  }
  
  showGameMenu() {
    const loadingScreen = document.getElementById('gameLoading');
    const gameMenu = document.getElementById('gameMenu');
    
    if (loadingScreen) loadingScreen.classList.add('hidden');
    if (gameMenu) gameMenu.classList.remove('hidden');
    
    this.gameState = 'menu';
    this.setupMenuEventListeners();
  }
  
  setupMenuEventListeners() {
    const startBtn = document.getElementById('startGame');
    const instructionsBtn = document.getElementById('instructionsBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startGame());
    }
    
    if (instructionsBtn) {
      instructionsBtn.addEventListener('click', () => this.showInstructions());
    }
    
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => this.showSettings());
    }
  }
  
  startGame() {
    const gameMenu = document.getElementById('gameMenu');
    const gameHUD = document.getElementById('gameHUD');
    const gameContainer = document.getElementById('gameContainer');
    
    if (gameMenu) gameMenu.classList.add('hidden');
    if (gameHUD) gameHUD.classList.remove('hidden');
    if (gameContainer) gameContainer.classList.remove('hidden');
    
    this.gameState = 'playing';
    this.gameStartTime = Date.now();
    this.resetGameStats();
    this.initializeGameWorld();
    this.startGameLoop();
  }
  
  resetGameStats() {
    this.score = 0;
    this.objectives.found = 0;
    this.gameTime = 0;
    this.playerEnergy = 100;
    this.objectives.crystals = [];
    
    this.updateHUD();
  }
  
  initializeGameWorld() {
    // Initialize collectibles in the 3D world
    this.spawnCrystals();
    this.setupGameEventListeners();
  }
  
  spawnCrystals() {
    // Create 8 collectible crystals at specific locations
    const crystalPositions = [
      { x: 10, y: 5, z: 10, id: 'crystal1' },
      { x: -10, y: 3, z: -10, id: 'crystal2' },
      { x: 15, y: 8, z: -5, id: 'crystal3' },
      { x: -15, y: 6, z: 5, id: 'crystal4' },
      { x: 8, y: 10, z: -8, id: 'crystal5' },
      { x: -8, y: 4, z: 12, id: 'crystal6' },
      { x: 0, y: 12, z: 0, id: 'crystal7' },
      { x: -12, y: 7, z: -12, id: 'crystal8' }
    ];
    
    crystalPositions.forEach(pos => {
      this.objectives.crystals.push({
        ...pos,
        collected: false,
        mesh: null // Will be set when 3D scene is ready
      });
    });
  }
  
  setupGameEventListeners() {
    // Game controls
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    
    // Pause game
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.gameState === 'playing') {
        this.togglePause();
      }
    });
  }
  
  handleKeyDown(e) {
    if (this.gameState !== 'playing') return;
    
    switch(e.key.toLowerCase()) {
      case 'w':
      case 'arrowup':
        this.playerMovement.forward = true;
        break;
      case 's':
      case 'arrowdown':
        this.playerMovement.backward = true;
        break;
      case 'a':
      case 'arrowleft':
        this.playerMovement.left = true;
        break;
      case 'd':
      case 'arrowright':
        this.playerMovement.right = true;
        break;
      case ' ':
        this.playerMovement.jump = true;
        break;
      case 'shift':
        this.playerMovement.down = true;
        break;
      case 'e':
        this.handleInteraction();
        break;
    }
  }
  
  handleKeyUp(e) {
    switch(e.key.toLowerCase()) {
      case 'w':
      case 'arrowup':
        this.playerMovement.forward = false;
        break;
      case 's':
      case 'arrowdown':
        this.playerMovement.backward = false;
        break;
      case 'a':
      case 'arrowleft':
        this.playerMovement.left = false;
        break;
      case 'd':
      case 'arrowright':
        this.playerMovement.right = false;
        break;
      case ' ':
        this.playerMovement.jump = false;
        break;
      case 'shift':
        this.playerMovement.down = false;
        break;
    }
  }
  
  handleInteraction() {
    // Check if player is near a collectible
    const nearbyCrystal = this.objectives.crystals.find(crystal => 
      !crystal.collected && this.isPlayerNear(crystal)
    );
    
    if (nearbyCrystal) {
      this.collectCrystal(nearbyCrystal);
    }
  }
  
  isPlayerNear(crystal) {
    // Simple distance check (would use actual 3D positions in real implementation)
    const distance = Math.sqrt(
      Math.pow(crystal.x - this.playerPosition.x, 2) +
      Math.pow(crystal.y - this.playerPosition.y, 2) +
      Math.pow(crystal.z - this.playerPosition.z, 2)
    );
    return distance < 5; // 5 units interaction radius
  }
  
  collectCrystal(crystal) {
    crystal.collected = true;
    this.objectives.found++;
    this.score += 100;
    this.playerEnergy = Math.min(100, this.playerEnergy + 20);
    
    // Show collection effect
    this.showCollectionEffect(crystal);
    
    // Update HUD
    this.updateHUD();
    
    // Check win condition
    if (this.objectives.found >= this.objectives.total) {
      this.completeGame();
    }
  }
  
  showCollectionEffect(crystal) {
    // Create visual effect for crystal collection
    const prompt = document.getElementById('interactionPrompt');
    if (prompt) {
      prompt.textContent = `+${crystal.id} COLLECTED!`;
      prompt.classList.add('show');
      setTimeout(() => {
        prompt.classList.remove('show');
      }, 2000);
    }
  }
  
  togglePause() {
    this.isPaused = !this.isPaused;
    this.gameState = this.isPaused ? 'paused' : 'playing';
    
    // Show pause menu or resume
    if (this.isPaused) {
      this.showPauseMenu();
    } else {
      this.hidePauseMenu();
    }
  }
  
  showPauseMenu() {
    // Could show a pause menu overlay
    console.log('Game Paused');
  }
  
  hidePauseMenu() {
    // Hide pause menu
    console.log('Game Resumed');
  }
  
  startGameLoop() {
    const gameLoop = () => {
      if (this.gameState === 'playing' && !this.isPaused) {
        this.update();
      }
      
      requestAnimationFrame(gameLoop);
    };
    
    gameLoop();
  }
  
  update() {
    // Update game time
    this.gameTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
    
    // Update player position (would integrate with 3D camera)
    this.updatePlayerPosition();
    
    // Update energy drain
    this.playerEnergy = Math.max(0, this.playerEnergy - 0.01);
    
    // Update HUD
    this.updateHUD();
    
    // Check game over conditions
    if (this.playerEnergy <= 0) {
      this.gameOver(false);
    }
  }
  
  updatePlayerPosition() {
    // This would integrate with the 3D camera movement
    // For now, just track the movement state
    if (!this.playerMovement) {
      this.playerMovement = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        jump: false,
        down: false
      };
    }
    
    if (!this.playerPosition) {
      this.playerPosition = { x: 0, y: 0, z: 0 };
    }
  }
  
  updateHUD() {
    // Update objectives counter
    const objectivesCount = document.getElementById('objectivesCount');
    if (objectivesCount) {
      objectivesCount.textContent = `${this.objectives.found}/${this.objectives.total}`;
    }
    
    // Update energy bar
    const energyBar = document.getElementById('energyBar');
    if (energyBar) {
      energyBar.style.width = `${this.playerEnergy}%`;
    }
    
    // Update game timer
    const gameTimer = document.getElementById('gameTimer');
    if (gameTimer) {
      const minutes = Math.floor(this.gameTime / 60);
      const seconds = this.gameTime % 60;
      gameTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Update mini-map
    this.updateMiniMap();
  }
  
  updateMiniMap() {
    const objectiveDots = document.querySelector('.objective-dots');
    if (objectiveDots) {
      objectiveDots.innerHTML = '';
      
      this.objectives.crystals.forEach(crystal => {
        if (!crystal.collected) {
          const dot = document.createElement('div');
          dot.className = 'objective-dot';
          dot.style.cssText = `
            position: absolute;
            width: 6px;
            height: 6px;
            background: var(--accent);
            border-radius: 50%;
            top: ${50 + (crystal.z / 20)}%;
            left: ${50 + (crystal.x / 20)}%;
            box-shadow: 0 0 5px var(--accent-glow);
          `;
          objectiveDots.appendChild(dot);
        }
      });
    }
  }
  
  completeGame() {
    this.gameState = 'gameover';
    this.showGameOverScreen(true);
  }
  
  gameOver(won) {
    this.gameState = 'gameover';
    this.showGameOverScreen(won);
  }
  
  showGameOverScreen(won) {
    const gameHUD = document.getElementById('gameHUD');
    const gameOver = document.getElementById('gameOver');
    const gameContainer = document.getElementById('gameContainer');
    
    if (gameHUD) gameHUD.classList.add('hidden');
    if (gameOver) gameOver.classList.remove('hidden');
    if (gameContainer) gameContainer.classList.add('hidden');
    
    // Update final stats
    const finalTime = document.getElementById('finalTime');
    const finalObjects = document.getElementById('finalObjects');
    const finalScore = document.getElementById('finalScore');
    
    if (finalTime) {
      const minutes = Math.floor(this.gameTime / 60);
      const seconds = this.gameTime % 60;
      finalTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    if (finalObjects) {
      finalObjects.textContent = `${this.objectives.found}/${this.objectives.total}`;
    }
    
    if (finalScore) {
      finalScore.textContent = this.score;
    }
    
    // Setup game over buttons
    this.setupGameOverButtons();
  }
  
  setupGameOverButtons() {
    const playAgainBtn = document.getElementById('playAgain');
    const viewPortfolioBtn = document.getElementById('viewPortfolio');
    
    if (playAgainBtn) {
      playAgainBtn.addEventListener('click', () => {
        this.restartGame();
      });
    }
    
    if (viewPortfolioBtn) {
      viewPortfolioBtn.addEventListener('click', () => {
        this.showPortfolio();
      });
    }
  }
  
  restartGame() {
    const gameOver = document.getElementById('gameOver');
    if (gameOver) gameOver.classList.add('hidden');
    
    this.startGame();
  }
  
  showPortfolio() {
    const gameOver = document.getElementById('gameOver');
    const portfolioContent = document.getElementById('portfolioContent');
    const gameContainer = document.getElementById('gameContainer');
    
    if (gameOver) gameOver.classList.add('hidden');
    if (portfolioContent) portfolioContent.classList.remove('hidden');
    if (gameContainer) gameContainer.classList.add('hidden');
    
    this.gameState = 'portfolio';
  }
  
  showInstructions() {
    const instructionsModal = document.getElementById('instructionsModal');
    if (instructionsModal) {
      instructionsModal.classList.remove('hidden');
      this.setupModalClose();
    }
  }
  
  showSettings() {
    console.log('Settings menu would open here');
    // Could add settings like sound volume, graphics quality, etc.
  }
  
  setupModalClose() {
    const closeBtn = document.getElementById('closeInstructions');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        const instructionsModal = document.getElementById('instructionsModal');
        if (instructionsModal) {
          instructionsModal.classList.add('hidden');
        }
      });
    }
  }
}

// Initialize game when page loads
let game;

document.addEventListener('DOMContentLoaded', () => {
  game = new PortfolioGame();
});

// Export for use in other scripts
window.PortfolioGame = PortfolioGame;
