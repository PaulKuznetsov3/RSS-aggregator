import * as yup from 'yup';
import onChange from 'on-change';
import keyBy from 'lodash/keyBy.js';
import i18n from 'i18next';
import renderError from './view.js';
import resources from './locale/index.js';

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

const app = (i18next) => {
  const state = {
    form: {
      process: 'fill',
      valid: '',
      errors: {},
      url: '',
      feeds: [],
    },
  };

  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  });

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

  const watchedState = onChange(state, (path, value) => {
    // console.log( value);
    switch (path) {
      case 'form.errors': {
        renderError(elements, watchedState, value, i18next);
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
      watchedState.form.valid = true;
      watchedState.form.errors = {};
      watchedState.form.feeds = [...watchedState.form.feeds, url];

      elements.form.reset();
    })
      .catch((err) => {
        watchedState.form.valid = false;
        const error = err.message.key;

        watchedState.form.errors = error;
        // console.log(watchedState.form.errors)
      });
  });
};

export default app;
