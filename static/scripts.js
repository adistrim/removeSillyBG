const dropArea = document.getElementById('drop-area');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.add('dragover'), false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.remove('dragover'), false);
});

dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    handleFiles(files);
}

function handleFiles(files) {
    const a = document.createElement('a');
    a.style.display = 'none';
    document.body.appendChild(a);

    for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        fetch('/process_image', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to process image');
            }
            return response.blob();
        })
        .then(blob => {
            const originalFilename = file.name;
            const processedFilename = originalFilename.replace(/\.[^/.]+$/, "") + '_bgremoved.png';
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = processedFilename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}
