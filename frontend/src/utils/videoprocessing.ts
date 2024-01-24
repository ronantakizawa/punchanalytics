// fileHandlers.ts

export const handleAnalyzeClick = (file: FileList,
    setIsFetching: (isFetching: boolean) => void,
    setDetections: (detections: string[]) => void, // New setter for detections
    setVideo: (url: string) => void
  ): void => { 
    setIsFetching(true); // Start loading
    const formData = new FormData();
    formData.append('file', file[0]); // Append the file to the form data

        // Fetch API to send the video to the server
        fetch('http://localhost:5173/video', {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                setIsFetching(false);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parse the JSON response body
        })
        .then(data => {
            console.log('Success:', data);
            setDetections(data.detections); 
            const videoBase64 = data.video;
            const videoBlob = base64ToBlob(videoBase64, 'video/mp4'); 
            if(videoBlob){
                const video = URL.createObjectURL(videoBlob);
                setVideo(video);
            }
            setIsFetching(false);
        })
        .catch((error) => {
            console.error('Error:', error);
            setIsFetching(false);
        });
  };
  
  export const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setIsValidFile: (isValidFile: any) => void
  ): void => { // Similarly, indicate that this function returns void
    const files = event.target.files; // This is a FileList, not a single file
    if (files && files.length > 0) {
      setIsValidFile(files);
    } else {
      setIsValidFile(null);
    }
  };
  
  function base64ToBlob(base64: string, mime: string): Blob | null {
    try {
        // Check if base64 string contains a comma, indicating it's a Data URL
        const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
        const byteString = atob(base64Data);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mime });
    } catch (error) {
        console.error('Error converting base64 to blob:', error);
        return null; // or handle the error in another appropriate way
    }
}
