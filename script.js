const platformButtons = document.querySelectorAll('.platform-btn');
const platformIcon = document.getElementById('platform-icon');
const urlInput = document.getElementById('url-input');
const formatName = document.getElementById('format-name');

const platformIcons = {
    youtube: { icon: 'fab fa-youtube', color: '#ff0000', placeholder: 'Enter YouTube URL...' },
    facebook: { icon: 'fab fa-facebook', color: '#1877f2', placeholder: 'Enter Facebook URL...' },
    soundcloud: { icon: 'fab fa-soundcloud', color: '#ff5500', placeholder: 'Enter SoundCloud URL...' },
    tiktok: { icon: 'fab fa-tiktok', color: '#ffffff', placeholder: 'Enter TikTok URL...' }
};

// Update platform icon & placeholder based on selection
platformButtons.forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.platform-btn.active').classList.remove('active');
        button.classList.add('active');

        const platform = button.getAttribute('data-platform');
        platformIcon.className = platformIcons[platform].icon + ' input-icon';
        platformIcon.style.color = platformIcons[platform].color;
        urlInput.placeholder = platformIcons[platform].placeholder;
    });
});

// Update the format name in title dynamically
topFormatSelect.addEventListener('change', () => {
    const selectedOption = topFormatSelect.options[topFormatSelect.selectedIndex].text;
    formatName.textContent = selectedOption.split('-')[0].trim();
});

// Conversion button event (placeholder for backend integration)
document.getElementById('convert-btn').addEventListener('click', () => {
    const url = urlInput.value;
    const platform = document.querySelector('.platform-btn.active').getAttribute('data-platform');
    const selectedFormat = topFormatSelect.value;

    if (!url || !selectedFormat) {
        alert('Please enter a URL and select a format from the top-right menu.');
        return;
    }

    alert(`Platform: ${platform}\nURL: ${url}\nFormat: ${selectedFormat}`);
    // Backend API call goes here.
});
document.getElementById('convert-btn').addEventListener('click', () => {
    const url = urlInput.value;
    const format = document.getElementById('format-select').value;

    if (!url) {
        alert('Please enter a URL.');
        return;
    }

    fetch('http://127.0.0.1:5000/download', {
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
