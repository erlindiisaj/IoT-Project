const BASE_URL = "http://192.168.1.102";

const savedValues = {
  light: 50,
  curtain: 50
};

function updateStateDisplay(device, value) {
  const stateElement = document.getElementById(`${device}-state`);
  if (device === "light") {
    stateElement.textContent = value == 0 ? "off" : "on";
  } else if (device === "curtain") {
    if (value == 0) {
      stateElement.textContent = "closed";
    } else if (value == 100) {
      stateElement.textContent = "open";
    } else {
      stateElement.textContent = "semi-open";
    }
  }
}

function positionKnob(knobId, value) {
  const angle = 180 * (value / 100);
  const rad = (Math.PI * angle) / 180;
  const x = 100 + 80 * Math.cos(Math.PI - rad);
  const y = 100 - 80 * Math.sin(Math.PI - rad);

  const knob = document.getElementById(knobId);
  knob.setAttribute("cx", x);
  knob.setAttribute("cy", y);
}

function updateUI(device, value) {
  const input = document.getElementById(`${device}-input`);
  input.value = value;
  positionKnob(`${device}-knob`, value);
  updateStateDisplay(device, value);
}

async function getState() {
  try {
    const res = await fetch(`${BASE_URL}/state`);
    const data = await res.json();

    const lightVal = data.light === "off" ? 0 : savedValues.light;
    const curtainVal = data.curtain === "closed" ? 0 :
                       data.curtain === "open" ? 100 : savedValues.curtain;

    updateUI("light", lightVal);
    updateUI("curtain", curtainVal);

    document.getElementById("mode-state").textContent = data.mode;
  } catch (err) {
    console.error("Failed to fetch state:", err);
  }
}

async function toggle(device) {
  let input = document.getElementById(`${device}-input`);
  let value = parseInt(input.value);

  if (device === "light") {
    if (value === 0) {
      value = savedValues.light || 50;
    } else {
      savedValues.light = value;
      value = 0;
    }
  } else if (device === "curtain") {
    value = value === 0 ? 100 : 0;
  } else if (device === "mode") {
    value = null;
  }

  try {
    await fetch(`${BASE_URL}/${device}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: value })
    });
    getState();
  } catch (err) {
    console.error(`Failed to toggle ${device}:`, err);
  }
}

function initKnob(device) {
  const input = document.getElementById(`${device}-input`);
  input.value = savedValues[device];
  updateUI(device, savedValues[device]);

  input.addEventListener("input", (e) => {
    let val = Math.max(0, Math.min(100, parseInt(e.target.value)));
    savedValues[device] = val;
    updateUI(device, val);
  });

  const knob = document.getElementById(`${device}-knob`);
  const container = knob.closest(".knob-container");

  let isDragging = false;

  container.addEventListener("mousedown", startDrag);
  container.addEventListener("touchstart", startDrag);

  function startDrag(e) {
    e.preventDefault();
    isDragging = true;

    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchmove", drag);
    document.addEventListener("touchend", stopDrag);
  }

  function drag(e) {
    if (!isDragging) return;

    const rect = container.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const dx = clientX - cx;
    const dy = cy - clientY;

    let angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Restrict to top semi-circle
    if (angle < 0 || angle > 180) return;

    const value = Math.round(((180 - angle) / 180) * 100);
    savedValues[device] = value;
    updateUI(device, value);
  }

  function stopDrag() {
    isDragging = false;
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDrag);
    document.removeEventListener("touchmove", drag);
    document.removeEventListener("touchend", stopDrag);
  }
}

getState();
setInterval(getState, 5000);

initKnob("light");
initKnob("curtain");
