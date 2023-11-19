import { useEffect } from "react";
import { useState } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "359bbeec";

//structural component-only responsible for structure/layout of the application. Includes App
//NavBar and Main
export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null); //Why just store the Id and not entire movie object?
  //Reason is the movies we get from the search(in our first Box component)are limited data. Just
  //the title,year, and poster. On the other Box component we want all kinds of details that
  //are not included in the first search. So there will have to be another API call when we
  //click on the individual movie in the list then there will be more details to show up in the
  //2nd box. The movie will be fetched based on the Id we got in the array of movies. selectedId piece
  //of state will store the movie object that is selected from the list. Updating the selectedId state
  //will happen in the box on the left but the displaying of the movie happens in the 2nd Box. So both
  //boxes will need to know about the selectedId. So it definitely must live in the parent component
  //of the 2 boxes.

  //then method gets access to the res and the function converts it to JSON. Which then returns
  //another promise then we chain on another then. Then we get access to the data and for now
  //just log it to the console.

  //useEffect is like an event listener that is listening for one dependency to change. Whenever
  //a dependency changes, it will execute the effect again.
  //Effects are used to keep a component's state and props(dependencies) synchronized with some
  //external system that lives outside our React based code. What happens to a component whenever
  //it's state or props are updated? Component is rerendered! So Effects and component lifecycle
  //are deeply connected.
  //useEffect doesn't return anything so we don't store the result into any variable but instead
  //we pass in a function. The func is called our Effect and contains the code we want to run
  //as a side effect when the query state changes. The query state changing causes the App to rerender
  //and the side effect in the function makes API call again.  Basically what we want to register as a side effect to be executed at a
  //certain point in time. A side effect is basically any "interaction between a React component
  //and the world outside the component and make our applications do something." But they cannot
  //be contained in render logic. Instead we can create side effects in 2 different places: Inside
  //event handlers and the useEffect hook(which is triggered by rendering). useEffect allows for
  //writing code that will run at different moments in a component instance's life cycle: When
  //the component mounts, rerenders, or even when it unmounts.
  useEffect(() => {
    async function fetchMovies() {
      //set isLoading to true before the fetching starts and set back to false when fetching finishes
      //we want to fetch movies based on the query state
      try {
        setIsLoading(true);
        //before we start fetching for data we reset the error state
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
        );
        //if user doesn't receive response bc internet down etc
        if (!res.ok)
          throw new Error("Something went wrong with fetching movies");

        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found");

        setMovies(data.Search);
      } catch (err) {
        console.error(err.message);
        setError(err.message); //message property is string I passed into the Error. err is the
        //error itself as it was passed into the catch block
      } finally {
        setIsLoading(false);
      }
    }
    //When we have NO search query UI tells us 'Movie not found'. Which is true bc the API
    //searched for a movie with an empty string on initial render bc that's our query state
    //default.
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    } //then return so fetchMovies function won't even be called.

    fetchMovies();
  }, [query]);
  //Our useEffect hook is basically like an event handler that is listening for the query to change.
  //When query changes the entire effect is executed again. Query changes everytime I type into the input.

  //passing in empty array means that the effect that we just specified will only run on mount/
  //when App component renders for the first time.

  //In the example before without useEffect() Jonas 143 the fetch func was executed while the
  //App component was rendering causing an infinite loop. Now this effect, the fetch function
  //will be executed after the render phase using useEffect.

  //***write event handler function in the component that owns the state. Then we pass it down to some
  //child component to update the state in the parent.
  const handleSelectMovie = (id) => {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  };
  //If the movie is clicked on again after the initial click to open it's details, let's have
  //the movie close. If the id being passed in is equal to the already selected one, then set
  //back to null. If the id being passed in is not equal to
  //the already selected one then set selectedId to the passed in id.

  const handleCloseMovie = () => {
    setSelectedId(null);
  };

  //This handler function is going to add a new item to our watched array state variable up top. That array starts at
  //0 movie object elements. We already have the WatchedMovieList and WatchedMovie components down below. Each of the
  //movies in the WatchedMovie component needs the poster, title, imdbRating, userRating, runTime. So basically we need
  //to create a brand new object for each of these movies and then pass each object into the watched array.
  const handleAddWatched = (movie) => {
    setWatched((watched) => [...watched, movie]);
  };
  //we get the current watched movies array(the argument watched we pass in to setWatched), then we create a brand new
  //watched movies array based on all the elements of the watched array, and then the brand new movie object passed into
  //our event handler.

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              //we are passing handleAddWatched into MovieDetails bc MovieDetails component is where we will have the
              //button(below the StarRating)to add the movie to the watched list.
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
//Why the fragment? At the 3rd part of the ternary operator which contains the WatchedSummary
//and WatchedMoviesList components we needed a new piece of JSX which cannot have 2 elements as
//the root element. So we created 1 root element with the fragment.

//Main never needed movies state in the first place. It only needed it to pass it further down
//the component tree. NavBar same thing. NumResults needed the movies state not NavBar.

