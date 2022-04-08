const nodeContainer = document.getElementById("nodeContainer");
const algo = document.getElementById("algo");
const btnClear = document.getElementById("btnClear");
const btnStart = document.getElementById("btnStart");
const btnWall = document.getElementById("btnWall");
const btnRemoveWall = document.getElementById("btnRemoveWall");
const txtInfo = document.getElementById("txtInfo");
const txtPost = document.getElementById("txtPost");
const txtSelect = document.getElementById("txtSelect");
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
let path = [];
let pathArr = [];
let visited = {};

const createNode = (row, col) => {
  const div = document.createElement("div");
  div.classList.add("node");
  const coord = row + "," + col;
  div.setAttribute("coord", coord);
  div.onclick = () => {
    if (!startSelected) {
      startNode = div;
      div.classList.add("start");
      txtSelect.textContent = "end node";
      startSelected = true;
      lastSelected = false;
    } else if (!lastSelected && startSelected) {
      txtInfo.classList.add("d-none");
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

/* ##########################################################################################################################
                                                              MAIN ALGO
  ###########################################################################################################################
*/

/*########################################################## BREADTH FIRST  #################################################################*/
const startBF = () => {
  let visitedArr = [];
  let loopCount = [];
  visited = {};

  let [row, column] = startNode.getAttribute("coord").split(",");

  let pathQueue = [];
  let finalCount = 0;
  pathQueue.push([startNode.getAttribute("coord"), 0]);

  const iter = () => {
    setTimeout(() => {
      const [currentCoord, count] = pathQueue.shift();
      [row, column] = currentCoord.split(",");
      const node = nodesArr[row][column];

      if (endNode !== node) {
        if (visitedArr.includes(node.getAttribute("coord"))) {
          iter();
          return;
        }

        visitedArr.push(currentCoord);
        loopCount.push([currentCoord, count]);

        if (startNode !== node) {
          node.classList.add("visited");
          visited[node.getAttribute("coord")] = {};
        }

        let [top, bottom, left, right] = [null, null, null, null];

        if (row > 0) {
          top = parseInt(row) - 1 + "," + column;
        }
        if (row < 17) {
          bottom = parseInt(row) + 1 + "," + column;
        }
        if (column > 0) {
          left = row + "," + (parseInt(column) - 1);
        }
        if (column < 39) {
          right = row + "," + (parseInt(column) + 1);
        }

        if (
          top !== null &&
          !visitedArr.includes(top) &&
          !nodesArr[top.split(",")[0]][top.split(",")[1]].classList.contains("wall")
        ) {
          pathQueue.push([top, count + 1]);
        }
        if (
          right !== null &&
          !visitedArr.includes(right) &&
          !nodesArr[right.split(",")[0]][right.split(",")[1]].classList.contains("wall")
        ) {
          pathQueue.push([right, count + 1]);
        }
        if (
          bottom !== null &&
          !visitedArr.includes(bottom) &&
          !nodesArr[bottom.split(",")[0]][bottom.split(",")[1]].classList.contains("wall")
        ) {
          pathQueue.push([bottom, count + 1]);
        }
        if (
          left !== null &&
          !visitedArr.includes(left) &&
          !nodesArr[left.split(",")[0]][left.split(",")[1]].classList.contains("wall")
        ) {
          pathQueue.push([left, count + 1]);
        }

        if (pathQueue.length === 0) {
          alert("NO PATH TO THE END NODE!");
          isNoPath = true;
          isProcessDone = true;
          postProcess();
          return;
        }

        iter();
      } else {
        loopCount.push([currentCoord, count]);
        finalCount = count;
        pathCheck();
        return;
      }
    }, 1);
  };

  iter();

  const pathCheck = () => {
    pathArr = [];
    loopCount.reverse();
    let currentNode = loopCount.shift();
    pathArr.push(currentNode[0]);
    let minimum = currentNode;

    while (1) {
      const [row, column] = currentNode[0].split(",");
      if (currentNode[0] === startNode.getAttribute("coord")) {
        break;
      }

      let neighbor = [];

      if (row > 0 && column > 0) {
        neighbor.push(parseInt(row) - 1 + "," + (parseInt(column) - 1));
      }
      if (row > 0 && column < 39) {
        neighbor.push(parseInt(row) - 1 + "," + (parseInt(column) + 1));
      }
      if (row < 17 && column < 39) {
        neighbor.push(parseInt(row) + 1 + "," + (parseInt(column) + 1));
      }
      if (row < 17 && column > 0) {
        neighbor.push(parseInt(row) + 1 + "," + (parseInt(column) - 1));
      }
      if (row > 0) {
        neighbor.push(parseInt(row) - 1 + "," + column);
      }
      if (row < 17) {
        neighbor.push(parseInt(row) + 1 + "," + column);
      }
      if (column > 0) {
        neighbor.push(row + "," + (parseInt(column) - 1));
      }
      if (column < 39) {
        neighbor.push(row + "," + (parseInt(column) + 1));
      }

      for (let node of loopCount) {
        if (node[1] >= finalCount) {
          continue;
        }
        if (finalCount > 2) {
          if (node[1] >= finalCount - 2) {
            if (neighbor.includes(node[0])) {
              if (node[1] < minimum[1]) {
                minimum = node;
                if (node[1] === finalCount - 2) {
                  currentNode = minimum;
                  finalCount = minimum[1];
                  pathArr.push(minimum[0]);
                  break;
                }
              }
            }
          } else {
            currentNode = minimum;
            finalCount = minimum[1];
            pathArr.push(minimum[0]);
            break;
          }
        } else {
          if (neighbor.includes(node[0])) {
            if (node[1] < minimum[1]) {
              minimum = node;
              currentNode = minimum;
              finalCount = minimum[1];
              pathArr.push(minimum[0]);
              break;
            }
          }
        }
      }
    }
    pathArr.reverse();
    drawPath(pathArr[0]);
  };
};

/*########################################################## DEPTH FIRST  #################################################################*/
const startDF = () => {
  let visitedArr = [];
  visited = {};

  let pathStack = [];
  pathStack.push(startNode.getAttribute("coord"));

  const iter = () => {
    setTimeout(() => {
      const currentCoord = pathStack.pop();
      const [row, column] = currentCoord.split(",");
      const node = nodesArr[row][column];

      if (node !== endNode) {
        visitedArr.push(currentCoord);

        if (node !== startNode) {
          nodesArr[row][column].classList.add("visited");
          pathArr.push(currentCoord);
          visited[node.getAttribute("coord")] = {};
        }

        let [top, bottom, left, right] = [null, null, null, null];
        if (row > 0) {
          top = parseInt(row) - 1 + "," + column;
        }
        if (row < 17) {
          bottom = parseInt(row) + 1 + "," + column;
        }
        if (column > 0) {
          left = row + "," + (parseInt(column) - 1);
        }
        if (column < 39) {
          right = row + "," + (parseInt(column) + 1);
        }

        if (
          left !== null &&
          !visitedArr.includes(left) &&
          !nodesArr[left.split(",")[0]][left.split(",")[1]].classList.contains("wall")
        ) {
          pathStack.push(left);
        }

        if (
          bottom !== null &&
          !visitedArr.includes(bottom) &&
          !nodesArr[bottom.split(",")[0]][bottom.split(",")[1]].classList.contains("wall")
        ) {
          pathStack.push(bottom);
        }

        if (
          right !== null &&
          !visitedArr.includes(right) &&
          !nodesArr[right.split(",")[0]][right.split(",")[1]].classList.contains("wall")
        ) {
          pathStack.push(right);
        }
        if (
          top !== null &&
          !visitedArr.includes(top) &&
          !nodesArr[top.split(",")[0]][top.split(",")[1]].classList.contains("wall")
        ) {
          pathStack.push(top);
        }

        if (pathStack.length === 0) {
          alert("NO PATH TO THE END NODE!");
          isNoPath = true;
          isProcessDone = true;
          postProcess();
          return;
        }

        iter();
      } else {
        pathArr.push(endNode.getAttribute("coord"));
        drawPath(pathArr[0]);

        return;
      }
    }, 5);
  };
  iter();
};

/*########################################################## DIJKSTRA'S ALGO  #################################################################*/

/*Assigns the neighbors to the queue*/
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
        revPath();
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
        for (let i in pathQueue) {
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

  const revPath = () => {
    while (1) {
      pathArr.push(currentCoord);

      if (currentCoord === startNode.getAttribute("coord")) {
        pathArr.reverse();
        drawPath(currentCoord);
        break;
      }
      currentCoord = visited[currentCoord].from;
    }
  };

  // const drawPath = () => {
  //   setTimeout(() => {
  //     const [row, column] = currentCoord.split(",");
  //     const currentNode = nodesArr[row][column];

  //     if (currentNode !== startNode) {
  //       if (currentNode !== startNode && currentNode !== endNode) {
  //         currentNode.classList.add("path");
  //         path.push(currentNode);
  //       }

  //       currentCoord = visited[currentCoord].from;
  //       drawPath();
  //     } else {
  //       isProcessDone = true;
  //       postProcess();
  //     }
  //   }, 20);
  // };

  // const drawPath = () => {
  //   setTimeout(() => {
  //     const [row, column] = pathArr.shift().split(",");
  //     const currentNode = nodesArr[row][column];

  //     if (currentNode !== endNode) {
  //       if (currentNode !== startNode && currentNode !== endNode) {
  //         currentNode.classList.add("path");
  //         path.push(currentNode);
  //       }

  //       currentCoord = visited[currentCoord].from;
  //       drawPath();
  //     } else {
  //       isProcessDone = true;
  //       postProcess();
  //     }
  //   }, 20);
  // };

  mainOperation();

  if (isNoPath) {
    isNoPath = false;
    return;
  }
};

/*########################################################## A STAR ALGO  #################################################################*/
/*Assigns the neighbors to the queue*/
const starAssignToQ = (neighbor, current, cost, pathQueue) => {
  const [endRow, endCol] = endNode.getAttribute("coord").split(",");
  const [startRow, startCol] = neighbor.split(",");

  const hCost = hCostCompute(startRow, startCol, endRow, endCol);

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
    hCost: hCost,
    totalCost: 0,
    computeTotal: function () {
      this.totalCost = this.gCost + this.hCost;
    },
    from: current.coord,
  };
  a.computeTotal();

  if (!(neighbor in pathQueue)) {
    pathQueue[neighbor] = a;
  } else {
    if (a.totalCost < pathQueue[neighbor].totalCost) {
      pathQueue[neighbor].gCost = a.gCost;
      pathQueue[neighbor].hCost = a.hCost;
      pathQueue[neighbor].totalCost = a.totalCost;
      pathQueue[neighbor].from = a.from;
    }
  }
};

const hCostCompute = (startRow, startCol, endRow, endCol) => {
  return Math.floor(
    Math.sqrt(
      Math.pow(Math.abs(parseInt(endRow) - parseInt(startRow)), 2) + Math.pow(Math.abs(parseInt(endCol) - parseInt(startCol)), 2)
    ) * 10
  );
};

const startAStar = () => {
  const [endRow, endCol] = endNode.getAttribute("coord").split(",");
  const [startRow, startCol] = startNode.getAttribute("coord").split(",");

  const hCost = hCostCompute(startRow, startCol, endRow, endCol);

  let pathQueue = {};
  const startObj = {
    gCost: 0,
    hCost: hCost,
    totalCost: 0,
    computeTotal: function () {
      this.totalCost = this.gCost + this.hCost;
    },
    coord: startNode.getAttribute("coord"),
    from: startNode.getAttribute("coord"),
  };
  startObj.computeTotal();

  pathQueue[startNode.getAttribute("coord")] = startObj;
  visited = {};
  let lowestCostKey = startNode.getAttribute("coord");

  const mainOperation = () => {
    setTimeout(() => {
      let current = pathQueue[lowestCostKey];
      let [row, column] = lowestCostKey.split(",");

      if (nodesArr[row][column] === endNode) {
        visited[lowestCostKey] = current;
        revPath();
        return;
      } else {
        if (nodesArr[row][column] !== startNode) {
          nodesArr[row][column].classList.add("visited");
        }

        /*
        clockwise checking of neighbor
       */
        if (row > 0 && column > 0) {
          starAssignToQ(parseInt(row) - 1 + "," + (parseInt(column) - 1), current, 14, pathQueue);
        }
        if (row > 0) {
          starAssignToQ(parseInt(row) - 1 + "," + column, current, 10, pathQueue);
        }
        if (row > 0 && column < 39) {
          starAssignToQ(parseInt(row) - 1 + "," + (parseInt(column) + 1), current, 14, pathQueue);
        }
        if (column < 39) {
          starAssignToQ(row + "," + (parseInt(column) + 1), current, 10, pathQueue);
        }
        if (row < 17 && column < 39) {
          starAssignToQ(parseInt(row) + 1 + "," + (parseInt(column) + 1), current, 14, pathQueue);
        }
        if (row < 17) {
          starAssignToQ(parseInt(row) + 1 + "," + column, current, 10, pathQueue);
        }
        if (row < 17 && column > 0) {
          starAssignToQ(parseInt(row) + 1 + "," + (parseInt(column) - 1), current, 14, pathQueue);
        }
        if (column > 0) {
          starAssignToQ(row + "," + (parseInt(column) - 1), current, 10, pathQueue);
        }

        // console.log(
        //   nodesArr[lowestCostKey.split(",")[0]][lowestCostKey.split(",")[1]],
        //   pathQueue[lowestCostKey].gCost,
        //   pathQueue[lowestCostKey].hCost,
        //   pathQueue[lowestCostKey].totalCost
        // );

        visited[lowestCostKey] = pathQueue[lowestCostKey];
        delete pathQueue[lowestCostKey];

        lowestCostKey = Object.keys(pathQueue)[0];
        for (let i in pathQueue) {
          if (pathQueue[i].totalCost < pathQueue[lowestCostKey].totalCost) {
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
    }, 10);
  };
  mainOperation();

  let currentCoord = endNode.getAttribute("coord");

  const revPath = () => {
    while (1) {
      pathArr.push(currentCoord);

      if (currentCoord === startNode.getAttribute("coord")) {
        pathArr.reverse();
        drawPath(currentCoord);
        break;
      }
      currentCoord = visited[currentCoord].from;
    }
  };
};

const drawPath = (currentCoord) => {
  setTimeout(() => {
    const [row, column] = pathArr.shift().split(",");
    const currentNode = nodesArr[row][column];

    if (currentNode !== endNode) {
      if (currentNode !== startNode && currentNode !== endNode) {
        currentNode.classList.add("path");
        path.push(currentNode);
      }

      drawPath(currentCoord);
    } else {
      isProcessDone = true;
      postProcess();
    }
  }, 20);
};

/* #############################################################
  Onclick functions 
  #############################################################
*/

btnStart.onclick = async () => {
  btnStart.setAttribute("disabled", "");
  isWall = false;
  isRemoveWall = false;
  btnWall.textContent = "Add Wall";
  btnRemoveWall.textContent = "Remove Wall";
  btnWall.setAttribute("disabled", "");
  btnRemoveWall.setAttribute("disabled", "");
  btnClear.setAttribute("disabled", "");

  switch (algo.value) {
    case "di": {
      startDijkstra();
      // dis(nodesArr, startNode, endNode, isProcessDone);
      break;
    }
    case "as": {
      startAStar();
      break;
    }
    case "bf": {
      startBF();
      break;
    }
    case "df": {
      startDF();
      break;
    }
    default: {
      break;
    }
  }
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

  txtInfo.classList.remove("d-none");
  txtPost.classList.add("d-none");

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

const getAlgoInstant = () => {
  for (let coord in visited) {
    const [row, column] = coord.split(",");
    nodesArr[row][column].classList.remove("visited");
  }

  for (let node of path) {
    node.classList.remove("path");
  }

  switch (algo.value) {
    case "di": {
      startInstantDijkstra();
      break;
    }
    case "as": {
      startInstantAStar();
      break;
    }
    case "bf": {
      startInstantBF();
      break;
    }
    case "df": {
      startInstantDF();
      break;
    }

    default: {
      break;
    }
  }
};

const postProcess = () => {
  txtPost.classList.remove("d-none");
  txtInfo.classList.add("d-none");
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
          getAlgoInstant();
        }
      }

      if (isEndDown) {
        if (!node.classList.contains("wall")) {
          node.classList.remove("visited");
          endNode.classList.remove("end");
          endNode = node;
          endNode.classList.add("end");
          getAlgoInstant();
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
    for (let i in pathQueue) {
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

const startInstantBF = () => {
  isProcessDone = false;
  let visitedArr = [];
  let loopCount = [];
  visited = {};

  let [row, column] = startNode.getAttribute("coord").split(",");

  let pathQueue = [];
  let finalCount = 0;
  pathQueue.push([startNode.getAttribute("coord"), 0]);

  while (1) {
    const [currentCoord, count] = pathQueue.shift();
    [row, column] = currentCoord.split(",");
    const node = nodesArr[row][column];

    if (endNode === node) {
      loopCount.push([currentCoord, count]);
      finalCount = count;
      break;
    }
    if (visitedArr.includes(node.getAttribute("coord"))) continue;

    visitedArr.push(currentCoord);
    loopCount.push([currentCoord, count]);

    if (startNode !== node) {
      node.classList.add("visited");
      visited[node.getAttribute("coord")] = {};
    }

    // pathQueue.push(startNode.getAttribute("coord"));

    let [top, bottom, left, right] = [null, null, null, null];

    if (row > 0) {
      top = parseInt(row) - 1 + "," + column;
    }
    if (row < 17) {
      bottom = parseInt(row) + 1 + "," + column;
    }
    if (column > 0) {
      left = row + "," + (parseInt(column) - 1);
    }
    if (column < 39) {
      right = row + "," + (parseInt(column) + 1);
    }

    if (top !== null && !visitedArr.includes(top) && !nodesArr[top.split(",")[0]][top.split(",")[1]].classList.contains("wall")) {
      pathQueue.push([top, count + 1]);
    }
    if (
      right !== null &&
      !visitedArr.includes(right) &&
      !nodesArr[right.split(",")[0]][right.split(",")[1]].classList.contains("wall")
    ) {
      pathQueue.push([right, count + 1]);
    }
    if (
      bottom !== null &&
      !visitedArr.includes(bottom) &&
      !nodesArr[bottom.split(",")[0]][bottom.split(",")[1]].classList.contains("wall")
    ) {
      pathQueue.push([bottom, count + 1]);
    }
    if (
      left !== null &&
      !visitedArr.includes(left) &&
      !nodesArr[left.split(",")[0]][left.split(",")[1]].classList.contains("wall")
    ) {
      pathQueue.push([left, count + 1]);
    }

    if (pathQueue.length === 0) {
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

  pathArr = [];
  loopCount.reverse();
  let currentNode = loopCount.shift();
  pathArr.push(currentNode[0]);
  let minimum = currentNode;

  while (1) {
    const [row, column] = currentNode[0].split(",");
    if (currentNode[0] === startNode.getAttribute("coord")) {
      break;
    }

    let neighbor = [];

    if (row > 0 && column > 0) {
      neighbor.push(parseInt(row) - 1 + "," + (parseInt(column) - 1));
    }
    if (row > 0 && column < 39) {
      neighbor.push(parseInt(row) - 1 + "," + (parseInt(column) + 1));
    }
    if (row < 17 && column < 39) {
      neighbor.push(parseInt(row) + 1 + "," + (parseInt(column) + 1));
    }
    if (row < 17 && column > 0) {
      neighbor.push(parseInt(row) + 1 + "," + (parseInt(column) - 1));
    }
    if (row > 0) {
      neighbor.push(parseInt(row) - 1 + "," + column);
    }
    if (row < 17) {
      neighbor.push(parseInt(row) + 1 + "," + column);
    }
    if (column > 0) {
      neighbor.push(row + "," + (parseInt(column) - 1));
    }
    if (column < 39) {
      neighbor.push(row + "," + (parseInt(column) + 1));
    }

    for (let node of loopCount) {
      if (node[1] >= finalCount) {
        continue;
      }
      if (finalCount > 2) {
        if (node[1] >= finalCount - 2) {
          if (neighbor.includes(node[0])) {
            if (node[1] < minimum[1]) {
              minimum = node;
              if (node[1] === finalCount - 2) {
                currentNode = minimum;
                finalCount = minimum[1];
                pathArr.push(minimum[0]);
                break;
              }
            }
          }
        } else {
          currentNode = minimum;
          finalCount = minimum[1];
          pathArr.push(minimum[0]);
          break;
        }
      } else {
        if (neighbor.includes(node[0])) {
          if (node[1] < minimum[1]) {
            minimum = node;
            currentNode = minimum;
            finalCount = minimum[1];
            pathArr.push(minimum[0]);
            break;
          }
        }
      }
    }
  }
  let currentCoord = pathArr.shift();

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
    currentCoord = pathArr.shift();
  }
};

const startInstantDF = () => {
  isProcessDone = false;
  pathArr = [];

  let visitedArr = [];
  visited = {};

  let pathStack = [];
  pathStack.push(startNode.getAttribute("coord"));

  while (1) {
    const currentCoord = pathStack.pop();
    const [row, column] = currentCoord.split(",");
    const node = nodesArr[row][column];

    if (node === endNode) {
      pathArr.push(currentCoord);
      break;
    }
    visitedArr.push(currentCoord);
    if (node !== startNode) {
      pathArr.push(currentCoord);

      nodesArr[row][column].classList.add("visited");
      visited[node.getAttribute("coord")] = {};
    }

    let [top, bottom, left, right] = [null, null, null, null];
    if (row > 0) {
      top = parseInt(row) - 1 + "," + column;
    }
    if (row < 17) {
      bottom = parseInt(row) + 1 + "," + column;
    }
    if (column > 0) {
      left = row + "," + (parseInt(column) - 1);
    }
    if (column < 39) {
      right = row + "," + (parseInt(column) + 1);
    }

    if (
      left !== null &&
      !visitedArr.includes(left) &&
      !nodesArr[left.split(",")[0]][left.split(",")[1]].classList.contains("wall")
    ) {
      pathStack.push(left);
    }

    if (
      bottom !== null &&
      !visitedArr.includes(bottom) &&
      !nodesArr[bottom.split(",")[0]][bottom.split(",")[1]].classList.contains("wall")
    ) {
      pathStack.push(bottom);
    }

    if (
      right !== null &&
      !visitedArr.includes(right) &&
      !nodesArr[right.split(",")[0]][right.split(",")[1]].classList.contains("wall")
    ) {
      pathStack.push(right);
    }
    if (top !== null && !visitedArr.includes(top) && !nodesArr[top.split(",")[0]][top.split(",")[1]].classList.contains("wall")) {
      pathStack.push(top);
    }

    if (pathStack.length === 0) {
      alert("NO PATH TO THE END NODE!");
      isNoPath = true;
      isProcessDone = true;
      postProcess();
      return;
    }
  }

  if (isNoPath) {
    isNoPath = false;
    return;
  }

  let currentCoord = pathArr.shift();

  while (1) {
    const [row, column] = currentCoord.split(",");
    const currentNode = nodesArr[row][column];

    if (currentNode === endNode) {
      isProcessDone = true;
      break;
    }
    if (currentNode !== startNode && currentNode !== endNode) {
      path.push(currentNode);
      currentNode.classList.add("path");
    }
    currentCoord = pathArr.shift();
  }
};

const startInstantAStar = () => {
  const [endRow, endCol] = endNode.getAttribute("coord").split(",");
  const [startRow, startCol] = startNode.getAttribute("coord").split(",");

  const hCost = hCostCompute(startRow, startCol, endRow, endCol);

  let pathQueue = {};
  const startObj = {
    gCost: 0,
    hCost: hCost,
    totalCost: 0,
    computeTotal: function () {
      this.totalCost = this.gCost + this.hCost;
    },
    coord: startNode.getAttribute("coord"),
    from: startNode.getAttribute("coord"),
  };
  startObj.computeTotal();

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
      starAssignToQ(parseInt(row) - 1 + "," + (parseInt(column) - 1), current, 14, pathQueue);
    }
    if (row > 0) {
      starAssignToQ(parseInt(row) - 1 + "," + column, current, 10, pathQueue);
    }
    if (row > 0 && column < 39) {
      starAssignToQ(parseInt(row) - 1 + "," + (parseInt(column) + 1), current, 14, pathQueue);
    }
    if (column < 39) {
      starAssignToQ(row + "," + (parseInt(column) + 1), current, 10, pathQueue);
    }
    if (row < 17 && column < 39) {
      starAssignToQ(parseInt(row) + 1 + "," + (parseInt(column) + 1), current, 14, pathQueue);
    }
    if (row < 17) {
      starAssignToQ(parseInt(row) + 1 + "," + column, current, 10, pathQueue);
    }
    if (row < 17 && column > 0) {
      starAssignToQ(parseInt(row) + 1 + "," + (parseInt(column) - 1), current, 14, pathQueue);
    }
    if (column > 0) {
      starAssignToQ(row + "," + (parseInt(column) - 1), current, 10, pathQueue);
    }

    visited[lowestCostKey] = pathQueue[lowestCostKey];
    delete pathQueue[lowestCostKey];

    lowestCostKey = Object.keys(pathQueue)[0];
    for (let i in pathQueue) {
      if (pathQueue[i].totalCost < pathQueue[lowestCostKey].totalCost) {
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
