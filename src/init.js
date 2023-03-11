import * as yup from 'yup';
import onChange from 'on-change';
import keyBy from 'lodash/keyBy.js';
import renderError from './view.js';
import i18n from 'i18next';

const validate = (url, urlsList) => {
  try {
    const schema = yup.string()
      .url()
      .required()
      .notOneOf(urlsList);

    return schema.validate(url, { abortEarly: false });
  } catch (e) {
    console.log(e);
    return keyBy(e.inner, 'path');
  }
};

const app = (i18n) => {
  const state = {
    form: {
      process: 'fill',
      valid: false,
      errors: {},
      url: '',
      feeds: [],
    },
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    button: document.querySelector('button'),
    feedback: document.querySelector('.feedback'),
  };

  yup.setLocale({
    string: {
      url: () => ({ key: 'notUrl' }),
    },
    mixed: {
      notOneOf: () => ({ key: 'alreadyInList' }),
    },
  });

  const watchedState = onChange(state, (path) => {
    console.log(path);
    switch (path) {
      case 'form.errors': {
        renderError(elements, watchedState.form.errors);
        break;
      }
      default:
        break;
    }
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const urls = formData.get('url');

    validate(urls, watchedState.form.feeds).then((url) => {
      watchedState.form.errors = 'RSS успешно загружен';
      watchedState.form.valid = true;
      watchedState.form.feeds = [...watchedState.form.feeds, url];
      console.log(watchedState.form.feeds);

      elements.form.reset();
    })
      .catch((err) => {
        console.log(err.message.key)
        const errors = err.message.key;
        watchedState.form.errors = errors;
        watchedState.form.valid = false;
      });
  });
};

export default app;
