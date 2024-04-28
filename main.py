import io
import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from rembg import remove

app = FastAPI()

# Mount the 'static' directory to serve files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def read_index():
    """
    Serve the index.html file.
    """
    return FileResponse("static/index.html")

@app.post("/process_image")
async def process_image(file: UploadFile = File(...)):
    """
    Process the uploaded image to remove the background and return the processed image data.
    """
    try:
        # Read the uploaded image file
        contents = await file.read()
        
        # Process the image to remove the background
        img_with_bg_removed = remove(contents)

        # Return the processed image data as a response
        return StreamingResponse(io.BytesIO(img_with_bg_removed), media_type="image/png")
    except Exception as e:
        # Handle any errors during image processing
        raise HTTPException(status_code=500, detail=f"Image processing failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
