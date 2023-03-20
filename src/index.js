import i18next from 'i18next';
import app from './init.js';
import './style.scss';
import 'bootstrap';
import resources from './locale/index.js';

const runApp = () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  })
    .then(() => {
      app(i18nextInstance);
    });
};

runApp();
