const preguntas = [
  { texto: "P1: En el último mes, ¿con qué frecuencia te has sentido molesto por algo que pasó sin esperarlo?" },
  { texto: "P2: En el último mes, ¿con qué frecuencia has sentido que no podías controlar las cosas importantes de tu vida?" },
  { texto: "P3: En el último mes, ¿con qué frecuencia te has sentido ansioso o estresado?" },
  { texto: "P4: En el último mes, ¿con qué frecuencia te has sentido seguro de poder manejar tus problemas personales?" },
  { texto: "P5: En el último mes, ¿con qué frecuencia has sentido que las cosas te salían bien?" },
  { texto: "P6: En el último mes, ¿con qué frecuencia sentiste que no podías con todas tus tareas o responsabilidades?" },
  { texto: "P7: En el último mes, ¿con qué frecuencia has podido mantener la calma cuando algo te molestaba?" },
  { texto: "P8: En el último mes, ¿con qué frecuencia sentiste que tenías el control de las cosas en tu vida?" },
  { texto: "P9: En el último mes, ¿con qué frecuencia te sentiste frustrado porque las cosas se salían de tu control?" },
  { texto: "P10: En el último mes, ¿con qué frecuencia sentiste que los problemas se acumulaban tanto que no podías con ellos?" }
];

const respuestasTexto = ["Nunca", "Casi nunca", "Algunas veces", "Casi siempre", "Siempre"];
const preguntasDiv = document.getElementById('preguntas');

// Generar preguntas dinámicamente
preguntas.forEach((preg, i) => {
  const div = document.createElement('div');
  div.className = 'pregunta';

  const label = document.createElement('label');
  label.textContent = preg.texto;
  div.appendChild(label);

  const radioGroup = document.createElement('div');
  radioGroup.className = 'radio-group';

  const valores = [0, 1, 2, 3, 4];
  respuestasTexto.forEach((text, j) => {
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = `p${i+1}`;
    input.value = valores[j];
    input.id = `p${i+1}_${j}`;

    const inputLabel = document.createElement('label');
    inputLabel.htmlFor = input.id;
    inputLabel.textContent = text;

    radioGroup.appendChild(input);
    radioGroup.appendChild(inputLabel);
  });

  div.appendChild(radioGroup);
  preguntasDiv.appendChild(div);
});

// Enviar respuestas al backend
document.getElementById('formEncuesta').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = { genero: parseInt(document.getElementById('genero').value) };

  for (let i = 1; i <= 10; i++) {
    const selected = document.querySelector(`input[name="p${i}"]:checked`);
    if (!selected) {
      Swal.fire({
        icon: 'warning',
        title: 'Falta responder',
        text: `Por favor responde la pregunta ${i}`
      });
      return;
    }
    data[`p${i}`] = parseInt(selected.value);
  }

  Swal.fire({
    title: 'Enviando respuestas...',
    text: 'Por favor espera un momento',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  try {
  const response = await fetch('https://capstone-backend-vins.azurewebsites.net/respuestas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const text = await response.text();
  console.log("🧾 Respuesta cruda del servidor:", text);

  let result;
    try {
        result = JSON.parse(text);
    } catch {
        throw new Error("⚠️ La respuesta no es JSON válido");
    }

    console.log("✅ Resultado parseado:", result);

    if (result.prediccion === undefined || result.probabilidad === undefined) {
        throw new Error("⚠️ Faltan datos en la respuesta del servidor");
    }

    Swal.fire({
        icon: 'success',
        title: 'Resultado del test',
        html: `
        <b>Predicción:</b> ${result.prediccion}<br>
        <b>Probabilidad:</b> ${result.probabilidad}%
        `,
        confirmButtonText: 'Aceptar'
    });

    document.getElementById('formEncuesta').reset();

    } catch (err) {
    console.error(err);
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar la encuesta. Inténtalo de nuevo.'
    });
    }

});
