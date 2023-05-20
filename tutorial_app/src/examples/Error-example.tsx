import { useEffect, useState } from "react";

/*
function Child(props: any) {
  const { title } = props;

  return (
    <>
    <div> {title} </div>
    <button>  </button>
    </>
  )
}*/

export function TestComponent() {
  const arr = ["item1", "item2", "item3"];

  const [count, setCount] = useState(arr);
  const [counter, setCounter] = useState(0);

  const handleCountClick = (v: string) => {
    count.splice(count.indexOf(v), 1);
    console.log(v, count);
    setCount([...count]);
  };

  const Child = (props: any) => {
    const { title } = props;

    return (
      <>
        <div> {title} </div>
        <button onClick={() => handleCountClick(title)}> remove Item </button>
      </>
    );
  };

  useEffect(() => {
    console.log("Hi!");
  }, [counter]);

  const childItems = count.map((value: string, index: number) => {
    return <Child title={value} key={index} />;
  });

  return (
    <>
      {childItems}
      <button onClick={() => setCounter(counter + 1)}> Hi {counter} </button>
    </>
  );
}
