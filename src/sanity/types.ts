export type SanityImage = {
  _type: "image";
  asset: any;
  crop: any;
  hotspot: any;
};

export type VisForConfig = {
  visForSituasjoner?: { _ref: string }[];
  skjulFor?: boolean;
  _type: "visFor";
};

export type MarkDef = {
  _key: string;
  _type: string;
  visFor?: VisForConfig;
  visPaaSider?: { _ref: string }[];
  href?: string;
};

// SanityBlock-typen er uhøytidelig hamret sammen basert på hvilke parametere jeg ser i consollen, det er ikke sikkert den stemmer helt
export type SanityBlock = {
  _key?: string;
  _type: string;
  children?: SanityBlock[];
  style?: string;
  text?: string;
  marks?: string[];
  markDefs?: MarkDef[];
  level?: number;
  listItem?: "bullet";
};
