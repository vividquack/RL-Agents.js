# RL Agents

## Introduction
This repository contains various Reinforcement Learning (RL) agents implemented in JavaScript.

## Getting Started
To use the agents in your project, include the following CDN link in your HTML file:

```html
<script src="https://cdn.jsdelivr.net/gh/vividquack/RL-Agents.js/RLAgents.js"></script>
```

## Example Usage
Here’s a simple example to demonstrate how you can set up an RL agent with ThreeJs:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>RL Agents - Q Learning Grid</title>
  <style>
    body { margin: 0; overflow: hidden; background: #111; font-family: sans-serif; }
    canvas { display: block; }
    #overlay {
      position: absolute;
      top: 10px;
      left: 10px;
      color: #fff;
      background: rgba(0,0,0,0.5);
      padding: 10px 15px;
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.5;
    }

  </style>
  <script src="https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.min.js"></script>
  <!-- RL Agents Library -->
  <script src="https://cdn.jsdelivr.net/gh/vividquack/RL-Agents.js/RLAgents.js"></script>
</head>
<body>
  <div id="overlay">
    <div>Episode: <span id="ep">0</span></div>
    <div>Position: <span id="pos">0,0</span></div>
    <div>Reward: <span id="rew">0</span></div>
  </div>
  
  <!-- Implementation -->
  <script type="text/javascript">
    const width = 10, height = 10;
    const goal = { x: 9, y: 9 };
    const agent = new QLearningAgent(width, height, ['up', 'down', 'left', 'right']);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const grid = [];
    const cellSize = 1;
    const agentMesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
    scene.add(agentMesh);

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const geometry = new THREE.PlaneGeometry(cellSize, cellSize);
        const material = new THREE.MeshBasicMaterial({ color: (x === goal.x && y === goal.y) ? 0xffff00 : 0x333333, side: THREE.DoubleSide });
        const cell = new THREE.Mesh(geometry, material);
        cell.rotation.x = -Math.PI / 2;
        cell.position.set(x, 0, y);
        scene.add(cell);
        grid.push(cell);
      }
    }

    camera.position.set(width / 2, 15, height / 2);
    camera.lookAt(width / 2, 0, height / 2);

    let current = { x: 0, y: 0 };

    const epEl = document.getElementById("ep");
    const posEl = document.getElementById("pos");
    const rewEl = document.getElementById("rew");

    agent.onEpisodeEnd(ep => {
      epEl.textContent = ep;
    });

    agent.onReward((reward, from, action, to) => {
      rewEl.textContent = reward.toFixed(2);
      posEl.textContent = `${to.x},${to.y}`;
    });

    function step() {
      const action = agent.chooseAction(current);
      const next = { x: current.x, y: current.y };
      if (action === 'up') next.y = Math.max(0, next.y - 1);
      if (action === 'down') next.y = Math.min(height - 1, next.y + 1);
      if (action === 'left') next.x = Math.max(0, next.x - 1);
      if (action === 'right') next.x = Math.min(width - 1, next.x + 1);

      const reward = (next.x === goal.x && next.y === goal.y) ? 1 : -0.01;
      agent.update(current, action, reward, next);

      if (reward === 1) {
        agent.resetEpisode();
        current = { x: 0, y: 0 };
      } else {
        current = next;
      }

      agentMesh.position.set(current.x, 0.5, current.y);
      renderer.render(scene, camera);
    }
    						

    function animate() {
      step();
      requestAnimationFrame(animate);
    }

    animate();
  </script>
</body>
</html>
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing
Feel free to contribute by creating pull requests or opening issues.
