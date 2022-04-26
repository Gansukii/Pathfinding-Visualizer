
# Pathfinding Visualizer

link for the Github page -> [Pathfinder (gansukii.github.io)](https://gansukii.github.io/Pathfinding-Visualizer/)

This is a basic pathfinding algorithm project just to show how the pathfinding algorithms work and the shortest path from two different nodes. After the animation, both start and end nodes can be dragged around to find the shortest path between them instantly, without the animation.

The source code is a mess as it is just a personal project, but it might be refactored in the future to have a cleaner code for other developers.

The process involves setTimeout() method and recursion to handle the animation properly (Using just a loop won’t make the animation appear).

The project consists of four basic algorithms to search for a specific node.

-   Dijkstra’s Algorithm
-   A* (A star) Algorithm
-   Breadth First Search
-   Depth First Search

### Dijkstra’s Algorithm

Dijkstra’s algorithm is just a basic weighted algorithm that visits all the neighboring nodes. The flow of visiting the neighbors is clockwise starting from the top. The top, bottom, left, and right neighbors have a constant weight of 10, while horizontal neighbors from the node have a weight of 14.

### A* Algorithm

A* algorithm is an improved version of Dijkstra’s algorithm because of the heuristic value that determines the distance between the end node and all the other nodes. In this way, the algorithm will search towards the direction of the end node. The weight of the neighbors is the same as with Dijkstra’s algorithm.

### Breadth First Search

Breadth first search uses the queue concept in data structures. It is unweighted which does not guarantee the shortest path. However, I managed to work it out to make it somehow weighted and get the shortest path from it. This was done by counting each successful visit around the start node that starts from the top and ends at the left side. In this way, a layer of nodes of the same weight will be created and the farther the layer is from the start node, the higher its weight would be. To get the shortest path, the process will be reversed. From the end node, the neighbor with the lowest weight will be taken and considered as the current node, and the process repeats until the start node has reached.

### Depth First Search

Depth First Search uses the stack concept in data structures. It is **unweighted** and it is difficult to find a way to get the shortest path from it because it searches in one direction until it reaches the end before switching direction.

_This project only has basic features. More Features might be added in the future._
