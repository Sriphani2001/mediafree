const platformSelect = document.getElementById("platform-select");
const platformIcon = document.getElementById("platform-icon");
const urlInput = document.getElementById("url-input");
const formatName = document.getElementById("format-name");

const platformDetails = {
  youtube: { icon: "fab fa-youtube", color: "#ff0000", placeholder: "Enter YouTube URL..." },
  facebook: { icon: "fab fa-facebook", color: "#1877f2", placeholder: "Enter Facebook URL..." },
  soundcloud: { icon: "fab fa-soundcloud", color: "#ff5500", placeholder: "Enter SoundCloud URL..." },
  tiktok: { icon: "fab fa-tiktok", color: "#ffffff", placeholder: "Enter TikTok URL..." }
};

platformSelect.addEventListener("change", () => {
  const details = platformDetails[platformSelect.value];
  platformIcon.className = details.icon + " input-icon";
  urlInput.placeholder = details.placeholder;
});

document.getElementById("format-select").addEventListener("change", (e) => {
  formatName.textContent = e.target.value.split("-")[0].toUpperCase();
});

document.getElementById("convert-btn").addEventListener("click", () => {
  const url = urlInput.value.trim();
  const format = document.getElementById("format-select").value;
  if (!url) {
    alert("Enter a URL.");
    return;
  }

  alert(`Processing:\nURL: ${url}\nFormat: ${format}`);
  // Implement backend logic here
});
