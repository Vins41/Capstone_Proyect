const preguntas = [
  { texto: "<strong>P1:</strong> En el último mes, ¿con qué frecuencia te has sentido molesto por algo que pasó sin esperarlo?", invertida: false },
  { texto: "<strong>P2:</strong> En el último mes, ¿con qué frecuencia sentiste que no podías controlar las cosas importantes de tu vida?", invertida: false },
  { texto: "<strong>P3:</strong> En el último mes, ¿con qué frecuencia te has sentido nervioso o estresado?", invertida: false },
  { texto: "<strong>P4:</strong> En el último mes, ¿con qué frecuencia te has sentido seguro de poder manejar tus problemas personales?", invertida: true },
  { texto: "<strong>P5:</strong> En el último mes, ¿con qué frecuencia has sentido que las cosas te salían bien?", invertida: true },
  { texto: "<strong>P6:</strong> En el último mes, ¿con qué frecuencia sentiste que no podías con todas tus tareas o responsabilidades?", invertida: false },
  { texto: "<strong>P7:</strong> En el último mes, ¿con qué frecuencia has podido mantener la calma cuando algo te molestaba?", invertida: true },
  { texto: "<strong>P8:</strong> En el último mes, ¿con qué frecuencia sentiste que tenías el control de las cosas en tu vida?", invertida: true },
  { texto: "<strong>P9:</strong> En el último mes, ¿con qué frecuencia te sentiste frustrado porque las cosas se salían de tu control?", invertida: false },
  { texto: "<strong>P10:</strong> En el último mes, ¿con qué frecuencia sentiste que los problemas se acumulaban tanto que no podías con ellos?", invertida: false }
];


const respuestasTexto = ["Nunca", "Casi nunca", "Algunas veces", "Casi siempre", "Siempre"];
const preguntasDiv = document.getElementById('preguntas');

// Generar las preguntas dinámicamente
preguntas.forEach((preg, i) => {
    const div = document.createElement('div');
    div.className = 'pregunta';

    const label = document.createElement('label');
    label.textContent = preg.texto;
    div.appendChild(label);

    const radioGroup = document.createElement('div');
    radioGroup.className = 'radio-group';

    const valores = preg.invertida ? [4,3,2,1,0] : [0,1,2,3,4];

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

// Enviar respuestas al backend SQL Server
document.getElementById('formEncuesta').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = { genero: parseInt(document.getElementById('genero').value) };

    for (let i = 1; i <= 10; i++) {
        const selected = document.querySelector(`input[name="p${i}"]:checked`);
        if (!selected) {
            alert(`Por favor responde la pregunta ${i}`);
            return;
        }
        data[`p${i}`] = parseInt(selected.value);
    }

    try {
        const res = await fetch('https://capstone-backend-vins.azurewebsites.net/respuestas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        alert(result.message); // tu backend devuelve rowsAffected, no id
        document.getElementById('formEncuesta').reset();
    } catch (err) {
        console.error(err);
        alert('Error al enviar la encuesta');
    }
});
