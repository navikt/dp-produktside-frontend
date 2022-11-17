import { RefObject } from "react";

const scrollTo = (position: number) => {
  window.scrollTo({
    behavior: "smooth",
    top: position,
  });
};

export const smoothScrollToTarget = (targetId: string, offset = 0) => {
  const targetElement = document.getElementById(targetId);

  if (targetElement) {
    const top = targetElement.getBoundingClientRect().top + window.scrollY;
    scrollTo(top - offset);
    targetElement.focus({ preventScroll: true });
  }
};

type ValueOf<T> = T[keyof T];

export const scrollIntoViewWithOffset = (ref: RefObject<ValueOf<HTMLElementTagNameMap>>, offset: number) => {
  if (ref?.current) {
    const topPosition = ref.current.getBoundingClientRect().top - document.body.getBoundingClientRect().top - offset;
    scrollTo(topPosition);
  }
};
