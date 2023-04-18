import { NextPageContext } from "next";
import * as Sentry from "@sentry/nextjs";
import { Error } from "../components/error/Error";

interface Props {
  statusCode?: number;
}

export default function ErrorPage({ statusCode }: Props) {
  return <Error />;
}

ErrorPage.getInitialProps = async (contextData: NextPageContext) => {
  // In case this is running in a serverless function, await this in order to give Sentry
  // time to send the error before the lambda exits
  await Sentry.captureUnderscoreErrorException(contextData);

  const statusCode = contextData.res ? contextData.res.statusCode : contextData.err ? contextData.err.statusCode : 404;

  return { statusCode };
};
