const renderError = (elements, state, value, i18next) => {
  const { feedback } = elements;
  if (state.form.valid === false) {
   // console.log(value);
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

// const creatCard = (elements, state, value, i18next) => {
  
// }

const renderFeed = (elements, state, value, i18next) => {
  const { feeds } = elements;
  feeds.innerHTML = '';

  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18next.t(`feeds`);

  cardBody.append(cardTitle);
  card.append(cardBody);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  value.map((feed) => {
    //console.log( feed.chennelTitle)
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
   
    const feedTitle = document.createElement('h3');
    feedTitle.classList.add('h6', 'm-0');
    feedTitle.textContent = feed.chennelTitle;
    
    

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.chennelDescr;
   
    li.append(feedTitle);

    li.append(p);

    ul.append(li)
  })
  
  card.append(ul)
  feeds.append(card)
}

const createButton = (post) => {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('data-id', post.id);
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#modal');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.textContent = 'Просмотр';
  return button;
}

const renderPosts = (elements, state, value, i18next) => {
  const { posts } = elements;
  posts.innerHTML = '';

  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18next.t(`posts`);

  cardBody.append(cardTitle);
  card.append(cardBody);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  value.map((post) => {
    //console.log('post', post)
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const a = document.createElement('a');
    a.setAttribute('href', post.postLink);
    a.setAttribute('data-id', post.id);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.classList.add('fw-bold');
    a.textContent = post.postTitle;

    li.append(a)

    const button = createButton(post);

    li.append(button);

    ul.append(li)
  })
  card.append(ul)
  posts.append(card)
};

const render = (state, elements, i18next) => (path, value) => {
  switch (path) {
    case 'form.errors': {
      renderError(elements, state, value, i18next);
      break;
    };
    case 'form.feeds': {
      renderFeed(elements, state, value, i18next);
      break;
    };
    case 'form.posts': {
      renderPosts(elements, state, value, i18next);
      break;
    };
    default:
      break;
  }

}
export default render;
