console.log("RL Agents.js: Loaded!");

class QLearningAgent {
  constructor(gridWidth, gridHeight, actions, alpha = 0.1, gamma = 0.9, epsilon = 0.2) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.actions = actions;
    this.alpha = alpha;
    this.gamma = gamma;
    this.epsilon = epsilon;
    this.qTable = {};
    this.episodeCount = 0;
    this.position = { x: 0, y: 0 };
    this.lastReward = 0;
    this._onEpisodeEnd = [];
    this._onReward = [];
    this.episodeRewards = [];
    this.currentEpisodeReward = 0;
    console.log("New Agent Made!\n\nPROPS:\n\nGrid size: Vector2(" + gridWidth + "," + gridHeight + ")\nactions: Json(" + JSON.stringify(actions) + ")\nalpha: Number(" + alpha + ")\ngamma: Number(" + gamma + ")\nepsilon: Number(" + epsilon + ")")
  }

  getStateKey(x, y) {
    return `${x},${y}`;
  }

  getQ(state, action) {
    const key = this.getStateKey(state.x, state.y);
    if (!this.qTable[key]) this.qTable[key] = {};
    if (this.qTable[key][action] === undefined) this.qTable[key][action] = 0;
    return this.qTable[key][action];
  }

  chooseAction(state) {
    if (Math.random() < this.epsilon) {
      return this.actions[Math.floor(Math.random() * this.actions.length)];
    }
    let maxQ = -Infinity;
    let bestActions = [];
    for (let action of this.actions) {
      const q = this.getQ(state, action);
      if (q > maxQ) {
        maxQ = q;
        bestActions = [action];
      } else if (q === maxQ) {
        bestActions.push(action);
      }
    }
    return bestActions[Math.floor(Math.random() * bestActions.length)];
  }

  update(state, action, reward, nextState) {
    const key = this.getStateKey(state.x, state.y);
    const maxNextQ = Math.max(...this.actions.map(a => this.getQ(nextState, a)));
    const oldQ = this.getQ(state, action);
    const newQ = oldQ + this.alpha * (reward + this.gamma * maxNextQ - oldQ);
    this.qTable[key][action] = newQ;
    this.lastReward = reward;
    this.position = { ...nextState };
    this.currentEpisodeReward += reward;
    this._onReward.forEach(cb => cb(reward, state, action, nextState));
  }

  resetEpisode() {
    this.episodeCount++;
    this.episodeRewards.push(this.currentEpisodeReward);
    this.currentEpisodeReward = 0;
    this.position = { x: 0, y: 0 };
    this._onEpisodeEnd.forEach(cb => cb(this.episodeCount));
  }

  getEpisodeCount() {
    return this.episodeCount;
  }

  getAgentPosition() {
    return { ...this.position };
  }

  getLastReward() {
    return this.lastReward;
  }

  onEpisodeEnd(callback) {
    this._onEpisodeEnd.push(callback);
  }

  onReward(callback) {
    this._onReward.push(callback);
  }

  getRewardHistory() {
    return this.episodeRewards;
  }
}
