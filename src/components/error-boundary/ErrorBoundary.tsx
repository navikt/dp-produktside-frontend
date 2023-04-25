import { Button } from "@navikt/ds-react";
import * as Sentry from "@sentry/react";
import { Component, ReactNode } from "react";
import { Error } from "../error/Error";
import styles from "./ErrorBoundary.module.scss";

interface Props {
  children?: ReactNode;
}

export default class ErrorBoundary extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <Sentry.ErrorBoundary
        fallback={({ resetError }) => (
          <div className={styles.container}>
            <Error />

            <Button
              variant="primary"
              size="medium"
              onClick={() => {
                resetError();
              }}
            >
              Prøv igjen
            </Button>
          </div>
        )}
      >
        {this.props.children}
      </Sentry.ErrorBoundary>
    );
  }
}
