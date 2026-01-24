# RL Agents.js

A lightweight, easy-to-use Reinforcement Learning library for JavaScript. Implement AI agents that learn and adapt to their environment using proven RL algorithms.

## Features

- **Multiple Algorithms**: Support for Q-Learning and SARSA algorithms
- **Simple API**: Easy-to-use interface for creating and training agents
- **Event Callbacks**: Track agent behavior with callbacks for rewards and episodes
- **No Dependencies**: Pure JavaScript, works in browsers and Node.js
- **Real-time Visualization**: Interactive examples with live training visualization
- **Grid-Based Environment**: Perfect for grid-world problems and pathfinding tasks

## Installation

### Via CDN (Recommended for Browser)
```html
<script src="https://cdn.jsdelivr.net/gh/vividquack/RL-Agents.js/RLAgents.js"></script>
```

### Via npm (Coming Soon)
```bash
npm install rl-agents-js
```

## Quick Start

```javascript
// Create an agent
const agent = new RLAgent(
  10,                              // grid width
  10,                              // grid height
  ['up', 'down', 'left', 'right'], // available actions
  0.1,                             // learning rate (alpha)
  0.9,                             // discount factor (gamma)
  0.2,                             // exploration rate (epsilon)
  'qlearning'                      // algorithm: 'qlearning' or 'sarsa'
);

// Train for one episode
let state = { x: 0, y: 0 };
let action = agent.chooseAction(state);

for (let step = 0; step < 100; step++) {
  const nextState = moveAgent(state, action);
  const reward = getReward(nextState);
  const nextAction = agent.chooseAction(nextState);
  
  agent.update(state, action, reward, nextState, nextAction);
  
  state = nextState;
  action = nextAction;
}

agent.resetEpisode();
```

## API Reference

### Constructor

```javascript
new RLAgent(gridWidth, gridHeight, actions, alpha, gamma, epsilon, algorithm)
```

**Parameters:**
- `gridWidth` (number): Width of the grid environment
- `gridHeight` (number): Height of the grid environment
- `actions` (array): Array of action strings (e.g., `['up', 'down', 'left', 'right']`)
- `alpha` (number, default: 0.1): Learning rate (0-1). Controls how much new information overrides old
- `gamma` (number, default: 0.9): Discount factor (0-1). Balance between immediate and future rewards
- `epsilon` (number, default: 0.2): Exploration rate (0-1). Probability of random action vs best learned action
- `algorithm` (string, default: 'qlearning'): Learning algorithm - `'qlearning'` or `'sarsa'`

### Methods

#### `chooseAction(state)`
Select an action based on current state using epsilon-greedy strategy.

```javascript
const action = agent.chooseAction({ x: 5, y: 3 });
```

**Parameters:**
- `state` (object): Current state with `x` and `y` properties

**Returns:** Selected action (string)

#### `update(state, action, reward, nextState, nextAction)`
Update the Q-table based on the transition and reward.

```javascript
agent.update(
  { x: 5, y: 3 },     // current state
  'up',                // action taken
  -1,                  // reward received
  { x: 5, y: 2 },     // next state
  'right'              // next action (for SARSA)
);
```

**Parameters:**
- `state` (object): Current state
- `action` (string): Action taken
- `reward` (number): Reward received
- `nextState` (object): Resulting state
- `nextAction` (string): Next action (used for SARSA, can be null for Q-Learning)

#### `resetEpisode()`
End the current episode and reset the agent position.

```javascript
agent.resetEpisode();
```

#### `getAgentPosition()`
Get the agent's current position.

```javascript
const pos = agent.getAgentPosition(); // { x: 5, y: 3 }
```

**Returns:** Object with `x` and `y` properties

#### `getEpisodeCount()`
Get the total number of completed episodes.

```javascript
const episodes = agent.getEpisodeCount();
```

**Returns:** Number of episodes

#### `getLastReward()`
Get the reward from the last step.

```javascript
const reward = agent.getLastReward();
```

**Returns:** Last reward value

#### `getRewardHistory()`
Get array of total rewards for each completed episode.

```javascript
const history = agent.getRewardHistory(); // [15, 42, 87, ...]
```

**Returns:** Array of episode rewards

### Event Callbacks

#### `onEpisodeEnd(callback)`
Register a callback when an episode ends.

```javascript
agent.onEpisodeEnd((episodeNumber) => {
  console.log(`Episode ${episodeNumber} completed`);
});
```

#### `onReward(callback)`
Register a callback when a reward is received.

```javascript
agent.onReward((reward, state, action, nextState) => {
  console.log(`Received ${reward} moving from`, state, 'via', action);
});
```

#### `onStep(callback)`
Register a callback for each position update (useful for visualization).

```javascript
agent.onStep((position) => {
  updateVisualization(position);
});
```

## Algorithms Explained

### Q-Learning
An off-policy algorithm that learns the optimal policy while following an exploratory policy.

**Update Rule:**
```
Q(s,a) = Q(s,a) + α[r + γ max Q(s',a') - Q(s,a)]
```

**Pros:**
- Converges to optimal policy
- Off-policy learning allows exploration

**Cons:**
- Can be slower in stochastic environments

### SARSA (State-Action-Reward-State-Action)
An on-policy algorithm that learns while following the actual policy.

**Update Rule:**
```
Q(s,a) = Q(s,a) + α[r + γ Q(s',a') - Q(s,a)]
```

