// LIBRARY
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";

// STYLE
import theme from "../shared/style";

//COMPONENTS
import { Router, Spinner } from "../components";

function App() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Spinner visible={loading} />
      <Router />
    </ThemeProvider>
  );
}

export default App;
