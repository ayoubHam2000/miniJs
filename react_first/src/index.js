import React from "react";
import ReactDOM from "react-dom/client";

function FirstComponenent() {
  return (
    <h2 class="asd" id="asd">
      Hi!
    </h2>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<FirstComponenent />);
