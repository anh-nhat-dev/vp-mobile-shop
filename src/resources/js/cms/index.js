import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
  render() {
    return (
      <>
        <b>Test</b>
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
          <li>5</li>
        </ul>
      </>
    );
  }
}

const root = document.getElementById("container");
root ? ReactDOM.render(<App />, root) : false;
