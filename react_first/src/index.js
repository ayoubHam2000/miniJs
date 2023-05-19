import React from "react";
import ReactDOM from "react-dom/client";

function FirstComponenent(props) {
  let listItems = ["dumpy", "pudgy", "tubby"];

  const mapItems = listItems.map((item, index) => {
    return <h1 key={index}>{item}</h1>;
  });

  return (
    <React.Fragment>
      <h1> {props.title} </h1>
      <article>{mapItems}</article>
    </React.Fragment>
  );
}

function EventComponent() {
  const handleInputChange = () => {
    console.log("Hi!");
  };

  return (
    <div>
      <input onClick={handleInputChange}></input>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<EventComponent />);
