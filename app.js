// app.js

document.addEventListener('DOMContentLoaded', function () {
  const uploadForm = document.getElementById('uploadForm');
  const pdfFileInput = document.getElementById('pdfFile');
  const pdfListContainer = document.getElementById('pdfList');

  // Lista de PDFs (dua.pdf estará cargado por defecto)
  let pdfList = [
    {
      name: 'dua.pdf',
      url: 'dua.pdf',
      active: true,
    }
  ];

  // Muestra la lista de PDFs
  function displayPdfList() {
    pdfListContainer.innerHTML = '';

    pdfList.forEach((pdf, index) => {
      const pdfItem = document.createElement('div');
      pdfItem.classList.add('pdf-item');

      const pdfName = document.createElement('p');
      pdfName.textContent = pdf.name;

      const viewButton = document.createElement('button');
      viewButton.textContent = 'Ver como revista';
      viewButton.addEventListener('click', function () {
        openPdfAsMagazine(pdf.url);
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

  // Cargar nuevo PDF
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

  // Mostrar PDF como revista usando Turn.js
  function openPdfAsMagazine(pdfUrl) {
    const newTab = window.open();
    newTab.document.write(`
      <html>
      <head>
        <title>Revista</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #f0f0f0;
            font-family: Arial, sans-serif;
          }
          #flipbook {
            width: 90%;
            height: 90%;
            margin: auto;
            margin-top: 50px;
          }
          .page {
            width: 100%;
            height: 100%;
          }
          iframe {
            width: 100%;
            height: 100%;
            border: none;
          }
        </style>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/turn.js/4/turn.min.js"></script>
      </head>
      <body>
        <div id="flipbook">
          <div class="page"><iframe src="${pdfUrl}#page=1"></iframe></div>
          <div class="page"><iframe src="${pdfUrl}#page=2"></iframe></div>
          <!-- Aquí puedes agregar más páginas -->
        </div>

        <script>
          document.addEventListener('DOMContentLoaded', function() {
            const flipbook = document.getElementById('flipbook');
            $(flipbook).turn({
              width: 800,
              height: 600,
              autoCenter: true
            });
          });
        </script>
      </body>
      </html>
    `);
  }

  // Inicializa la lista de PDFs al cargar la página
  displayPdfList();
});
