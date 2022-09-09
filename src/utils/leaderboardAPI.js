
const create = (data) => {
  return fetch('/.netlify/functions/score-create', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json();
  });
};

const getAll = () => {
  return fetch('/.netlify/functions/score-getAll', {
    method: 'GET'
  }).then(response => {
    return response.json();
  });
};

export { create, getAll };