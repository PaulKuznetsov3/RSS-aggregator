import * as yup from 'yup';
import onChange from 'on-change';
import keyBy from 'lodash/keyBy.js';
import i18n from 'i18next';
import axios from 'axios';
import { uniqueId } from 'lodash';
import render from './view.js';
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

const update = (watchedState) => {
  const promise = watchedState.form.feeds.map((feed) => getResponse(feed.link).then((response) => {
    const data = parse(response.data.contents);
    const { posts } = data;
    const postsLinks = watchedState.form.posts.map((post) => post.postLink);
    const addPosts = posts.filter((post) => !postsLinks.includes(post.postLink));
    addPosts.map((item) => {
      const post = item;
      post.id = uniqueId();
      post.feedId = feed.id;
      return post;
    });
    watchedState.form.posts.unshift(...addPosts);
    return addPosts;
  }));
  return Promise.all(promise).then(() => setTimeout(update, 5000, watchedState));
};

const app = (i18next) => {
  const state = {
    form: {
      process: 'fill',
      valid: '',
      errors: {},
      urls: [],
      feeds: [],
      posts: [],
    },
    uiState: {
      readPost: '',
      displayedIDs: new Set(),
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
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
    modalHeader: document.querySelector('.modal-header'),
    modalBody: document.querySelector('.modal-body'),
    modalButton: document.querySelector('.btn'),
  };

  yup.setLocale({
    string: {
      url: () => ({ key: 'notUrl' }),
    },
    mixed: {
      notOneOf: () => ({ key: 'alreadyInList' }),
    },
  });

  const watchedState = onChange(state, render(state, elements, i18next));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const input = formData.get('url');

    validate(input, watchedState.form.urls)
      .then((url) => {
        watchedState.form.valid = true;
        watchedState.form.errors = {};
        watchedState.form.urls = [...watchedState.form.urls, url];
        watchedState.form.process = 'send';
        elements.form.reset();
        return getResponse(input);
      })
      .then((response) => {
        const data = parse(response.data.contents);
        const { feed, posts } = data;
        const feedId = uniqueId();
        feed.id = feedId;
        feed.link = input;
        posts.map((item) => {
          const post = item;
          post.id = uniqueId();
          post.feedId = feedId;
          return post;
        });
        watchedState.form.process = 'ok';
        watchedState.form.feeds.push(feed);
        watchedState.form.posts.push(...posts);
      })
      .catch((err) => {
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

  elements.posts.addEventListener('click', (e) => {
    const readPost = watchedState.form.posts.find((post) => post.id === e.target.dataset.id);
    watchedState.uiState.readPost = readPost;
    watchedState.uiState.displayedIDs.add(readPost.id);
  });
  update(watchedState);
};

export default app;
