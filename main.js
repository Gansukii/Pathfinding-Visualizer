const nodeContainer = document.getElementById("nodeContainer");
const btnClear = document.getElementById("btnClear");
const btnStart = document.getElementById("btnStart");
const btnWall = document.getElementById("btnWall");
const btnRemoveWall = document.getElementById("btnRemoveWall");
let isWall = false;
let isRemoveWall = false;
let isMouseDown = false;
let startSelected = false;
let lastSelected = false;
let isProcessing = false;
let isProcessDone = false;
let isNoPath = false;
let startNode = document.createElement("div");
let endNode = document.createElement("div");
let nodesArr = [];
let visitedArr = [];
let path = [];

const createNode = (row, col) => {
  const div = document.createElement("div");
  div.classList.add("node");
  const coord = row + "," + col;
  div.setAttribute("coord", coord);
  div.onclick = () => {
    if (!startSelected) {
      startNode = div;
      div.classList.add("start");
      startSelected = true;
      lastSelected = false;
    } else if (!lastSelected && startSelected) {
      div.classList.add("end");
      endNode = div;
      btnStart.removeAttribute("disabled");
      btnRemoveWall.removeAttribute("disabled");
      btnWall.removeAttribute("disabled");
      lastSelected = true;
    }
  };
  div.onmousedown = () => {
    isMouseDown = true;
    if (isWall && div !== startNode && div !== endNode) {
      div.classList.add("wall");
    }
    if (isRemoveWall && div !== startNode && div !== endNode) {
      div.classList.remove("wall");
    }
  };
  div.onmouseup = () => {
    isMouseDown = false;
  };
  div.onmouseover = () => {
    if (isMouseDown && isWall && div !== startNode && div !== endNode) {
      div.classList.add("wall");
    }
    if (isMouseDown && isRemoveWall && div !== startNode && div !== endNode) {
      div.classList.remove("wall");
    }
  };

  nodeContainer.appendChild(div);
  return div;
};

const startProgram = () => {
  nodesArr = [];
  let tempArr = [];
  let rowCount = 0;
  for (let i = 0; i < 720; i++) {
    const node = createNode(rowCount, i % 40);
    tempArr.push(node);
    if ((i + 1) % 40 == 0) {
      nodesArr.push(tempArr);
      rowCount++;
      tempArr = [];
    }
  }
};

const startBF = () => {
  let [row, column] = startNode.getAttribute("coord").split(",");
  visitedArr = [];
  let pathQueue = [];
  pathQueue.push(startNode.getAttribute("coord"));

  while (0) {
    const currentCoord = pathQueue.shift();
    [row, column] = currentCoord.split(",");
    const node = nodesArr[row][column];

    if (endNode == node) return node;
    if (visitedArr.includes(node.getAttribute("coord"))) continue;

    visitedArr.push(currentCoord);

    if (startNode !== node) {
      node.classList.add("visited");
    }

    pathQueue.push(startNode.getAttribute("coord"));

    let [top, bottom, left, right] = [null, null, null, null];

    if (row > 0) {
      top = parseInt(row) - 1 + "," + column;
    }
    if (row < 14) {
      bottom = parseInt(row) + 1 + "," + column;
    }
    if (column > 0) {
      left = row + "," + (parseInt(column) - 1);
    }
    if (column < 19) {
      right = row + "," + (parseInt(column) + 1);
    }

    if (top !== null && !visitedArr.includes(top)) {
      pathQueue.push(top);
    }
    if (bottom !== null && !visitedArr.includes(bottom)) {
      pathQueue.push(bottom);
    }
    if (left !== null && !visitedArr.includes(left)) {
      pathQueue.push(left);
    }
    if (right !== null && !visitedArr.includes(right)) {
      pathQueue.push(right);
    }
  }

  const iter = () => {
    setTimeout(() => {
      const currentCoord = pathQueue.shift();
      [row, column] = currentCoord.split(",");
      const node = nodesArr[row][column];

      if (endNode !== node) {
        if (visitedArr.includes(node.getAttribute("coord"))) {
          iter();
          return;
        }

        visitedArr.push(currentCoord);

        if (startNode !== node) {
          node.classList.add("visited");
        }
        pathQueue.push(startNode.getAttribute("coord"));

        let [top, bottom, left, right] = [null, null, null, null];

        if (row > 0) {
          top = parseInt(row) - 1 + "," + column;
        }
        if (row < 14) {
          bottom = parseInt(row) + 1 + "," + column;
        }
        if (column > 0) {
          left = row + "," + (parseInt(column) - 1);
        }
        if (column < 19) {
          right = row + "," + (parseInt(column) + 1);
        }

        if (top !== null && !visitedArr.includes(top)) {
          pathQueue.push(top);
        }
        if (right !== null && !visitedArr.includes(right)) {
          pathQueue.push(right);
        }
        if (bottom !== null && !visitedArr.includes(bottom)) {
          pathQueue.push(bottom);
        }
        if (left !== null && !visitedArr.includes(left)) {
          pathQueue.push(left);
        }

        iter();
      } else {
        return;
      }
    }, 10);
  };

  iter();
};

