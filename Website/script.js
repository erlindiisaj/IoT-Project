const BASE_URL = "http://192.168.1.102";

async function getState() {
  try {
    const res = await fetch(`${BASE_URL}/state`);
    const data = await res.json();

    document.getElementById("light-state").textContent = data.light;
    document.getElementById("curtain-state").textContent = data.curtain;
    document.getElementById("mode-state").textContent = data.mode;
  } catch (err) {
    console.error("Failed to fetch state:", err);
  }
}

async function toggle(device) {
  let current = document.getElementById(`${device}-state`).textContent.toLowerCase();
  let next;

  switch (device) {
    case "light":
      next = current === "on" ? "off" : "on";
      break;
    case "curtain":
      next = current === "open" ? "closed" : "open";
      break;
    case "mode":
      next = current === "manual" ? "auto" : "manual";
      break;
    default:
      return;
  }

  try {
    await fetch(`${BASE_URL}/${device}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: next })
    });
    getState();
  } catch (err) {
    console.error(`Failed to toggle ${device}:`, err);
  }
}

getState();
setInterval(getState, 5000); // Refresh state every 5 seconds
