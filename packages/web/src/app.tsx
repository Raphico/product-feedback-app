import { useAppSelector } from "./lib/hooks";

function App() {
  const comments = useAppSelector((state) => state.comments.entities);
  const productRequests = useAppSelector(
    (state) => state.productRequests.entities,
  );

  return (
    <div>
      {JSON.stringify(comments)}
      {JSON.stringify(productRequests)}
    </div>
  );
}

export default App;
