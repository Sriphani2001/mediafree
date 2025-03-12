from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import yt_dlp
import os

app = Flask(__name__)
CORS(app)

DOWNLOAD_FOLDER = 'downloads'
if not os.path.exists(DOWNLOAD_FOLDER):
    os.makedirs(DOWNLOAD_FOLDER)

@app.route('/download', methods=['POST'])
def download():
    data = request.json
    url = data.get('url')
    format_str = data.get('format')  # E.g., "mp3-128", "mp4-720", etc.
    platform = data.get('platform')  # E.g., "youtube", "facebook", "soundcloud", etc.

    if not url or not format_str or not platform:
        return jsonify({"error": "URL, format, and platform are required"}), 400

    # Determine format type and quality level
    is_audio = format_str.startswith("mp3")
    quality = format_str.split('-')[1] if '-' in format_str else "192"
    resolution = quality if not is_audio else None

    # yt_dlp options setup
    if is_audio:
        # Audio options
        ydl_opts = {
            'outtmpl': f'{DOWNLOAD_FOLDER}/%(title)s.%(ext)s',
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': quality
            }],
            'ffmpeg_location': '/usr/bin/ffmpeg'  # Adjust this if ffmpeg is not in PATH
        }
    else:
        # Video options
        ydl_opts = {
            'outtmpl': f'{DOWNLOAD_FOLDER}/%(title)s.%(ext)s',
            'format': f'best[height<={resolution}]'
        }

    try:
        # Download the media
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)
        
        # Adjust extension for MP3 downloads
        if is_audio:
            filename = os.path.splitext(filename)[0] + ".mp3"

        return send_file(filename, as_attachment=True)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
