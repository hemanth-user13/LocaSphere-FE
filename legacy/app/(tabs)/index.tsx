import { palette } from "@/constants/palette";
import { useAuth } from "@/context/auth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type IconName = keyof typeof Ionicons.glyphMap;

// ---------- Dummy data ----------

const STATS: { label: string; value: string; change: string; up: boolean; icon: IconName; color: string; bg: string }[] = [
  { label: "Documents", value: "1,284", change: "+12%", up: true, icon: "document-text", color: palette.brand, bg: "bg-brand-50" },
  { label: "Organizations", value: "24", change: "+3", up: true, icon: "business", color: palette.info, bg: "bg-sky-50" },
  { label: "Pending reviews", value: "18", change: "-5%", up: false, icon: "time", color: palette.warning, bg: "bg-amber-50" },
  { label: "Team members", value: "56", change: "+8", up: true, icon: "people", color: palette.success, bg: "bg-emerald-50" },
];

const QUICK_ACTIONS: { label: string; icon: IconName }[] = [
  { label: "Upload", icon: "cloud-upload-outline" },
  { label: "New folder", icon: "folder-open-outline" },
  { label: "Share", icon: "share-social-outline" },
  { label: "Scan", icon: "scan-outline" },
];

const WEEKLY_UPLOADS = [
  { day: "Mon", value: 32 },
  { day: "Tue", value: 48 },
  { day: "Wed", value: 27 },
  { day: "Thu", value: 64 },
  { day: "Fri", value: 52 },
  { day: "Sat", value: 18 },
  { day: "Sun", value: 22 },
];

type DocStatus = "Approved" | "In review" | "Draft";

const RECENT_DOCS: { name: string; org: string; size: string; time: string; type: "pdf" | "doc" | "sheet"; status: DocStatus }[] = [
  { name: "Q3 Financial Report.pdf", org: "Acme Corp", size: "2.4 MB", time: "2h ago", type: "pdf", status: "Approved" },
  { name: "Employee Handbook.docx", org: "Globex Inc", size: "860 KB", time: "5h ago", type: "doc", status: "In review" },
  { name: "Budget Forecast 2027.xlsx", org: "Initech", size: "1.1 MB", time: "Yesterday", type: "sheet", status: "Draft" },
  { name: "Vendor Contract.pdf", org: "Acme Corp", size: "540 KB", time: "2d ago", type: "pdf", status: "Approved" },
];

const FILE_STYLE: Record<"pdf" | "doc" | "sheet", { icon: IconName; color: string; bg: string }> = {
  pdf: { icon: "document-text", color: palette.danger, bg: "bg-red-50" },
  doc: { icon: "document", color: palette.brand, bg: "bg-brand-50" },
  sheet: { icon: "grid", color: palette.success, bg: "bg-emerald-50" },
};

const STATUS_STYLE: Record<DocStatus, { text: string; bg: string; dot: string }> = {
  Approved: { text: "text-emerald-700", bg: "bg-emerald-50", dot: "bg-emerald-500" },
  "In review": { text: "text-amber-700", bg: "bg-amber-50", dot: "bg-amber-500" },
  Draft: { text: "text-slate-600", bg: "bg-slate-100", dot: "bg-slate-400" },
};

