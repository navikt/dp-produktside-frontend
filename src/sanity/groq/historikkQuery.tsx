import { groq } from "next-sanity";

export const historikkQuery = groq`*[_type == "produktside"]{
  _id,
  _updatedAt,
  title
}`;

export interface HistoriskFaktasideData {
  _id: string;
  _updatedAt: string;
  title: string;
}
