import cv2
import os
import tempfile

def seconds_to_timestamp(seconds):
    # Convert seconds to hours:minutes:seconds
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    seconds = int(seconds % 60)
    return f"{hours:02}:{minutes:02}:{seconds:02}"

def process_video(input_video_path):
    # Load the video
    cap = cv2.VideoCapture(input_video_path)

    # Get the frame rate
    frame_rate = cap.get(cv2.CAP_PROP_FPS)  # Frame rate

    # Get video properties for the output file
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fourcc = cv2.VideoWriter_fourcc(*'MP4V')

    # Prepare the output path for the annotated video
    temp_dir = tempfile.gettempdir()
    output_video_path = os.path.join(temp_dir, 'annotated_video.mp4')

    # Create VideoWriter object to write the video at original frame rate
    out = cv2.VideoWriter(output_video_path, fourcc, frame_rate, (frame_width, frame_height))

    # Initialize the face cascade
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    detections = []  # List to store detection times

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        
        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 0, 255), 2)
            detection_time = cap.get(cv2.CAP_PROP_POS_MSEC) / 1000  # Current position of the video file in milliseconds
            timestamp = seconds_to_timestamp(detection_time)
            
            # Check if the timestamp already exists in the detections list before appending it
            if timestamp not in detections:
                detections.append(timestamp)
                print(f"Face visible at timestamp: {timestamp}")
        
        # Write the frame into the file
        out.write(frame)

    # Release everything if job is finished
    cap.release()
    out.release()
    cv2.destroyAllWindows()

    # Return the path to the annotated video and the detection times in timestamp format
    return output_video_path, detections
