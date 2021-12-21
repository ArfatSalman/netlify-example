function fetchAllProducts() {
  return fetch('http://localhost:8000/products?json').then((res) => res.json());
}

function fetchCurrentUserFavProducts() {
  return fetch(
    `http://localhost:8000/users/${localStorage.getItem('username')}/favorite`,
    {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    }
  ).then((res) => res.json());
}

function markAsFavorite(pid) {
  const body = new URLSearchParams();
  body.append('pid', pid);
  return fetch(
    `http://localhost:8000/users/${localStorage.getItem('username')}/favorite`,
    {
      method: 'POST',
      body: body,
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    }
  ).then((res) => res.json());
}

export { fetchAllProducts, fetchCurrentUserFavProducts, markAsFavorite };
