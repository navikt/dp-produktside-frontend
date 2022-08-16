import React, { useEffect, useRef, useState } from "react";
import debounce from "lodash/debounce";
import { AnchorLink, PageNavScrollDirection } from "./types";
import Config from "config";
import NavigationSidebar from "./NavigationSidebar";

export const pageNavigationAnchorOffsetPx = Config.vars.pxPerRem;
const menuCurrentIndexMinUpdateRateMs = 1000 / 30;

export const getPageNavigationLinkId = (anchorId: string) => `${anchorId}-a`;

const getCurrentLinkIndex = (links: AnchorLink[]) => {
  const targetElements = links.reduce((elements, link) => {
    const element = document.getElementById(link.anchorId);
    return element ? [...elements, element] : elements;
  }, []);

  const scrollTarget = window.scrollY + Config.vars.dekoratorenHeight;

  const scrolledToTop = !!(targetElements?.length && targetElements[0].offsetTop > scrollTarget);

  if (scrolledToTop) {
    return -1;
  }

  const scrolledToBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight;

  if (scrolledToBottom) {
    return targetElements.length - 1;
  }

  const foundIndex = targetElements.findIndex((target) => {
    return target.offsetTop > scrollTarget;
  });

  if (foundIndex === -1) {
    return targetElements.length - 1;
  }

  return Math.max(foundIndex - 1, 0);
};

interface Props {
  anchorLinks: AnchorLink[];
  title?: string;
}

export default function NavigationMenu({ title, anchorLinks }: Props) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [links, setLinks] = useState<AnchorLink[]>();
  const scrollDir = useRef<PageNavScrollDirection>("up");
  const prevScrollPos = useRef(0);

  useEffect(() => {
    if (!anchorLinks) {
      return;
    }

    const sortedLinks = anchorLinks;

    // .sort((a, b) => {
    //     const elementA = document.getElementById(a.anchorId);
    //     const elementB = document.getElementById(b.anchorId);
    //     return elementA.offsetTop - elementB.offsetTop;
    // });

    const currentScrollPositionHandler = debounce(
      () => {
        const index = getCurrentLinkIndex(sortedLinks);

        const scrollPos = window.pageYOffset;

        scrollDir.current = scrollPos > prevScrollPos.current ? "down" : "up";
        prevScrollPos.current = scrollPos;

        setCurrentIndex(index);
      },
      menuCurrentIndexMinUpdateRateMs / 2,
      { maxWait: menuCurrentIndexMinUpdateRateMs }
    );

    setLinks(sortedLinks);
    currentScrollPositionHandler();

    window.addEventListener("scroll", currentScrollPositionHandler);
    return () => window.removeEventListener("scroll", currentScrollPositionHandler);
  }, [anchorLinks]);

  if (!links?.length) {
    return null;
  }

  const props = {
    currentIndex: currentIndex,
    title: title,
    links: links,
    scrollDirection: scrollDir.current,
    // dupes: anchorLinks.filter((link) => link.isDupe),
  };

  return <NavigationSidebar {...props} />;
}
