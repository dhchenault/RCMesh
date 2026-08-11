const detailPanel = document.getElementById("node-detail");
const nodeList = document.getElementById("node-list");

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

const init = async () => {
  try {
    const response = await fetch("data/nodes.json");
    const data = await response.json();
    setStats(data);
    renderNodeCards(data.nodes);
    const featuredNode =
      data.nodes.find((node) => node.id === data.featuredNodeId) ?? data.nodes[0];
    if (featuredNode) {
      renderDetail(featuredNode);
    }
  } catch (error) {
    console.error("Unable to load node data", error);
  }
};

init();
