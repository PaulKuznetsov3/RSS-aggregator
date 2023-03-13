const renderError = (elements, state, value, i18next) => {
  const { feedback } = elements;
  if (state.form.valid === false) {
    feedback.textContent = i18next.t(value);
    elements.feedback.classList.add('text-danger');
    elements.feedback.classList.remove('text-success');
    elements.input.classList.add('is-invalid');
    elements.input.focus();
  }
  if (state.form.valid === true) {
    feedback.textContent = i18next.t('success');
    elements.feedback.classList.remove('text-danger');
    elements.feedback.classList.add('text-success');
    elements.input.classList.remove('is-invalid');
    elements.input.focus();
  }
};

export default renderError;
