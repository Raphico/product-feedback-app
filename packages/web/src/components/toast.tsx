import { Toaster as Sonner } from "sonner";

function Toaster({ ...props }: React.ComponentProps<typeof Sonner>) {
  return <Sonner richColors position="top-center" {...props} />;
}

export default Toaster;
