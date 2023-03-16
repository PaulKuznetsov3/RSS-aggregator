import * as yup from 'yup';
import onChange from 'on-change';
import keyBy from 'lodash/keyBy.js';
import i18n from 'i18next';
import axios from 'axios';
import renderError from './view.js';
import resources from './locale/index.js';
import parse from './parser.js';

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

const getResponse = (url) => {
  const allOrigins = 'https://allorigins.hexlet.app/get';
  const preparedURL = new URL(allOrigins);
  preparedURL.searchParams.set('disableCache', 'true');
  preparedURL.searchParams.set('url', url);
  return axios.get(preparedURL);
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
    // console.log(path, value);
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
    const input = formData.get('url');

    validate(input, watchedState.form.feeds)
      .then((url) => {
        watchedState.form.valid = true;
        watchedState.form.errors = {};
        watchedState.form.feeds = [...watchedState.form.feeds, url];
        watchedState.form.process = 'send';
        elements.form.reset();
        return getResponse('https://ru.hexlet.io/lessons.rss');
      })
      .then((response) => {
        console.log(response);
        const data = parse(response.data.contents);
        console.log(data);
      })
      .catch((err) => {
        console.log(err.name);
        if (err.name === 'ValidationError') {
          watchedState.form.valid = false;
          const error = err.message.key;
          watchedState.form.errors = error;
          watchedState.form.process = 'error';
        }
        if (err.name === 'AxiosError') {
          watchedState.form.valid = false;
          watchedState.form.errors = 'networkError';
          watchedState.form.process = 'error';
        }
        if (err.name === 'parseError') {
          watchedState.form.valid = false;
          watchedState.form.errors = 'notRss';
          watchedState.form.process = 'error';
        }
      });
  });
};

export default app;
