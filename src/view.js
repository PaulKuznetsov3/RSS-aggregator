const renderError = (elements, state, value, i18next) => {
  const { feedback } = elements;
  if (state.form.valid === false) {
    feedback.textContent = i18next.t(value);
    feedback.classList.add('text-danger');
    feedback.classList.remove('text-success');
    elements.input.classList.add('is-invalid');
    elements.input.focus();
  }
  if (state.form.valid === true) {
    feedback.textContent = i18next.t('success');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    elements.input.classList.remove('is-invalid');
    elements.input.focus();
  }
};

const renderFeed = (elements, state, value, i18next) => {
  const { feeds } = elements;
  feeds.innerHTML = '';

  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18next.t('feeds');

  cardBody.append(cardTitle);
  card.append(cardBody);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  value.map((feed) => {
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

    return ul.prepend(li);
  });

  card.append(ul);
  feeds.append(card);
};

const createButton = (post) => {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('data-id', post.id);
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#modal');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  return button;
};

const renderPosts = (elements, state, value, i18next) => {
  const { posts } = elements;
  posts.innerHTML = '';

  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18next.t('posts');

  cardBody.append(cardTitle);
  card.append(cardBody);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  value.map((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const a = document.createElement('a');
    a.setAttribute('href', post.postLink);
    a.setAttribute('data-id', post.id);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    if (state.uiState.displayedIDs.has(post.id)) {
      a.classList.add('fw-normal');
    } else {
      a.classList.add('fw-bold');
    }
    a.textContent = post.postTitle;
    li.append(a);
    const button = createButton(post);
    button.textContent = i18next.t('button');
    li.append(button);
    return ul.prepend(li);
  });
  card.append(ul);
  posts.append(card);
};

const renderModal = (elements, state, value) => {
  const { modalHeader } = elements;
  modalHeader.textContent = value.postTitle;
  const { modalBody } = elements;
  modalBody.textContent = value.postDescr;
  elements.modalButton.setAttribute('href', value.postLink);
  const a = document.querySelector(`[data-id='${value.id}']`);
  a.classList.remove('fw-bold');
  a.classList.add('fw-normal');
};

const renderButton = (elements, state) => {
  console.log(state.form.process);
  const { button } = elements;
  if (state.form.process !== 'send') {
    button.disabled = false;
  }
  if (state.form.process === 'send') {
    button.disabled = true;
  }
};
const render = (state, elements, i18next) => (path, value) => {
  switch (path) {
    case 'form.errors': {
      renderError(elements, state, value, i18next);
      break;
    }
    case 'form.feeds': {
      renderFeed(elements, state, value, i18next);
      break;
    }
    case 'form.posts': {
      renderPosts(elements, state, value, i18next);
      break;
    }
    case 'uiState.readPost': {
      renderModal(elements, state, value, i18next);
      break;
    }
    case 'form.process': {
      renderButton(elements, state);
      break;
    }
    default:
      break;
  }
};
export default render;