/* ##########################################################################################################################
                                                              MAIN ALGO
  ###########################################################################################################################
*/
/*
 Assigns the neighbors to the queue
*/
const assignToQ = (neighbor, current, cost, pathQueue) => {
  if (neighbor in visited) {
    return;
  }
  let [row, column] = neighbor.split(",");
  if (nodesArr[row][column].classList.contains("wall")) {
    return;
  }
  let a = {
    gCost: current.gCost + cost,
    coord: neighbor,
    from: current.coord,
  };

  if (!(neighbor in pathQueue)) {
    pathQueue[neighbor] = a;
  } else {
    if (a.gCost < pathQueue[neighbor].gCost) {
      pathQueue[neighbor].gCost = a.gCost;
      pathQueue[neighbor].from = a.from;
    }
  }
};

const startDijkstra = () => {
  isProcessDone = false;
  // let [row, column] = startNode.getAttribute("coord").split(",");
  let pathQueue = {};
  const startObj = {
    gCost: 0,
    coord: startNode.getAttribute("coord"),
    from: startNode.getAttribute("coord"),
  };
  pathQueue[startNode.getAttribute("coord")] = startObj;
  visited = {};
  let lowestCostKey = startNode.getAttribute("coord");

  const mainOperation = () => {
    setTimeout(() => {
      let current = pathQueue[lowestCostKey];
      let [row, column] = lowestCostKey.split(",");

      if (nodesArr[row][column] === endNode) {
        visited[lowestCostKey] = current;
        drawPath();
        return;
      } else {
        if (nodesArr[row][column] !== startNode) {
          nodesArr[row][column].classList.add("visited");
        }

        /*
        clockwise checking of neighbor
       */
        if (row > 0 && column > 0) {
          assignToQ(parseInt(row) - 1 + "," + (parseInt(column) - 1), current, 14, pathQueue);
        }
        if (row > 0) {
          assignToQ(parseInt(row) - 1 + "," + column, current, 10, pathQueue);
        }
        if (row > 0 && column < 39) {
          assignToQ(parseInt(row) - 1 + "," + (parseInt(column) + 1), current, 14, pathQueue);
        }
        if (column < 39) {
          assignToQ(row + "," + (parseInt(column) + 1), current, 10, pathQueue);
        }
        if (row < 17 && column < 39) {
          assignToQ(parseInt(row) + 1 + "," + (parseInt(column) + 1), current, 14, pathQueue);
        }
        if (row < 17) {
          assignToQ(parseInt(row) + 1 + "," + column, current, 10, pathQueue);
        }
        if (row < 17 && column > 0) {
          assignToQ(parseInt(row) + 1 + "," + (parseInt(column) - 1), current, 14, pathQueue);
        }
        if (column > 0) {
          assignToQ(row + "," + (parseInt(column) - 1), current, 10, pathQueue);
        }

        visited[lowestCostKey] = pathQueue[lowestCostKey];
        delete pathQueue[lowestCostKey];

        lowestCostKey = Object.keys(pathQueue)[0];
        for (i in pathQueue) {
          if (pathQueue[i].gCost < pathQueue[lowestCostKey].gCost) {
            lowestCostKey = i;
          }
        }
        if (Object.keys(pathQueue).length === 0) {
          alert("NO PATH TO THE END NODE!");
          isNoPath = true;
          isProcessDone = true;
          postProcess();

          return;
        }

        mainOperation();
      }
    }, 5);
  };

  let currentCoord = endNode.getAttribute("coord");

  const drawPath = () => {
    setTimeout(() => {
      const [row, column] = currentCoord.split(",");
      const currentNode = nodesArr[row][column];

      if (currentNode !== startNode) {
        if (currentNode !== startNode && currentNode !== endNode) {
          currentNode.classList.add("path");
          path.push(currentNode);
        }

        currentCoord = visited[currentCoord].from;
        drawPath();
      } else {
        isProcessDone = true;
        postProcess();
      }
    }, 20);
  };

  mainOperation();

  if (isNoPath) {
    isNoPath = false;
    return;
  }
};

