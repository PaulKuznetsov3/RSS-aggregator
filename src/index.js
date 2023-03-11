import i18n from 'i18next';
import app from './init.js';
import './style.scss';
import resources from './locale/index.js';

const runApp = () => {
    const i18nextInstance = i18n.createInstance();
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
