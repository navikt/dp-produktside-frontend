export const options = {
  call: {
    icon: "PhoneIcon",
    hoverIcon: "PhoneFillIcon",
  },
  chat: {
    icon: "ChatIcon",
    hoverIcon: "ChatFillIcon",
  },
  write: {
    icon: "PaperplaneIcon",
    hoverIcon: "PaperplaneFillIcon",
  },
};

export type IContactOption = keyof typeof options;
