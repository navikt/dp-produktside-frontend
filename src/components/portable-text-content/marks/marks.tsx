import { PortableTextMarkComponent } from "@portabletext/react";
import { GtoNOK } from "./GtoNOK";

export const commonMarks: Record<string, PortableTextMarkComponent<any> | undefined> | undefined = { GtoNOK: GtoNOK };
