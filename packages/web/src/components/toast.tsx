import { Toaster as ReactHotToast } from "react-hot-toast";

function Toaster({ ...props }: React.ComponentProps<typeof ReactHotToast>) {
  return <ReactHotToast position="top-center" {...props} />;
}

export default Toaster;
