import { palette } from "@/constants/palette";
import { Ionicons } from "@expo/vector-icons";
import { forwardRef, useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";

type FormInputProps = TextInputProps & {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  error?: string;
  isPassword?: boolean;
};

export const FormInput = forwardRef<TextInput, FormInputProps>(
  ({ label, icon, error, isPassword, onFocus, onBlur, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const [hidden, setHidden] = useState(true);

    const borderColor = error
      ? "border-red-500"
      : focused
        ? "border-brand-600"
        : "border-slate-200";

    const iconColor = error ? palette.danger : focused ? palette.brand : palette.slate400;

    return (
      <View className="mb-5">
        <Text className="mb-2 text-sm font-semibold text-slate-700">{label}</Text>

        <View
          className={`h-14 flex-row items-center rounded-2xl border-[1.5px] px-4 ${borderColor} ${
            focused ? "bg-white" : "bg-slate-50"
          }`}
        >
          <Ionicons name={icon} size={20} color={iconColor} />
          <TextInput
            ref={ref}
            className="ml-3 h-full flex-1 text-base text-slate-900"
            placeholderTextColor={palette.slate400}
            secureTextEntry={isPassword && hidden}
            autoCapitalize="none"
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            {...props}
          />
          {isPassword && (
            <Pressable hitSlop={12} onPress={() => setHidden((h) => !h)}>
              <Ionicons
                name={hidden ? "eye-outline" : "eye-off-outline"}
                size={20}
                color={palette.slate400}
              />
            </Pressable>
          )}
        </View>

        {error ? (
          <View className="mt-1.5 flex-row items-center">
            <Ionicons name="alert-circle" size={14} color={palette.danger} />
            <Text className="ml-1 text-xs text-red-500">{error}</Text>
          </View>
        ) : null}
      </View>
    );
  }
);

FormInput.displayName = "FormInput";