// ---------- Screen ----------

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const name = user?.name ?? "User";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const maxUpload = Math.max(...WEEKLY_UPLOADS.map((d) => d.value));
  const totalUploads = WEEKLY_UPLOADS.reduce((sum, d) => sum + d.value, 0);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar style="light" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View className="rounded-b-[32px] bg-ink-900 px-6 pb-24">
          <SafeAreaView edges={["top"]}>
            <View className="mt-2 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="h-12 w-12 items-center justify-center rounded-full bg-brand-600">
                  <Text className="text-base font-bold text-white">{initials}</Text>
                </View>
                <View className="ml-3">
                  <Text className="text-sm text-slate-400">Good to see you,</Text>
                  <Text className="text-lg font-bold text-white">{name}</Text>
                </View>
              </View>

              <View className="flex-row gap-2">
                <Pressable className="h-11 w-11 items-center justify-center rounded-full bg-ink-700 active:opacity-80">
                  <Ionicons name="notifications-outline" size={20} color={palette.white} />
                  <View className="absolute right-3 top-3 h-2 w-2 rounded-full bg-red-500" />
                </Pressable>
                <Pressable
                  onPress={handleLogout}
                  className="h-11 w-11 items-center justify-center rounded-full bg-ink-700 active:opacity-80"
                >
                  <Ionicons name="log-out-outline" size={20} color={palette.white} />
                </Pressable>
              </View>
            </View>

            {/* Search */}
            <View className="mt-6 h-12 flex-row items-center rounded-2xl bg-ink-700 px-4">
              <Ionicons name="search" size={18} color={palette.slate400} />
              <Text className="ml-3 text-sm text-slate-400">Search documents, organizations…</Text>
            </View>
          </SafeAreaView>
        </View>

        {/* Overview card (overlaps header) */}
        <Animated.View entering={FadeInDown.duration(500)} style={{ marginTop: -64, paddingHorizontal: 24 }}>
          <View
            className="rounded-3xl bg-brand-600 p-5"
            style={{
              shadowColor: palette.brand,
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 8,
            }}
          >
            <View className="flex-row items-start justify-between">
              <View>
                <Text className="text-sm font-medium text-brand-100">Storage used</Text>
                <Text className="mt-1 text-3xl font-bold text-white">
                  68.4 <Text className="text-lg font-medium text-brand-200">/ 100 GB</Text>
                </Text>
              </View>
              <View className="rounded-full bg-white/20 px-3 py-1">
                <Text className="text-xs font-semibold text-white">Pro plan</Text>
              </View>
            </View>

            <View className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
              <View className="h-full rounded-full bg-white" style={{ width: "68%" }} />
            </View>

            <View className="mt-4 flex-row justify-between">
              <Text className="text-xs text-brand-100">31.6 GB available</Text>
              <Text className="text-xs font-semibold text-white">Upgrade →</Text>
            </View>
          </View>
        </Animated.View>

        {/* Quick actions */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={{ marginTop: 24, paddingHorizontal: 24 }}>
          <View className="flex-row justify-between rounded-3xl border border-slate-100 bg-white p-4">
            {QUICK_ACTIONS.map((a) => (
              <Pressable key={a.label} className="items-center active:opacity-70" style={{ width: "23%" }}>
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-brand-50">
                  <Ionicons name={a.icon} size={22} color={palette.brand} />
                </View>
                <Text className="mt-2 text-xs font-medium text-slate-600">{a.label}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Stats grid */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={{ marginTop: 32, paddingHorizontal: 24 }}>
          <SectionHeader title="Overview" action="This month" />
          <View className="flex-row flex-wrap justify-between">
            {STATS.map((s) => (
              <View
                key={s.label}
                className="mb-4 rounded-3xl border border-slate-100 bg-white p-4"
                style={{ width: "48%" }}
              >
                <View className="flex-row items-center justify-between">
                  <View className={`h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                    <Ionicons name={s.icon} size={20} color={s.color} />
                  </View>
                  <View
                    className={`flex-row items-center rounded-full px-2 py-0.5 ${
                      s.up ? "bg-emerald-50" : "bg-red-50"
                    }`}
                  >
                    <Ionicons
                      name={s.up ? "trending-up" : "trending-down"}
                      size={12}
                      color={s.up ? palette.success : palette.danger}
                    />
                    <Text
                      className={`ml-1 text-[11px] font-semibold ${
                        s.up ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {s.change}
                    </Text>
                  </View>
                </View>
                <Text className="mt-4 text-2xl font-bold text-ink-900">{s.value}</Text>
                <Text className="mt-0.5 text-sm text-slate-500">{s.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Weekly uploads chart */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={{ marginTop: 16, paddingHorizontal: 24 }}>
          <View className="rounded-3xl border border-slate-100 bg-white p-5">
            <View className="flex-row items-start justify-between">
              <View>
                <Text className="text-base font-bold text-ink-900">Weekly uploads</Text>
                <Text className="mt-0.5 text-sm text-slate-500">{totalUploads} documents this week</Text>
              </View>
              <View className="rounded-full bg-slate-100 px-3 py-1">
                <Text className="text-xs font-medium text-slate-600">7 days</Text>
              </View>
            </View>

            <View className="mt-6 h-36 flex-row items-end justify-between">
              {WEEKLY_UPLOADS.map((d) => {
                const isPeak = d.value === maxUpload;
                return (
                  <View key={d.day} className="flex-1 items-center">
                    {isPeak && (
                      <Text className="mb-1 text-[11px] font-semibold text-brand-600">{d.value}</Text>
                    )}
                    <View
                      className={`w-7 rounded-lg ${isPeak ? "bg-brand-600" : "bg-brand-100"}`}
                      style={{ height: `${(d.value / maxUpload) * 80}%` }}
                    />
                    <Text className="mt-2 text-xs text-slate-400">{d.day}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </Animated.View>

        {/* Recent documents */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={{ marginTop: 32, paddingHorizontal: 24 }}>
          <SectionHeader title="Recent documents" action="View all" />
          <View className="rounded-3xl border border-slate-100 bg-white px-4">
            {RECENT_DOCS.map((doc, i) => {
              const file = FILE_STYLE[doc.type];
              const status = STATUS_STYLE[doc.status];
              return (
                <Pressable
                  key={doc.name}
                  className={`flex-row items-center py-4 active:opacity-70 ${
                    i < RECENT_DOCS.length - 1 ? "border-b border-slate-100" : ""
                  }`}
                >
                  <View className={`h-11 w-11 items-center justify-center rounded-xl ${file.bg}`}>
                    <Ionicons name={file.icon} size={20} color={file.color} />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-sm font-semibold text-ink-900" numberOfLines={1}>
                      {doc.name}
                    </Text>
                    <Text className="mt-0.5 text-xs text-slate-500">
                      {doc.org} · {doc.size} · {doc.time}
                    </Text>
                  </View>
                  <View className={`ml-2 flex-row items-center rounded-full px-2.5 py-1 ${status.bg}`}>
                    <View className={`mr-1.5 h-1.5 w-1.5 rounded-full ${status.dot}`} />
                    <Text className={`text-[11px] font-semibold ${status.text}`}>{doc.status}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <View className="mb-4 flex-row items-center justify-between">
      <Text className="text-lg font-bold text-ink-900">{title}</Text>
      {action && (
        <Pressable hitSlop={8}>
          <Text className="text-sm font-semibold text-brand-600">{action}</Text>
        </Pressable>
      )}
    </View>
  );
}
