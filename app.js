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

  // Mostrar PDF como revista usando Turn.js y pdf.js
  async function openPdfAsMagazine(pdfUrl) {
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
          img {
            width: 100%;
            height: 100%;
          }
        </style>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/turn.js/4/turn.min.js"></script>
      </head>
      <body>
        <div id="flipbook"></div>

        <script>
          document.addEventListener('DOMContentLoaded', async function() {
            const pdfUrl = "${pdfUrl}";
            const flipbook = document.getElementById('flipbook');

            const loadingTask = pdfjsLib.getDocument(pdfUrl);
            const pdf = await loadingTask.promise;

            const totalPages = pdf.numPages;

            // Crear cada página como imagen
            for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
              const page = await pdf.getPage(pageNum);
              const scale = 1.5;
              const viewport = page.getViewport({ scale });

              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.height = viewport.height;
              canvas.width = viewport.width;

              const renderContext = {
                canvasContext: context,
                viewport: viewport
              };

              await page.render(renderContext).promise;

              const img = document.createElement('img');
              img.src = canvas.toDataURL();

              const pageDiv = document.createElement('div');
              pageDiv.classList.add('page');
              pageDiv.appendChild(img);
              flipbook.appendChild(pageDiv);
            }

            // Iniciar Turn.js
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
