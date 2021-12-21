import { useState, useEffect } from 'react';
import './App.css';
import { Switch, Route, Link, useHistory, Redirect } from 'react-router-dom';
import {
  fetchAllProducts,
  fetchCurrentUserFavProducts,
  markAsFavorite,
} from './api';

function Login() {
  const [error, setError] = useState(false);
  const history = useHistory();
  return (
    <form
      onSubmit={function (event) {
        event.preventDefault();
        const body = new URLSearchParams(new FormData(event.target));
        fetch('http://localhost:8000/users/login', {
          method: 'POST',
          body,
        }).then((response) => {
          //! 200
          if (!response.ok) {
            setError(true);
          } else {
            response.json().then((data) => {
              localStorage.setItem('token', data.token);
              localStorage.setItem('username', body.get('username'));
              history.push('/');
            });
          }
        });
      }}
    >
      <label>
        Username <input type="text" name="username" />{' '}
      </label>
      <label>
        Password
        <input type="password" name="password" />
      </label>
      <button>Submit</button>

      {error ? <h1>Something wrong with the username or password</h1> : null}
    </form>
  );
}

function SignUp() {
  //! 3 state variables
  const [isSucccessful, setIsSuccessful] = useState(false);
  return (
    <form
      onSubmit={function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        fetch('http://localhost:8000/users', {
          method: 'POST',
          body: new URLSearchParams(formData),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setIsSuccessful(true);
          });
      }}
    >
      Username: <input type="text" name="username" />
      Email: <input type="email" name="email" />
      Password: <input type="password" name="password" />
      <button>Submit</button>
      {isSucccessful ? <h1 style={{ color: 'green' }}>User Created</h1> : null}
    </form>
  );
}

function AllProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchAllProducts().then((data) => {
      setProducts(data);
    });
  }, []);

  return (
    <>
      <h1>All Products</h1>
      {products.map((product) => {
        const { product_name, _id, isFav } = product;
        return (
          <div key={_id}>
            <h3> {product_name} </h3>
            <button
              style={{ backgroundColor: 'lightpink' }}
              onClick={function (event) {
                markAsFavorite(_id).then(() => {
                  console.log('fav done');
                });
              }}
            >
              {isFav ? 'fav' : 'un fav'}
            </button>
          </div>
        );
      })}
    </>
  );
}

function UserFav({ isLoggedIn }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchCurrentUserFavProducts().then((data) => {
      setProducts(data);
    });
  }, []);

  return (
    <>
      <h1 style={{ color: 'lightblue' }}>Fav Products</h1>
      {isLoggedIn ? (
        products.map((product) => {
          const { product_name, _id } = product;
          return (
            <div key={_id}>
              <h3> {product_name} </h3>
            </div>
          );
        })
      ) : (
        <h3 style={{ color: 'red' }}>Not logged in</h3>
      )}
    </>
  );
}

function Homepage() {
  const history = useHistory();
  const [isLoggedIn] = useState(function () {
    const token = localStorage.getItem('token');
    //! simplify this -- for clarity (token !== undefined)
    if (token) {
      return true;
    }
    return false;
  });

  return (
    <>
      {isLoggedIn ? (
        <h1 style={{ color: 'green' }}> Logged In</h1>
      ) : (
        <h1 style={{ color: 'red' }}> Not Logged In</h1>
      )}
      <h1>Links</h1>
      <div>
        <Link to="/login">Login</Link>
      </div>

      <Link to="/signup">Sign up</Link>

      {isLoggedIn ? (
        <div>
          <Link
            to="/logout"
            onClick={function (event) {
              event.preventDefault();
              localStorage.removeItem('token');
              //! if the page url is /, then
              history.push('/logout');
            }}
          >
            Logout
          </Link>
        </div>
      ) : null}

      <AllProducts />

      <UserFav isLoggedIn={isLoggedIn} />
    </>
  );
}

function Logout() {
  useEffect(() => {
    localStorage.removeItem('token');
  }, []);
  return <Redirect to="/" />;
}

function App() {
  return (
    <>
      <Switch>
        <Route path="/" exact>
          <Homepage />
        </Route>
        <Route path="/logout" exact>
          <Logout />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/signup" exact>
          <SignUp />
        </Route>
      </Switch>
    </>
  );
}

export default App;
