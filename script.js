const platformButtons = document.querySelectorAll('.platform-btn');
const platformIcon = document.getElementById('platform-icon');
const urlInput = document.getElementById('url-input');
const formatName = document.getElementById('format-name');

const platformIcons = {
    youtube: { icon: 'fab fa-youtube', color: '#ff0000', placeholder: 'Enter YouTube URL...' },
    facebook: { icon: 'fab fa-facebook', color: '#1877f2', placeholder: 'Enter Facebook Video URL...' },
    soundcloud: { icon: 'fab fa-soundcloud', color: '#ff5500', placeholder: 'Enter SoundCloud URL...' },
    tiktok: { icon: 'fab fa-tiktok', color: '#ffffff', placeholder: 'Enter TikTok URL...' }
};

// Set active platform
platformButtons.forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.platform-btn.active').classList.remove('active');
        button.classList.add('active');

        const platform = button.getAttribute('data-platform');
        platformIcon.className = platformIcons[platform].icon + ' input-icon';
        platformIcon.style.color = platformIcons[platform].color;
        urlInput.placeholder = platformIcons[platform].placeholder;

        formatName.textContent = document.getElementById('format-select').value.toUpperCase();
    });
});

// Format select updates title
document.getElementById('format-select').addEventListener('change', (e) => {
    formatName.textContent = e.target.value.toUpperCase();
});

// Convert button functionality (backend integration placeholder)
document.getElementById('convert-btn').addEventListener('click', () => {
    const url = urlInput.value;
    const platform = document.querySelector('.platform-btn.active').getAttribute('data-platform');
    const format = document.getElementById('format-select').value;

    if (!url) {
        alert('Please enter a valid URL.');
        return;
    }

    alert(`Platform: ${platform}\nURL: ${url}\nFormat: ${format}`);
    // Here, add backend integration later
});
document.getElementById('convert-btn').addEventListener('click', () => {
    const url = urlInput.value;
    const format = document.getElementById('format-select').value;

    if (!url) {
        alert('Please enter a URL.');
        return;
    }

    fetch('http://127.0.0.1:5050/download', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({url, format})
    })
    .then(response => {
        if (!response.ok) throw new Error("Conversion failed.");
        return response.blob();
    })
    .then(blob => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = '';
        document.body.appendChild(a);
        a.click();
        a.remove();
    })
    .catch(error => alert(error));
});
