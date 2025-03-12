// Toggle Sidebar Menu
function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("open");
  }
  
  // Elements
  const platformSelect = document.getElementById("platform-select");
  const platformIcon   = document.getElementById("platform-icon");
  const urlInput       = document.getElementById("url-input");
  const formatName     = document.getElementById("format-name");
  const convertBtn     = document.getElementById("convert-btn");
  
  const platformDetails = {
    youtube: {
      icon: "fab fa-youtube",
      color: "#ff0000",
      placeholder: "Enter YouTube URL...",
    },
    facebook: {
      icon: "fab fa-facebook",
      color: "#1877f2",
      placeholder: "Enter Facebook URL...",
    },
    soundcloud: {
      icon: "fab fa-soundcloud",
      color: "#ff5500",
      placeholder: "Enter SoundCloud URL...",
    },
    tiktok: {
      icon: "fab fa-tiktok",
      color: "#ffffff",
      placeholder: "Enter TikTok URL...",
    },
  };
  
  // Update icon + placeholder when platform changes
  platformSelect.addEventListener("change", () => {
    const selected = platformSelect.value;
    const details = platformDetails[selected];
    platformIcon.className = details.icon + " input-icon";
    platformIcon.style.color = details.color;
    urlInput.placeholder = details.placeholder;
  });
  
  // Update "MP3"/"MP4" in title when format changes
  document.getElementById("format-select").addEventListener("change", (e) => {
    const formatText = e.target.options[e.target.selectedIndex].text.split(" ")[0];
    formatName.textContent = formatText;
  });
  
  // Convert button
  convertBtn.addEventListener("click", () => {
    const url = urlInput.value.trim();
    const format = document.getElementById("format-select").value;
  
    if (!url) {
      alert("Please enter a valid URL.");
      return;
    }
  
    // Example fetch to backend
    fetch("http://127.0.0.1:5000/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, format }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Conversion failed.");
        return response.blob();
      })
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = "";
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((error) => alert(error));
  });
  