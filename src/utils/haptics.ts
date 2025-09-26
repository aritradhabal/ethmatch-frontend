import { MiniKit } from "@worldcoin/minikit-js";

export const sendLightHapticFeedbackCommand = () =>
  MiniKit.commands.sendHapticFeedback({
    hapticsType: "impact",
    style: "light",
  });
export const sendMediumHapticFeedbackCommand = () =>
  MiniKit.commands.sendHapticFeedback({
    hapticsType: "impact",
    style: "medium",
  });
export const sendHeavyHapticFeedbackCommand = () =>
  MiniKit.commands.sendHapticFeedback({
    hapticsType: "impact",
    style: "heavy",
  });
