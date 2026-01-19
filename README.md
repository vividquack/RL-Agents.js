# RL Agents

## Introduction
This repository contains various Reinforcement Learning (RL) agents implemented in JavaScript.

## Getting Started
To use the agents in your project, include the following CDN link in your HTML file:

```html
<script src="https://cdn.jsdelivr.net/gh/vividquack/RL-Agents.js@main/dist/RL-Agents.js"></script>
```

## Example Usage
Here’s a simple example to demonstrate how you can set up an RL agent:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RL Agent Example</title>
    <script src="https://cdn.jsdelivr.net/gh/vividquack/RL-Agents.js@main/dist/RL-Agents.js"></script>
</head>
<body>
    <h1>Reinforcement Learning Agent</h1>
    <script>
        // Example of initializing an RL agent
        const agent = new RL.Agents.QLearningAgent();
        // Your RL setup code here
    </script>
</body>
</html>
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing
Feel free to contribute by creating pull requests or opening issues.