# RL-Agents.js

A lightweight HTML5-based JavaScript library implementing Q-Learning reinforcement learning agents for interactive grid-based environments in the browser.

## Overview

RL-Agents.js provides a simple yet powerful implementation of Q-Learning agents that can be trained to navigate grid-based environments. Perfect for educational purposes, interactive demonstrations, game AI, and reinforcement learning experiments directly in the browser.

## Features

- **Q-Learning Implementation**:  Full Q-Learning algorithm with customizable hyperparameters
- **HTML5 Canvas Support**: Visualize agent behavior in real-time
- **Grid-Based Navigation**: Support for configurable grid dimensions and custom action spaces
- **Flexible Configuration**:  Adjustable learning rate (alpha), discount factor (gamma), and exploration rate (epsilon)
- **Event Callbacks**: Built-in event system for tracking rewards and episode completion
- **Reward Tracking**: Monitor episode rewards and learning progress in real-time
- **State Management**: Efficient state tracking with position and reward history
- **Browser-Ready**: Works directly in modern web browsers with no additional dependencies

## Installation

### Direct Script Tag

Simply include `RLAgents.js` in your HTML file:

```html
<!DOCTYPE html>
<html>
<head>
    <title>RL-Agents Demo</title>
</head>
<body>
    <canvas id="canvas" width="500" height="500"></canvas>
    <script src="RLAgents.js"></script>
    <script>
        // Your training code here
    </script>
</body>
</html>
```

## Quick Start

### Creating an Agent

```javascript
const agent = new QLearningAgent(
  10,                           // Grid width
  10,                           // Grid height
  ['up', 'down', 'left', 'right'], // Available actions
  0.1,                          // Learning rate (alpha)
  0.9,                          // Discount factor (gamma)
  0.2                           // Exploration rate (epsilon)
);
```

### HTML Example with Visualization

```html
<!DOCTYPE html>
<html>
<head>
    <title>RL-Agents Grid Navigation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
        }
        canvas {
            border: 2px solid #333;
            background-color: #f0f0f0;
        }
        #stats {
            margin-top: 20px;
            font-size:  16px;
        }
    </style>
</head>
<body>
    <h1>Q-Learning Agent Navigation</h1>
    <canvas id="canvas" width="500" height="500"></canvas>
    <div id="stats">
        <p>Episode: <span id="episode">0</span></p>
        <p>Current Reward: <span id="reward">0</span></p>
    </div>

    <script src="RLAgents.js"></script>
    <script>
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const GRID_SIZE = 10;
        const CELL_SIZE = canvas.width / GRID_SIZE;

        const agent = new QLearningAgent(
            GRID_SIZE,
            GRID_SIZE,
            ['up', 'down', 'left', 'right'],
            0.1,
            0.9,
            0.2
        );

        const goal = { x: 9, y: 9 };
        let currentState = { x: 0, y: 0 };

        // Update stats when reward is received
        agent.onReward((reward) => {
            document. getElementById('reward').textContent = reward;
        });

        // Update stats when episode ends
        agent. onEpisodeEnd((episodeCount) => {
            document.getElementById('episode').textContent = episodeCount;
        });

        function drawGrid() {
            // Clear canvas
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, canvas. width, canvas.height);

            // Draw grid lines
            ctx.strokeStyle = '#ddd';
            for (let i = 0; i <= GRID_SIZE; i++) {
                ctx.beginPath();
                ctx.moveTo(i * CELL_SIZE, 0);
                ctx.lineTo(i * CELL_SIZE, canvas. height);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(0, i * CELL_SIZE);
                ctx.lineTo(canvas.width, i * CELL_SIZE);
                ctx.stroke();
            }

            // Draw goal
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(
                goal.x * CELL_SIZE + 2,
                goal.y * CELL_SIZE + 2,
                CELL_SIZE - 4,
                CELL_SIZE - 4
            );

            // Draw agent
            ctx. fillStyle = '#ff0000';
            ctx.fillRect(
                currentState.x * CELL_SIZE + 5,
                currentState.y * CELL_SIZE + 5,
                CELL_SIZE - 10,
                CELL_SIZE - 10
            );
        }

        function simulateStep() {
            const action = agent.chooseAction(currentState);
            let nextState = { ... currentState };

            // Apply action to state
            switch (action) {
                case 'up':
                    nextState.y = Math.max(0, nextState.y - 1);
                    break;
                case 'down':
                    nextState. y = Math.min(GRID_SIZE - 1, nextState.y + 1);
                    break;
                case 'left':
                    nextState. x = Math.max(0, nextState.x - 1);
                    break;
                case 'right':
                    nextState.x = Math.min(GRID_SIZE - 1, nextState.x + 1);
                    break;
            }

            // Calculate reward
            const reward = (nextState.x === goal.x && nextState.y === goal. y)
                ? 100
                :  -0.1;

            agent.update(currentState, action, reward, nextState);
            currentState = nextState;

            drawGrid();
            requestAnimationFrame(simulateStep);
        }

        // Start training
        drawGrid();
        simulateStep();
    </script>
</body>
</html>
```

