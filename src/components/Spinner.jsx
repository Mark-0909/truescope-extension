import { LoaderCircle } from "lucide-react";

function Spinner(props) {
  const { className, ...rest } = props;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <LoaderCircle
        className="animate-spin"
        style={{ animationDuration: "4s" }}
        {...props}
      />
    </div>
  );
}

export default Spinner;
