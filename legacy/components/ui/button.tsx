import { palette } from "@/constants/palette";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type ButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "outline";
  icon?: keyof typeof Ionicons.glyphMap;
};

export function Button({
  title,
  onPress,
  loading,
  disabled,
  variant = "primary",
  icon,
}: ButtonProps) {
  const isPrimary = variant === "primary";
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`h-14 flex-row items-center justify-center rounded-2xl ${
        isPrimary
          ? `bg-brand-600 active:bg-brand-700 ${isDisabled ? "opacity-60" : ""}`
          : "border-[1.5px] border-slate-200 bg-white active:bg-slate-50"
      }`}
      style={
        isPrimary
          ? {
              shadowColor: palette.brand,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
              elevation: 6,
            }
          : undefined
      }
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? palette.white : palette.brand} />
      ) : (
        <View className="flex-row items-center">
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={isPrimary ? palette.white : palette.ink}
              style={{ marginRight: 10 }}
            />
          )}
          <Text
            className={`text-base font-semibold ${isPrimary ? "text-white" : "text-slate-800"}`}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
