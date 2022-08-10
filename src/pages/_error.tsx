import { NextPageContext } from "next";
import Error from "../components/error/Error";

interface Props {
  statusCode?: number;
}

export default function ErrorPage({ statusCode }: Props) {
  return <Error />;
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