## API Reference

### Constructor

```javascript
new QLearningAgent(gridWidth, gridHeight, actions, alpha = 0.1, gamma = 0.9, epsilon = 0.2)
```

**Parameters:**
- `gridWidth` (number): Width of the environment grid
- `gridHeight` (number): Height of the environment grid
- `actions` (array): Available actions the agent can take
- `alpha` (number): Learning rate (0-1) - how quickly the agent learns
- `gamma` (number): Discount factor (0-1) - importance of future rewards
- `epsilon` (number): Exploration rate (0-1) - probability of random action

### Methods

#### `chooseAction(state)`
Selects an action based on the current state using epsilon-greedy policy.

**Parameters:**
- `state`: Current state object with `x` and `y` properties

**Returns:** Selected action from the actions array

#### `update(state, action, reward, nextState)`
Updates the Q-table based on the agent's experience.

**Parameters:**
- `state`: Current state (object with x, y coordinates)
- `action`: Action taken
- `reward`: Reward received
- `nextState`: Resulting state

#### `resetEpisode()`
Resets the agent for a new episode and records statistics.

#### `getAgentPosition()`
Returns the agent's current position.

**Returns:** `{ x: number, y: number }`

#### `getLastReward()`
Returns the last reward received.

**Returns:** number

#### `getEpisodeCount()`
Returns the total number of episodes completed.

**Returns:** number

#### `getRewardHistory()`
Returns array of cumulative rewards for each completed episode.

**Returns:** array of numbers

#### `onReward(callback)`
Registers a callback function called whenever the agent receives a reward.

**Callback signature:** `(reward, state, action, nextState) => void`

#### `onEpisodeEnd(callback)`
Registers a callback function called when an episode ends.

**Callback signature:** `(episodeCount) => void`

## Interactive Demo

Create an interactive HTML5 canvas visualization:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Interactive RL Demo</title>
    <style>
        body { 
            font-family: Arial; 
            text-align: center;
        }
        button {
            padding: 10px 20px;
            font-size: 16px;
            margin: 10px;
        }
        canvas {
            border: 1px solid black;
        }
    </style>
</head>
<body>
    <h1>Q-Learning Agent Training</h1>
    <canvas id="myCanvas" width="400" height="400"></canvas>
    <br/>
    <button onclick="startTraining()">Start Training</button>
    <button onclick="stopTraining()">Stop</button>
    <p>Episode: <span id="ep">0</span> | Reward: <span id="rwd">0</span></p>
    
    <script src="RLAgents.js"></script>
    <script>
        let isTraining = false;
        const agent = new QLearningAgent(5, 5, ['up', 'down', 'left', 'right']);
        
        function startTraining() {
            isTraining = true;
            trainAgent();
        }
        
        function stopTraining() {
            isTraining = false;
        }
        
        function trainAgent() {
            if (!isTraining) return;
            
            let state = { x: 0, y: 0 };
            for (let step = 0; step < 20; step++) {
                const action = agent.chooseAction(state);
                let nextState = { ... state };
                
                // Apply action
                if (action === 'right') nextState.x++;
                if (action === 'left') nextState.x--;
                if (action === 'down') nextState.y++;
                if (action === 'up') nextState.y--;
                
                const reward = (nextState.x === 4 && nextState.y === 4) ? 1 : -0.01;
                agent.update(state, action, reward, nextState);
                state = nextState;
            }
            
            agent.resetEpisode();
            document.getElementById('ep').innerText = agent.getEpisodeCount();
            
            requestAnimationFrame(trainAgent);
        }
    </script>
</body>
</html>
```

## Parameters Explained

### Alpha (Learning Rate)
- **Range**:  0 to 1
- **Effect**: Controls how much new information overrides old information
- **High value** (0.9): Agent learns quickly but may be unstable
- **Low value** (0.1): Agent learns slowly but more steadily
- **Typical value**: 0.1 - 0.3

### Gamma (Discount Factor)
- **Range**: 0 to 1
- **Effect**: How much importance is given to future rewards
- **High value** (0.9): Agent considers long-term rewards
- **Low value** (0.1): Agent focuses on immediate rewards
- **Typical value**: 0.8 - 0.99

### Epsilon (Exploration Rate)
- **Range**: 0 to 1
- **Effect**:  Probability of taking random actions vs. best-known action
- **High value** (0.5): More exploration, discovers new strategies
- **Low value** (0.1): More exploitation, uses learned strategies
- **Typical value**: 0.1 - 0.3 (often decayed over time)

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with HTML5 Canvas support

## Use Cases

- **Interactive Educational Tools**: Teaching reinforcement learning concepts
- **Game AI**: Training agents for grid-based games
- **Robot Navigation Simulation**:  Simulating pathfinding in constrained environments
- **Optimization Problems**: Finding optimal policies for grid-based problems
- **Real-time Visualization**: Watching agents learn in real-time

## License

Licensed under the Apache License 2.0. See [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

---

**Created by vividquack**