/* #############################################################
  Onclick functions 
*/

btnStart.onclick = () => {
  btnStart.setAttribute("disabled", "");
  isWall = false;
  isRemoveWall = false;
  btnWall.textContent = "Add Wall";
  btnRemoveWall.textContent = "Remove Wall";
  btnWall.setAttribute("disabled", "");
  btnRemoveWall.setAttribute("disabled", "");
  btnClear.setAttribute("disabled", "");
  const end = startDijkstra();
};

btnWall.onclick = () => {
  isWall = !isWall ? true : false;

  if (isWall) {
    btnWall.textContent = "X";
  } else {
    btnWall.textContent = "Add Wall";
  }
  if (btnRemoveWall.textContent === "X") {
    btnRemoveWall.textContent = "Remove Wall";
    isRemoveWall = false;
  }
};

btnRemoveWall.onclick = () => {
  isRemoveWall = !isRemoveWall ? true : false;

  if (isRemoveWall) {
    btnRemoveWall.textContent = "X";
  } else {
    btnRemoveWall.textContent = "Remove Wall";
  }
  if (btnWall.textContent === "X") {
    btnWall.textContent = "Add Wall";
    isWall = false;
  }
};

btnClear.onclick = () => {
  startSelected = false;
  lastSelected = false;
  isWall = false;
  isRemoveWall = false;
  startNode.classList.remove("start");
  endNode.classList.remove("end");
  startNode = document.createElement("div");
  endNode = document.createElement("div");
  btnStart.setAttribute("disabled", "");
  btnWall.setAttribute("disabled", "");
  btnRemoveWall.setAttribute("disabled", "");
  btnWall.textContent = "Add Wall";
  btnRemoveWall.textContent = "Remove Wall";

  while (nodeContainer.firstChild) {
    nodeContainer.removeChild(nodeContainer.firstChild);
  }

  startProgram();
};

startProgram();

/* ##############################################################################################################################
                            INSTANT PROCESSES AFTER THE FIRST OPERATIONS (NO ANIMATION, DRAGGABLE END)
  ###############################################################################################################################
*/

