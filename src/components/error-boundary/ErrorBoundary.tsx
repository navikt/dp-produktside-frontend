import { Button } from "@navikt/ds-react";
import { Component, ErrorInfo, ReactNode } from "react";
import Error from "../error/Error";
import styles from "./ErrorBoundary.module.scss";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI

    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can use your own error logging service here
    console.log({ error, errorInfo });
  }

  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className={styles.container}>
          <Error />

          <Button variant="primary" size="medium" onClick={() => this.setState({ hasError: false })}>
            Prøv igjen
          </Button>
        </div>
      );
    }

    // Return children components in case of no error
    return this.props.children;
  }
}