//MoviesList component is the only one that actually needs the movies state, not Main or
//ListBox. Thanks to the component composition we can pass the movies state DIRECTLY into the
//MoviesList component.

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>❌</span> {message}
    </p>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  //need query state inside of it's parent component so lift it up
  //const [query, setQuery] = useState("");
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

/* function WatchedBox() {
  const [watched, setWatched] = useState(tempWatchedData);
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        
      )}
    </div>
  );
} */

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} onSelectMovie={onSelectMovie} key={movie.imdbID} />
      ))}
    </ul>
  );
}
//<li onClick={onSelectMovie}> This syntax directly assigns the onSelectMovie function
//as the event handler. It means that when the <li> element is clicked, the onSelectMovie
//function will be called without any arguments.

//The syntax I use below uses an arrow function to create an inline anonymous function.
//When the <li> element is clicked, this inline function is executed, and it, in turn, calls
//onSelectMovie with the movie.imdbID as an argument. This is useful when you need to pass
//some information about the specific movie that was clicked to the onSelectMovie function.
function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

//Whenever this MovieDetails component is going to mount, we will want to fetch the movie
//corresponding to the selectedId. Since we want to load the currently selected movie
//every time this component mounts, that means we want a useEffect. We want the effect
//function to run each time the component renders. Now we should be ready to use the data object
//from the API response in the JSX.

//We want to be able to get the star rating from the user and as we add the movie to the WatchedList,
//that should be the rating that is added to the newWatchedMovie object literal. So we need the
//state that is in the StarRating component inside our MovieDetails component.
//HOW do we do that? When we created StarRating we made a way of getting that state outside of
//the component by adding in a function called onSetRating prop and we can pass a state setter
//function into it. So we need that state setter function in MovieDetails
function MovieDetails({ selectedId, onCloseMovie, onAddWatched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(""); //Add the new userRating state from
  //StarRating component to the newWatchedMovie object literal.
  //MovieDetails has a delay when clicking on the Movie in the left box. Reason is the Movie has to be
  //fetched. So we need a quick loading indicator for user.
  //destructure properties into variables from the movie object. API gives us back upper case
  //properties for some reason.
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  //console.log(title, year); //At first we get undefined undefined and after a second or two we
  //get the title and the year. Why? When component is initially mounted during render, the movie
  //object we destructured is still the default empty object and title and year read from the
  //empty object are undefined. Then the effect starts, effect function called which gets the
  //movie and setMovie stores it into our movie state causing component to rerender and the state
  //is no longer empty. NOW let's use it in our JSX!

  const handleAdd = () => {
    //How does handleAdd know what the newWatchedMovie is when onClick prop fires on the button?
    //BC we created a key called imdbID and assigned the current selectedId passed to this component via prop as the value.
    //When we click on the button +Add to list handleAdd fires, a new object is created with key value pairs that came
    //from destructuring the movie object
    //this will call the function we passed in to this MovieDetails component as a prop called onAddWatched
    //from App. Remember onAddWatched needs a new movie object as the input. A new watched movie. This new movie object
    //will need a property called imdbRating and we can use the one that is currently selected. So the currently selected
    //id is the imdb rating of that movie that we are going to add.
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      //needs to be a Number so we can calculate the averages in the WatchedSummary component
      imdbRating: Number(imdbRating), //this is the actual destructured variable above we pass to Number. imdbRating is
      //a property/key we created on the newWatchedMovie object.
      runtime: Number(runtime.split(" ").at(0)),
      //runtime is a variable that presumably holds a string representing the movie's runtime.
      //.split(" "): This part of the code uses the split method on the runtime string. The
      //split method splits a string into an array of substrings based on a specified delimiter.
      //In this case, the delimiter is a space " ". So, if runtime is, for example, "120 min",
      //after the split operation, you would get an array ["120", "min"].
      //.at(0): This part accesses the first element of the array resulting from the split operation.
      //The at method is used here to access the element at the specified index, and in this case,
      //the index is 0. So, if we continue with the example from step 2, .at(0) would give you the
      //string "120".
      userRating,
      //We only want to allow a movie to be added to the list if the user actually gave it a rating
      //If userRating > 0 then display the button
    };
    onAddWatched(newWatchedMovie);
    //after adding newWatchedMovie we want to close MovieDetails. onCloseMovie prop sets selectedId back to null and then
    //MovieDetails component is conditionally not rendered due to selectedId being falsey.
    onCloseMovie();
  };

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    }
    getMovieDetails();
  }, [selectedId]);
  //selectedId is the prop that actually changes and so it must be included in the dependency array. Therefore the effect
  //will indeed be executed again.
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              <StarRating
                maxRating={10}
                size={24}
                onSetRating={setUserRating}
              />

              {userRating > 0 && (
                <button className="btn-add" onClick={handleAdd}>
                  + Add to list
                </button>
              )}
            </div>

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watched }) {
  //passed watched arr into this component and moved the 3 derived state from the watched arr
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}
