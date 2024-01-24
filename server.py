import base64
from flask import Flask, request, send_from_directory, jsonify, redirect, url_for
from flask_cors import CORS
import os
import tempfile
from werkzeug.utils import secure_filename
from facedetection import process_video  # Assuming you've encapsulated your detection logic here

app = Flask(__name__, static_folder='./build')
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Assuming this route for handling the video processing
@app.route('/video', methods=['POST'])
def process_video_route():
    print(request.method)
    print(request.files)
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        filename = secure_filename(file.filename)
        temp_dir = tempfile.mkdtemp()
        video_path = os.path.join(temp_dir, filename)
        file.save(video_path)
        
        # Process the video for face detection
        output_path, detections = process_video(video_path)
        
        # Encode the video file in Base64
        with open(output_path, "rb") as video_file:
            encoded_video = base64.b64encode(video_file.read()).decode('utf-8')

        # Prepare the JSON response including both detections and the encoded video
        response_data = {
            'detections': detections,
            'video': encoded_video
        }
        
        # Cleanup the temporary files
        os.remove(video_path)
        os.remove(output_path)
        
        return jsonify(response_data)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(use_reloader=True, port=5173, threaded=True)
