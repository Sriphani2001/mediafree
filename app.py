from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import yt_dlp
import os

app = Flask(__name__)
CORS(app)

# Convert relative to absolute path for DOWNLOAD_FOLDER
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DOWNLOAD_FOLDER = os.path.join(BASE_DIR, 'mediafree', 'downloads')
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

@app.route('/download', methods=['POST'])
def download():
    data = request.json
    url = data.get('url')
    format_str = data.get('format')  # E.g., "mp3-128", "mp4-720", etc.
    platform = data.get('platform')  # E.g., "youtube", "facebook", "soundcloud", etc.

    if not url or not format_str or not platform:
        return jsonify({"error": "URL, format, and platform are required"}), 400

    # Determine if user wants audio (mp3) or video (mp4)
    is_audio = format_str.startswith("mp3")
    quality = format_str.split('-')[1] if '-' in format_str else "192"
    resolution = quality if not is_audio else None

    # Common yt_dlp options for both audio and video
    base_opts = {
        'windowsfilenames': True,  # Removes invalid Windows filename chars
        'outtmpl': os.path.join(DOWNLOAD_FOLDER, '%(title)s.%(ext)s')
    }

    # Audio-specific options (mp3)
    if is_audio:
        ydl_opts = {
            **base_opts,
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': quality
            }],
            # Update ffmpeg_location if needed
            'ffmpeg_location': r'C:\ffmpeg\ffmpeg-2025-03-13-git-958c46800e-full_build\ffmpeg-2025-03-13-git-958c46800e-full_build\bin'
        }
    else:
        # Video-specific options
        ydl_opts = {
            **base_opts,
            'format': f'best[height<={resolution}]'
        }

    try:
        # Download the media
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)

        # If it's audio, fix the extension to .mp3
        if is_audio:
            filename = os.path.splitext(filename)[0] + ".mp3"

        return send_file(filename, as_attachment=True)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Ask the user for the IP address and port
    ip_address = input("Enter the IP address to bind (default 127.0.0.1): ") or "127.0.0.1"
    port_input = input("Enter the port number to bind (default 5000): ") or "5000"
    
    try:
        port = int(port_input)
    except ValueError:
        print("Invalid port number. Using default port 5000.")
        port = 5000

    app.run(host=ip_address, port=port, debug=True)