const postProcess = () => {
  btnWall.removeAttribute("disabled");
  btnRemoveWall.removeAttribute("disabled");
  btnClear.removeAttribute("disabled");
  const nodes = document.getElementsByClassName("node");
  let isStartDown = false;
  let isEndDown = false;
  startNode.onmousedown = () => {
    isStartDown = true;
  };
  endNode.onmousedown = () => {
    isEndDown = true;
  };

  for (let node of nodes) {
    node.onmouseup = () => {
      isMouseDown = false;
      if (isStartDown) {
        isStartDown = false;
        startNode = node;
        startNode.classList.add("start");
        startNode.onmouseover = () => {
          if (isProcessDone) {
            postProcess();
          }
        };
      }
      if (isEndDown) {
        isEndDown = false;
        endNode = node;
        endNode.classList.add("end");
        endNode.onmouseover = () => {
          if (isProcessDone) {
            postProcess();
          }
        };
      }
    };
    node.onmouseover = () => {
      if (isStartDown) {
        if (!node.classList.contains("wall")) {
          node.classList.remove("visited");
          startNode.classList.remove("start");
          startNode = node;
          startNode.classList.add("start");
          startInstantDijkstra();
        }
      }

      if (isEndDown) {
        if (!node.classList.contains("wall")) {
          node.classList.remove("visited");
          endNode.classList.remove("end");
          endNode = node;
          endNode.classList.add("end");
          startInstantDijkstra();
        }
      }
      if (isMouseDown && isWall && node !== startNode && node !== endNode) {
        node.classList.add("wall");
      }
      if (isMouseDown && isRemoveWall && node !== startNode && node !== endNode) {
        node.classList.remove("wall");
      }
    };
  }
};

const startInstantDijkstra = () => {
  for (let coord in visited) {
    const [row, column] = coord.split(",");
    nodesArr[row][column].classList.remove("visited");
  }

  for (let node of path) {
    node.classList.remove("path");
  }

  isProcessDone = false;
  let pathQueue = {};
  const startObj = {
    gCost: 0,
    coord: startNode.getAttribute("coord"),
    from: startNode.getAttribute("coord"),
  };
  pathQueue[startNode.getAttribute("coord")] = startObj;
  visited = {};
  let lowestCostKey = startNode.getAttribute("coord");

  while (1) {
    let current = pathQueue[lowestCostKey];
    let [row, column] = lowestCostKey.split(",");

    if (nodesArr[row][column] === endNode) {
      visited[lowestCostKey] = current;
      break;
    }

    if (nodesArr[row][column] !== startNode) {
      nodesArr[row][column].classList.add("visited");
    }

    /*
    clockwise checking of neighbor
     */
    if (row > 0 && column > 0) {
      assignToQ(parseInt(row) - 1 + "," + (parseInt(column) - 1), current, 14, pathQueue);
    }
    if (row > 0) {
      assignToQ(parseInt(row) - 1 + "," + column, current, 10, pathQueue);
    }
    if (row > 0 && column < 39) {
      assignToQ(parseInt(row) - 1 + "," + (parseInt(column) + 1), current, 14, pathQueue);
    }
    if (column < 39) {
      assignToQ(row + "," + (parseInt(column) + 1), current, 10, pathQueue);
    }
    if (row < 17 && column < 39) {
      assignToQ(parseInt(row) + 1 + "," + (parseInt(column) + 1), current, 14, pathQueue);
    }
    if (row < 17) {
      assignToQ(parseInt(row) + 1 + "," + column, current, 10, pathQueue);
    }
    if (row < 17 && column > 0) {
      assignToQ(parseInt(row) + 1 + "," + (parseInt(column) - 1), current, 14, pathQueue);
    }
    if (column > 0) {
      assignToQ(row + "," + (parseInt(column) - 1), current, 10, pathQueue);
    }

    visited[lowestCostKey] = pathQueue[lowestCostKey];
    delete pathQueue[lowestCostKey];

    lowestCostKey = Object.keys(pathQueue)[0];
    for (i in pathQueue) {
      if (pathQueue[i].gCost < pathQueue[lowestCostKey].gCost) {
        lowestCostKey = i;
      }
    }
    if (Object.keys(pathQueue).length === 0) {
      alert("NO PATH TO THE END NODE!");
      isNoPath = true;
      isProcessDone = true;
      break;
    }
  }

  if (isNoPath) {
    isNoPath = false;
    return;
  }

  let currentCoord = endNode.getAttribute("coord");

  while (1) {
    const [row, column] = currentCoord.split(",");
    const currentNode = nodesArr[row][column];

    if (currentNode === startNode) {
      isProcessDone = true;
      break;
    }
    if (currentNode !== startNode && currentNode !== endNode) {
      path.push(currentNode);
      currentNode.classList.add("path");
    }
    currentCoord = visited[currentCoord].from;
  }
};
