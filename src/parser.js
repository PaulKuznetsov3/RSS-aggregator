const parse = (data) => {
  const parser = new DOMParser();
  const xmlDocument = parser.parseFromString(data, 'text/xml');
  const parseError = xmlDocument.querySelector('parsererror');
  console.log(xmlDocument);
  console.log('err', parseError);

  if (parseError) {
    const error = new Error();
    error.name = 'parseError';

    throw error;
  }
  const chennelTitle = xmlDocument.querySelector('title').textContent;
  const chennelDescr = xmlDocument.querySelector('description').textContent;
  const feed = { chennelTitle, chennelDescr };

  const items = xmlDocument.querySelectorAll('item');
  const posts = [...items].map((post) => {
    const postTitle = post.querySelector('title').textContent;
    const postDescr = post.querySelector('description').textContent;
    const postLink = post.querySelector('link').textContent;
    return { postTitle, postDescr, postLink };
  });

  return { feed, posts };
};

export default (parse);
