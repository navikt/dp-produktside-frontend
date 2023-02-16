export const options = {
  call: {
    icon: "Telephone",
    hoverIcon: "TelephoneFilled",
  },
  chat: {
    icon: "Dialog",
    hoverIcon: "DialogFilled",
  },
  write: {
    icon: "Send",
    hoverIcon: "SendFilled",
  },
};

export type IContactOption = keyof typeof options;