**Pros:**
- More conservative, accounts for exploration
- Better for environments with penalties

**Cons:**
- May converge to suboptimal policy

## Examples

### Interactive 2D Grid Training

The repository includes an interactive example that trains two agents (Q-Learning and SARSA) side-by-side on a 2D grid navigation task.

**Features:**
- Real-time visualization of agent movement
- Live learning curves showing progress
- Auto-training with progress indicator
- Compare two different algorithms side-by-side

**To Run:**
1. Open `examples/2D.html` in a web browser
2. Click "Auto-Train 100 Episodes" to start training
3. Watch both agents learn to navigate from (0,0) to (4,4)
4. View the reward curves update in real-time

### Basic Grid Navigation

```javascript
const width = 5, height = 5;
const goal = { x: 4, y: 4 };
const obstacles = [{ x: 2, y: 2 }];

const agent = new RLAgent(width, height, ['up', 'down', 'left', 'right'], 0.1, 0.9, 0.2, 'qlearning');

// Track progress
agent.onEpisodeEnd((ep) => {
  const history = agent.getRewardHistory();
  console.log(`Episode ${ep}: Total Reward = ${history[history.length - 1]}`);
});

// Training loop
for (let episode = 0; episode < 100; episode++) {
  let state = { x: 0, y: 0 };
  let action = agent.chooseAction(state);
  
  for (let step = 0; step < 100; step++) {
    // Move agent
    const nextState = { ...state };
    if (action === 'up') nextState.y = Math.max(0, state.y - 1);
    if (action === 'down') nextState.y = Math.min(height - 1, state.y + 1);
    if (action === 'left') nextState.x = Math.max(0, state.x - 1);
    if (action === 'right') nextState.x = Math.min(width - 1, state.x + 1);
    
    // Calculate reward
    let reward = -1; // step cost
    if (obstacles.some(o => o.x === nextState.x && o.y === nextState.y)) {
      reward = -10; // obstacle penalty
    }
    if (nextState.x === goal.x && nextState.y === goal.y) {
      reward = 100; // goal reward
    }
    
    // Update agent
    const nextAction = agent.chooseAction(nextState);
    agent.update(state, action, reward, nextState, nextAction);
    
    state = nextState;
    action = nextAction;
    
    if (reward === 100) break; // reached goal
  }
  
  agent.resetEpisode();
}
```

## Parameters Guide

### Learning Rate (Alpha)
- **Range:** 0 to 1
- **Low values (0.01-0.1):** Conservative learning, smooth training curves
- **High values (0.5-1.0):** Aggressive learning, faster but less stable

### Discount Factor (Gamma)
- **Range:** 0 to 1
- **Low values (0.1-0.5):** Focus on immediate rewards
- **High values (0.9-0.99):** Focus on long-term rewards

### Exploration Rate (Epsilon)
- **Range:** 0 to 1
- **Low values (0.05-0.1):** Exploit learned knowledge
- **High values (0.3-0.5):** Explore more alternatives

### Epsilon Decay
For best results, gradually reduce epsilon during training to shift from exploration to exploitation:

```javascript
const initialEpsilon = 0.5;
const minEpsilon = 0.01;
const decayRate = 0.995;

let epsilon = initialEpsilon;
for (let episode = 0; episode < 1000; episode++) {
  agent.epsilon = epsilon;
  // ... train episode ...
  epsilon = Math.max(minEpsilon, epsilon * decayRate);
}
```

## Tips for Training

1. **Start with simple environments** - Begin with small grids (5x5) before scaling up
2. **Balance parameters** - Higher learning rate needs lower epsilon, and vice versa
3. **Use reward shaping** - Design rewards to guide the agent (negative for steps, positive for goals)
4. **Monitor progress** - Track reward history to detect convergence
5. **Try both algorithms** - Q-Learning and SARSA perform differently in various environments
6. **Adjust exploration** - Reduce epsilon gradually to shift from exploration to exploitation

## Performance Comparison

| Algorithm | Convergence | Stability | Optimal Policy | Exploration |
|-----------|-------------|-----------|---|---|
| Q-Learning | Slower | Less stable | ✓ Yes | Better |
| SARSA | Faster | More stable | ✗ Conservative | Limited |

## Browser Compatibility

- Chrome/Edge: ✓ Full support
- Firefox: ✓ Full support
- Safari: ✓ Full support
- IE 11: Requires transpilation

## Contributing

Contributions are welcome! Please feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

Areas for contribution:
- New algorithms (Actor-Critic, Policy Gradient, etc.)
- Additional examples
- Performance optimizations
- Documentation improvements

## License

Apache 2.0 License - see [LICENSE](LICENSE) file for details.

## Changelog

### v1.0.0 (Current)
- Initial release
- Q-Learning algorithm
- SARSA algorithm
- Interactive 2D grid example
- Full API documentation

## Related Projects

- [OpenAI Gym](https://github.com/openai/gym) - RL benchmarking environments
- [TensorFlow.js](https://www.tensorflow.org/js) - Deep learning in JavaScript
- [Brain.js](https://github.com/BrainJS/brain.js) - Neural networks for JavaScript

## Support

For issues, questions, or suggestions:
1. Check existing [GitHub Issues](https://github.com/vividquack/RL-Agents.js/issues)
2. Create a new issue with detailed description
3. Include example code if reporting a bug

---

**Happy Learning! 🤖**
