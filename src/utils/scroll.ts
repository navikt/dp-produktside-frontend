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
