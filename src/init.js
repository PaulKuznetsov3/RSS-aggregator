// @ts-check

import * as yup from 'yup';
import onChange from 'on-change';
import keyBy from 'lodash/keyBy.js';
import isEmpty from 'lodash/isEmpty.js';
import renderError from './view.js';

const validate = (url, urlsList) => {
  try {
    const schema = yup.string()
      .url('Ссылка должна быть валидным URL')
      .required()
      .notOneOf(urlsList, 'RSS уже существует');

    return schema.validate(url, { abortEarly: false });
  } catch (e) {
    console.log(e)
    return keyBy(e.inner, 'path');
  }
 
  };

 
const app = () => {

    const state = {
        form: {
            process: 'fill',
            valid: false,
            errors: {},
            url: '',
            feeds: []
        }
    }

    const elements = {
        form: document.querySelector('.rss-form'),
        input: document.querySelector('#url-input'),
        button: document.querySelector('button'),
        feedback: document.querySelector('.feedback')
      }

    const watchedState = onChange(state, (path, value, previousValue) => {
      console.log(path)
        switch(path) {
          case 'form.errors': {
            renderError(elements, watchedState.form.errors)
            break;
          }
        }
    })

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const url = formData.get('url');
     
  
      validate(url, watchedState.form.feeds).then((url) => {
        watchedState.form.errors = 'RSS успешно загружен';
        watchedState.form.valid = true;
        watchedState.form.feeds = [...watchedState.form.feeds, url]
        console.log(watchedState.form.feeds)
        
        
        elements.form.reset()
      })
      .catch((err) => {
      
        const errors  = err.message
        watchedState.form.errors = errors;
        watchedState.form.valid = false;
       
      })
     
    })
  

};

export default app;