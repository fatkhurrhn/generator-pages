const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('pngFile');
const convertButton = document.getElementById('convertButton');
const loadingSpinner = document.getElementById('loadingSpinner');

let files = [];

// Drag and drop functionality
dropzone.addEventListener('click', () => fileInput.click());
dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('bg-gray-200');
});
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('bg-gray-200'));
dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('bg-gray-200');
    files = [...e.dataTransfer.files].filter((file) => file.type === 'image/png');
    if (files.length) {
        dropzone.innerHTML = `<p class="text-gray-600">${files.length} PNG file(s) selected</p>`;
    }
});

// File input fallback
fileInput.addEventListener('change', (e) => {
    files = [...e.target.files];
    dropzone.innerHTML = `<p class="text-gray-600">${files.length} PNG file(s) selected</p>`;
});

// Convert button functionality
convertButton.addEventListener('click', async () => {
    if (files.length === 0) {
        alert('Please upload at least one PNG file!');
        return;
    }

    loadingSpinner.classList.remove('hidden');
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    try {
        const response = await fetch('/convert', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'converted.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } else {
            alert('Conversion failed. Please try again.');
        }
    } catch (err) {
        console.error('Error:', err);
        alert('An error occurred while converting files.');
    } finally {
        loadingSpinner.classList.add('hidden');
    }
});
