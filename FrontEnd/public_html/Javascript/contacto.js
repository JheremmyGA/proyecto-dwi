document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-contacto');
  const popup = document.getElementById('contacto-popup');
  if (!form) return;

  const showPopup = (time = 3000) => {
    if (!popup) return;
    popup.setAttribute('aria-hidden', 'false');
    popup.classList.add('visible');
    setTimeout(() => {
      popup.classList.remove('visible');
      popup.setAttribute('aria-hidden', 'true');
    }, time);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validación nativa
    if (!form.checkValidity()) {
      // Muestra mensajes nativos y enfoca el primer campo inválido
      form.reportValidity();
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Opcional: aquí podrías enviar los datos al servidor (fetch)
    // const data = new FormData(form);

    form.reset();
    showPopup(3000);
  });

  // Cerrar popup al hacer click o presionar Escape
  if (popup) {
    popup.addEventListener('click', () => {
      popup.classList.remove('visible');
      popup.setAttribute('aria-hidden', 'true');
    });
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && popup.classList.contains('visible')) {
        popup.classList.remove('visible');
        popup.setAttribute('aria-hidden', 'true');
      }
    });
  }
});