// Platform and Format Handling Code
const platformSelect = document.getElementById("platform-select");
const platformIcon = document.getElementById("platform-icon");
const urlInput = document.getElementById("url-input");
const formatName = document.getElementById("format-name");

const platformDetails = {
  youtube: { icon: "fab fa-youtube", color: "#ff0000", placeholder: "Enter YouTube URL..." },
  facebook: { icon: "fab fa-facebook", color: "#1877f2", placeholder: "Enter Facebook URL..." },
  soundcloud: { icon: "fab fa-soundcloud", color: "#ff5500", placeholder: "Enter SoundCloud URL..." },
  tiktok: { icon: "fab fa-tiktok", color: "#ffffff", placeholder: "Enter TikTok URL..." },
  instagram: { icon: "fab fa-instagram", color: "#C13584", placeholder: "Enter Instagram URL..." },
  twitter: { icon: "fab fa-twitter", color: "#1DA1F2", placeholder: "Enter Twitter URL..." }
};

platformSelect.addEventListener("change", () => {
  const details = platformDetails[platformSelect.value];
  platformIcon.className = details.icon + " input-icon";
  urlInput.placeholder = details.placeholder;
});


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

// Navigation Active State Handling
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    // Remove active class from all links
    navLinks.forEach(nav => nav.classList.remove('active'));
    
    // Add active class to the clicked link
    this.classList.add('active');
    
    // If the link is not "Home", prevent default navigation and simulate an error 404
    if (this.getAttribute('href') !== 'index.html') {
      e.preventDefault();
      alert('Error 404: Page not found');
      // Optionally, redirect to an error page instead:
      // window.location.href = 'error404.html';
    }
  });
});
document.getElementById("convert-btn").addEventListener("click", () => {
    const url = document.getElementById("url-input").value.trim();
    const format = document.getElementById("format-select").value;
    const platform = document.getElementById("platform-select").value;
  
    if (!url) {
      alert("Enter a URL.");
      return;
    }
  
    fetch('http://127.0.0.1:5000/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: url, format: format, platform: platform })
    })
    .then(response => {
      if (response.ok) {
        return response.blob();
      } else {
        return response.json().then(err => { throw err; });
      }
    })
    .then(blob => {
      // Create a temporary link element and trigger download
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      // Optionally, set a default file name (or extract from response headers if available)
      a.download = "";
      document.body.appendChild(a);
      a.click();
      a.remove();
    })
    .catch(error => {
      alert("Error: " + (error.error || "An error occurred during download."));
    });
  });
  