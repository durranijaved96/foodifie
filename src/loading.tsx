import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";

// Higher-order component for handling loading state
const withLoading = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      console.log("Loading effect is running");

      // Simulate loading time on initial load
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    }, []);

    return loading ? (
      <Skeleton variant="rectangular" height={200} />
    ) : (
      <WrappedComponent {...props} />
    );
  };
};

export default withLoading;
