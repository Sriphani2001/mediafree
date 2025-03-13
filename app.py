from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import yt_dlp
import os
from datetime import datetime

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
    format_str = data.get('format')  # e.g. "mp3-128", "mp4-720", etc.
    platform = data.get('platform')  # e.g. "youtube", "facebook", etc.

    if not url or not format_str or not platform:
        return jsonify({"error": "URL, format, and platform are required"}), 400

    # Determine if user wants audio (mp3) or video (mp4)
    is_audio = format_str.startswith("mp3")
    quality = format_str.split('-')[1] if '-' in format_str else "192"
    resolution = quality if not is_audio else None

    # Generate a custom timestamp-based filename
    now = datetime.now()
    # Example: "250325_1930" for 2025-03-25 19:30
    time_str = now.strftime("%y%m%d_%H%M")

    if is_audio:
        # e.g. 250325_1930_mp3_320kbps.mp3
        outtmpl_filename = f"{time_str}_mp3_{quality}kbps.%(ext)s"
    else:
        # e.g. 250325_1930_mp4_720p.mp4
        outtmpl_filename = f"{time_str}_mp4_{resolution}p.%(ext)s"

    # Build the full path for yt_dlp to store the file
    outtmpl_path = os.path.join(DOWNLOAD_FOLDER, outtmpl_filename)

    # Common yt_dlp options
    base_opts = {
        'windowsfilenames': True,  # Removes invalid Windows filename chars
        'outtmpl': outtmpl_path
    }

    # If the user wants MP3
    if is_audio:
        ydl_opts = {
            **base_opts,
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': quality
            }],
            'ffmpeg_location': r'C:\ffmpeg\ffmpeg-2025-03-13-git-958c46800e-full_build\ffmpeg-2025-03-13-git-958c46800e-full_build\bin'
        }
    else:
        # If the user wants a video
        ydl_opts = {
            **base_opts,
            'format': f'best[height<={resolution}]'
        }

    try:
        # Download the media
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            # This should match our outtmpl_path (with .mp3 or .mp4)
            final_filename = ydl.prepare_filename(info)

        return send_file(final_filename, as_attachment=True)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
