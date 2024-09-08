// app.js

document.addEventListener('DOMContentLoaded', function () {
  const uploadForm = document.getElementById('uploadForm');
  const pdfFileInput = document.getElementById('pdfFile');
  const pdfListContainer = document.getElementById('pdfList');
  
  let pdfList = []; // Lista de PDFs subidos

  // Maneja la subida de PDF
  uploadForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const file = pdfFileInput.files[0];

    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      
      reader.onload = function (e) {
        const pdfObject = {
          name: file.name,
          url: e.target.result,
          active: true,
        };
        
        pdfList.push(pdfObject);
        displayPdfList();
      };
      
      reader.readAsDataURL(file);
    } else {
      alert('Por favor, selecciona un archivo PDF válido.');
    }
  });

  // Muestra la lista de PDFs subidos
  function displayPdfList() {
    pdfListContainer.innerHTML = '';

    pdfList.forEach((pdf, index) => {
      const pdfItem = document.createElement('div');
      pdfItem.classList.add('pdf-item');

      const pdfName = document.createElement('p');
      pdfName.textContent = pdf.name;

      const viewButton = document.createElement('button');
      viewButton.textContent = 'Ver PDF';
      viewButton.addEventListener('click', function () {
        openPdfInNewTab(pdf.url);
      });

      const toggleButton = document.createElement('button');
      toggleButton.textContent = pdf.active ? 'Desactivar' : 'Activar';
      toggleButton.addEventListener('click', function () {
        pdf.active = !pdf.active;
        displayPdfList();
      });

      pdfItem.appendChild(pdfName);
      pdfItem.appendChild(viewButton);
      pdfItem.appendChild(toggleButton);

      if (pdf.active) {
        pdfListContainer.appendChild(pdfItem);
      }
    });
  }

  // Abrir PDF en una nueva pestaña
  function openPdfInNewTab(pdfUrl) {
    const newTab = window.open();
    newTab.document.write(`
      <html>
      <head>
        <title>Visor de PDF</title>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
          }
          iframe {
            width: 100%;
            height: 100%;
            border: none;
          }
        </style>
      </head>
      <body>
        <iframe src="${pdfUrl}" frameborder="0"></iframe>
      </body>
      </html>
    `);
  }
}); 
