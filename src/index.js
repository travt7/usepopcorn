import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

/* import StarRating from "./StarRating"; */

/* function Test() {
  const [movieRating, setMovieRating] = useState(0);
  return (
    <div>
      <StarRating color="blue" maxRating={10} onSetRating={setMovieRating} />
      <p>This movie was rated {movieRating} stars</p>
    </div>
  );
} */
//How will consumer specify X? They will need access to the ratings state in StarRating component

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* Doing it this way so we don't have to create a brand new project just for building 
    this one component.  */}
    {/* <StarRating
      maxRating={5}
      messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
    />
    <StarRating size={24} color="red" className="test" defaultRating={3} />
    <Test /> */}
  </React.StrictMode>
);

//as the user of this component I want to pass in a max rating of 5 stars. But I want to reuse
//the component somewhere else in my app and I want to pass in 10 stars.

//But what if someone used the StarRating compononet without specifying the maxRating property?
//When building a highly reusable component we need to account for all of these situations bc
//we may never know who is actually going to use this component and what props they will specify

//So we need to set a default value for the rating. How? Leverage the power of destructuring
//in JS. Whenever we destructure an object, we can assign default values to the properties.
//StarRating has a destructured props object called maxRating. So if maxRating doesnt exist we
//can set a default value.
