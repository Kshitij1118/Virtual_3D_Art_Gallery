// Main Gallery Class
class VirtualArtGallery {
  constructor() {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0xffffff, 50, 200);
    
    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 10, 30);
    
    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(0xffffff);
    document.getElementById("container").appendChild(this.renderer.domElement);
    
    // Movement variables
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveUp = false;
    this.moveDown = false;
    this.isRunning = false;
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    
    // Settings
    this.moveSpeed = 50;
    this.runMultiplier = 2;
    
    // Controls
    this.controls = null;
    this.isPointerLocked = false;
    
    // Clock for animation
    this.clock = new THREE.Clock();
    
    // Initialize the gallery
    this.init();
  }
  
  init() {
    // Create gallery structure
    this.createGallery();
    
    // Create lighting
    this.createLighting();
    
    // Create artworks
    this.createArtworks();
    
    // Create welcome message
    this.createWelcomeMessage();
    
    // Setup controls
    this.setupControls();
    
    // Event listeners
    this.setupEventListeners();
    
    // Hide loading screen
    document.getElementById("loading").style.opacity = 0;
    setTimeout(() => {
      document.getElementById("loading").style.display = "none";
    }, 500);
    
    // Start animation loop
    this.animate();
  }
  
  createGallery() {
    // Remove the floor creation code
    
    // Walls
    this.createWalls();
    
    // Keep ceiling but make it more transparent
    const ceilingGeometry = new THREE.PlaneGeometry(200, 200);
    const ceilingMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,  // More transparent
    });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 25;
    this.scene.add(ceiling);
  }
  
  createWalls() {
    const wallMaterial = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
    });

    const frontWallMaterial = new THREE.MeshLambertMaterial({
      color: 0xFF0000, // Light blue color
      transparent: true,
      opacity: 0.95,
    });
    
    const walls = [
      // Main room walls
      { pos: [0, 12.5, -50], rot: [0, 0, 0], size: [100, 25, 2], material: frontWallMaterial },
      { pos: [0, 12.5, 50], rot: [0, 0, 0], size: [100, 25, 2], material: wallMaterial },
      { pos: [-50, 12.5, 0], rot: [0, Math.PI / 2, 0], size: [100, 25, 2], material: wallMaterial },
      { pos: [50, 12.5, 0], rot: [0, Math.PI / 2, 0], size: [100, 25, 2], material: wallMaterial }
    ];
    
    walls.forEach((wall) => {
      const geometry = new THREE.BoxGeometry(...wall.size);
      const mesh = new THREE.Mesh(geometry, wall.material);
      mesh.position.set(...wall.pos);
      mesh.rotation.set(...wall.rot);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    });
  }
  
  createLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);
    
    // Spot lights for artwork
    const spotLights = [
      { pos: [-30, 20, -40], target: [-30, 10, -45] },
      { pos: [30, 20, -40], target: [30, 10, -45] },
      { pos: [-40, 20, -10], target: [-45, 10, -10] },
      { pos: [40, 20, 10], target: [45, 10, 10] },
      { pos: [-30, 20, 40], target: [-30, 10, 45] },
      { pos: [30, 20, 40], target: [30, 10, 45] },
    ];
    
    spotLights.forEach((light) => {
      const spotLight = new THREE.SpotLight(0xffffff, 1.2, 100, Math.PI / 6, 0.5);
      spotLight.position.set(...light.pos);
      spotLight.target.position.set(...light.target);
      spotLight.castShadow = true;
      spotLight.shadow.mapSize.width = 1024;
      spotLight.shadow.mapSize.height = 1024;
      this.scene.add(spotLight);
      this.scene.add(spotLight.target);
    });
    
    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 50, 0);
    this.scene.add(directionalLight);
  }
  
  createArtworks() {
    const artworks = [
      {
        pos: [-30, 15, -48],
        size: [12, 16],
        image: "https://picsum.photos/800/1000?random=1",
        title: "Abstract Harmony",
        artist: "Emma Johnson",
        year: "2022"
      },
      {
        pos: [30, 15, -48],
        size: [12, 16],
        image: "https://picsum.photos/800/1000?random=2",
        title: "Urban Dreams",
        artist: "Carlos Mendez",
        year: "2021"
      },
      {
        pos: [-48, 15, -10],
        size: [16, 12],
        image: "https://picsum.photos/1000/800?random=3",
        title: "Ocean Memories",
        artist: "Sophie Chen",
        year: "2020"
      },
      {
        pos: [-48, 15, 10],
        size: [16, 12],
        image: "https://picsum.photos/1000/800?random=12",
        title: "Mountain Stream",
        artist: "Alex Rivera",
        year: "2023"
      },
      {
        pos: [48, 15, -10],
        size: [16, 12],
        image: "https://picsum.photos/1000/800?random=4",
        title: "Mountain Echo",
        artist: "James Wilson",
        year: "2019"
      },
      {
        pos: [48, 15, 10],
        size: [16, 12],
        image: "https://picsum.photos/1000/800?random=13",
        title: "Urban Night",
        artist: "Maria Garcia",
        year: "2022"
      },
      {
        pos: [-30, 15, 48],
        size: [14, 18],
        image: "https://picsum.photos/800/1000?random=5",
        title: "Golden Sunset",
        artist: "Aisha Patel",
        year: "2023"
      },
      {
        pos: [30, 15, 48],
        size: [14, 18],
        image: "https://picsum.photos/800/1000?random=6",
        title: "Winter Solitude",
        artist: "David Kim",
        year: "2018"
      }
    ];
    
    artworks.forEach((artwork) => {
      // Frame
     /*  const frameGeometry = new THREE.BoxGeometry(
        artwork.size[0] + 2,
        artwork.size[1] + 2,
        1
      );
      const frameMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
      const frame = new THREE.Mesh(frameGeometry, frameMaterial);
      frame.position.set(...artwork.pos);
      frame.castShadow = true;
      this.scene.add(frame); */
      
      // Artwork
      const artGeometry = new THREE.PlaneGeometry(
        artwork.size[0],
        artwork.size[1]
      );
      const textureLoader = new THREE.TextureLoader();
      const artMaterial = new THREE.MeshLambertMaterial({
        map: textureLoader.load(artwork.image),
      });
      const art = new THREE.Mesh(artGeometry, artMaterial);
      art.position.set(artwork.pos[0], artwork.pos[1], artwork.pos[2] + 0.6);
      
      // Face the artwork towards the center
      if (artwork.pos[2] > 0) art.rotation.y = Math.PI;
      if (artwork.pos[0] < 0 && Math.abs(artwork.pos[2]) < 30)
        art.rotation.y = Math.PI / 2;
      if (artwork.pos[0] > 0 && Math.abs(artwork.pos[2]) < 30)
        art.rotation.y = -Math.PI / 2;
      
      this.scene.add(art);
      
      // Create artwork label
      this.createArtworkLabel(artwork);
    });
  }
  
  createArtworkLabel(artwork) {
    const label = document.createElement('div');
    label.className = 'artwork-label';
    label.innerHTML = `
      <strong>${artwork.title}</strong><br>
      ${artwork.artist}, ${artwork.year}
    `;
    document.getElementById('container').appendChild(label);
    
    // Position label in 3D space
    this.artworkLabels = this.artworkLabels || [];
    this.artworkLabels.push({
      element: label,
      position: new THREE.Vector3(...artwork.pos).add(new THREE.Vector3(0, artwork.size[1]/2 + 1, 0))
    });
  }
  
  createWelcomeMessage() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 1400;
    canvas.height = 256;
    
    // Set background
    context.fillStyle = 'rgba(0, 0, 0, 0.2)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set text style
    context.font = 'bold 80px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // Draw text
    context.fillText('Welcome to 3D Virtual Art Gallery', canvas.width/2, canvas.height/2 - 40);
    context.font = 'bold 60px Arial';
    context.fillText('by Kshitij Singh', canvas.width/2, canvas.height/2 + 40);
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    
    // Create plane geometry
    const geometry = new THREE.PlaneGeometry(30, 7.5);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.9
    });
    
    // Create mesh
    const welcomeSign = new THREE.Mesh(geometry, material);
    welcomeSign.position.set(0, 20, -45);
    this.scene.add(welcomeSign);
  }
  
  setupControls() {
    // Use PointerLockControls for better first-person controls
    this.controls = new THREE.PointerLockControls(this.camera, document.body);
    
    // Click to lock pointer
    this.renderer.domElement.addEventListener('click', () => {
      if (!this.isPointerLocked) {
        this.controls.lock();
      }
    });
  }
  
  setupEventListeners() {
    // Pointer lock change
    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement === document.body;
      document.body.classList.toggle('pointer-lock', this.isPointerLocked);
    });
    
    // Keyboard controls
    document.addEventListener('keydown', (event) => this.onKeyDown(event));
    document.addEventListener('keyup', (event) => this.onKeyUp(event));
    
    // Window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }
  
  onKeyDown(event) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        this.moveForward = true;
        break;
      case 'ArrowLeft':
      case 'KeyA':
        this.moveLeft = true;
        break;
      case 'ArrowDown':
      case 'KeyS':
        this.moveBackward = true;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.moveRight = true;
        break;
      case 'Space':
        this.moveUp = true;
        event.preventDefault();
        break;
      case 'KeyC':
        this.moveDown = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.isRunning = true;
        break;
    }
  }
  
  onKeyUp(event) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        this.moveForward = false;
        break;
      case 'ArrowLeft':
      case 'KeyA':
        this.moveLeft = false;
        break;
      case 'ArrowDown':
      case 'KeyS':
        this.moveBackward = false;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.moveRight = false;
        break;
      case 'Space':
        this.moveUp = false;
        break;
      case 'KeyC':
        this.moveDown = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.isRunning = false;
        break;
    }
  }
  
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  updateMovement(delta) {
    this.velocity.x -= this.velocity.x * 10.0 * delta;
    this.velocity.z -= this.velocity.z * 10.0 * delta;
    this.velocity.y -= this.velocity.y * 10.0 * delta;
    
    this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
    this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
    this.direction.y = Number(this.moveUp) - Number(this.moveDown);
    this.direction.normalize();
    
    const speed = this.moveSpeed * (this.isRunning ? this.runMultiplier : 1);
    
    if (this.moveForward || this.moveBackward) this.velocity.z -= this.direction.z * speed * delta;
    if (this.moveLeft || this.moveRight) this.velocity.x -= this.direction.x * speed * delta;
    if (this.moveUp || this.moveDown) this.velocity.y += this.direction.y * speed * delta;
    
    // Store current position for collision detection
    const oldPosition = this.camera.position.clone();
    
    // Move in the direction the camera is facing
    if (this.controls && this.controls.isLocked) {
      this.controls.moveRight(-this.velocity.x * delta);
      this.controls.moveForward(-this.velocity.z * delta);
      this.camera.position.y += this.velocity.y * delta;
    }
    
    // Collision detection with walls
    const cameraPos = this.camera.position;
    const wallBuffer = 2; // Distance to keep from walls
    
    // Check boundaries
    if (cameraPos.x < -48 + wallBuffer) cameraPos.x = -48 + wallBuffer;
    if (cameraPos.x > 48 - wallBuffer) cameraPos.x = 48 - wallBuffer;
    if (cameraPos.z < -48 + wallBuffer) cameraPos.z = -48 + wallBuffer;
    if (cameraPos.z > 48 - wallBuffer) cameraPos.z = 48 - wallBuffer;
    
    // Keep camera above ground and below ceiling
    if (cameraPos.y < 2) cameraPos.y = 2;
    if (cameraPos.y > 23) cameraPos.y = 23;
    
    // Update position display
    const pos = this.camera.position;
    document.getElementById('position').textContent = `${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)}`;
  }
  
  updateLabels() {
    if (!this.artworkLabels) return;
    
    this.artworkLabels.forEach(label => {
      // Convert 3D position to 2D screen position
      const vector = label.position.clone().project(this.camera);
      
      // Calculate screen coordinates
      const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
      const y = (vector.y * -0.5 + 0.5) * window.innerHeight;
      
      // Position the label
      label.element.style.left = `${x}px`;
      label.element.style.top = `${y}px`;
      
      // Calculate distance to artwork
      const distance = this.camera.position.distanceTo(label.position);
      
      // Show/hide based on distance and visibility
      const isVisible = distance < 30 && vector.z > 0 && vector.z < 1;
      label.element.style.opacity = isVisible ? '1' : '0';
    });
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    const delta = this.clock.getDelta();
    
    // Update movement if controls are locked
    if (this.controls && this.controls.isLocked) {
      this.updateMovement(delta);
    }
    
    // Update artwork labels
    this.updateLabels();
    
    // Render scene
    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize the gallery when the page loads
window.addEventListener('load', () => {
  const gallery = new VirtualArtGallery();
});