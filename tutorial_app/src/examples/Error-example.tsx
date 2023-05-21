import { useEffect, useReducer, useRef, useState } from "react";

function reducer(state: any, action: any) {

}

const data = {};

const defaultState = {
  data: data,
  isLoading: false,
};

export function TestComponent() {
  const [state, dispatch] = useReducer(reducer, defaultState);


  const handleButton = () => {
    dispatch({
      type: "1",
      payload: {
        id: 1
      }
    })
  }

  return (
    <div>
      Hi!
    </div>
    <button onClick={handleButton} ></button>
  )
}
