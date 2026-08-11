const detailPanel = document.getElementById("node-detail");
const nodeList = document.getElementById("node-list");
const countyMap = document.getElementById("county-map");

const formatStatus = (status) => status.charAt(0).toUpperCase() + status.slice(1);

const setStats = (data) => {
  const communities = new Set(data.nodes.map((node) => node.community)).size;
  document.getElementById("stat-nodes").textContent = data.nodes.length;
  document.getElementById("stat-communities").textContent = communities;
  document.getElementById("stat-uptime").textContent = data.network.uptime;
  document.getElementById("stat-frequency").textContent = data.network.frequency;
};

const renderDetail = (node) => {
  detailPanel.innerHTML = `
    <p class="detail-kicker">${node.type}</p>
    <h3>${node.name}</h3>
    <p class="detail-status">
      <span class="status-dot ${node.status}"></span>
      ${formatStatus(node.status)}
    </p>
    <ul class="detail-meta">
      <li><strong>Coverage:</strong> ${node.coverage}</li>
      <li><strong>Antenna:</strong> ${node.antennaHeight}</li>
      <li><strong>Installed:</strong> ${node.installed}</li>
    </ul>
    <p>${node.description}</p>
  `;
};

const renderNodeCards = (nodes) => {
  nodeList.innerHTML = nodes
    .map(
      (node) => `
        <article class="node-card">
          <div class="node-card-top">
            <span class="node-card-badge">
              <span class="status-dot ${node.status}"></span>
              ${formatStatus(node.status)}
            </span>
            <small>${node.type}</small>
          </div>
          <h3>${node.name}</h3>
          <p>${node.community}, Texas</p>
          <p>${node.description}</p>
          <div class="node-card-meta">
            <span>${node.coverage}</span>
            <span>${node.antennaHeight}</span>
          </div>
        </article>
      `
    )
    .join("");
};

const distance = (a, b) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const angle = (a, b) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.atan2(dy, dx) * (180 / Math.PI);
};

const renderConnections = (nodes) => {
  const featured = nodes.slice(0, 1);
  const linkedNodes = nodes.slice(1, 8);

  linkedNodes.forEach((node) => {
    const line = document.createElement("span");
    line.className = "map-line";
    line.style.left = `${featured[0].x}%`;
    line.style.top = `${featured[0].y}%`;
    line.style.width = `${distance(featured[0], node)}%`;
    line.style.transform = `rotate(${angle(featured[0], node)}deg)`;
    countyMap.appendChild(line);
  });
};

const renderMap = (nodes, featuredNodeId) => {
  countyMap.innerHTML = "";
  renderConnections(nodes);

  nodes.forEach((node) => {
    const nodeButton = document.createElement("button");
    nodeButton.className = "map-node";
    nodeButton.type = "button";
    nodeButton.style.left = `${node.x}%`;
    nodeButton.style.top = `${node.y}%`;
    nodeButton.setAttribute("aria-label", `${node.name} node`);

    if (node.showLabel) {
      const label = document.createElement("span");
      label.className = "map-label";
      label.textContent = node.community;
      nodeButton.appendChild(label);
