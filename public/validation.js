(() => {
    'use strict'

    const forms = document.querySelectorAll('.needs-validation')

    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

  document.addEventListener('DOMContentLoaded', function() {
    const successMessage = document.querySelector('.success-message');
    if (successMessage) {
      setTimeout(() => {
        successMessage.style.display = 'none';
      }, 5000);
    }
  });

  document.addEventListener('DOMContentLoaded', function() {
    const errorMessage = document.querySelector('.error-message');
    if (errorMessage) {
      setTimeout(() => {
        errorMessage.style.display = 'none';
      }, 5000);
    }
  }); 