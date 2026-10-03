import { Platform } from "react-native";

/**
 * Role for pressable containers that hold other buttons (cards with a save
 * button, creator rows with Follow). On web, react-native-web renders
 * role="button" as <button>, and nested <button>s are invalid HTML — so the
 * container falls back to a focusable div there.
 */
export const containerButtonRole = Platform.OS === "web" ? undefined : ("button" as const);
