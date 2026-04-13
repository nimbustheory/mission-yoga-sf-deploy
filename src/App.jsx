import { useState, useEffect, useCallback, createContext, useContext, useRef, useMemo } from "react";
import {
  Home, Calendar, TrendingUp, Users, CreditCard, CalendarDays,
  Menu, X, Bell, Settings, Shield, ChevronRight, ChevronDown, Clock,
  PartyPopper, ArrowUpRight, ArrowDownRight, Award, DollarSign, LayoutDashboard,
  UserCheck, Megaphone, LogOut, Plus, Edit3, Send, Check, Search, Copy, Info,
  CircleCheck, UserPlus, Heart, Flame, Star, Sun, Moon, Wind, Sparkles,
  Mountain, Leaf, Music, Gift, Share2, MapPin, Zap, Dumbbell, Headphones
} from "lucide-react";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

// ═══════════════════════════════════════════════════════════════
//  STUDIO_CONFIG — Mission Yoga, San Francisco
// ═══════════════════════════════════════════════════════════════
const STUDIO_CONFIG = {
  name: "MISSION",
  subtitle: "YOGA",
  tagline: "Sweat. Connect. Transform.",
  logoMark: "M",
  description: "The Mission District's home for hot yoga, Pilates, and community. A vibrant space built on connection, sweat, and good vibes.",
  heroLine1: "SWEAT",
  heroLine2: "CONNECT",

  address: { street: "2415 Mission St", city: "San Francisco", state: "CA", zip: "94110" },
  phone: "(415) 401-9642",
  email: "info@missionyogasf.com",
  neighborhood: "Mission District, San Francisco",
  website: "https://missionyogasf.com",
  social: { instagram: "@missionyogasf" },

  theme: {
    accent:     { h: 350, s: 75, l: 52 },   // Warm amber/gold
    accentAlt:  { h: 270, s: 45, l: 55 },    // Soft violet
    warning:    { h: 25, s: 80, l: 55 },     // Burnt orange
    primary:    { h: 340, s: 20, l: 10 },     // Deep midnight blue
    surface:    { h: 340, s: 8, l: 97 },     // Cool white
    surfaceDim: { h: 338, s: 10, l: 93 },     // Soft gray
  },

  features: {
    workshops: true,
    retreats: true,
    soundBaths: true,
    teacherTrainings: true,
    practiceTracking: true,
    communityFeed: true,
    guestPasses: true,
    milestones: true,
    challenges: true,
    yogaInTheWild: true,
  },

  classCapacity: 35,
  specialtyCapacity: 25,
};
// ═══════════════════════════════════════════════════════════════
//  STUDIO_IMAGES — All image URLs from Mission Yoga CDN
// ═══════════════════════════════════════════════════════════════
const STUDIO_IMAGES = {
  logo: null,
  heroYouBelongHere: "https://newmissionyoga.com/wp-content/uploads/2025/10/classes-home.jpg",
  welcomeEntrance: null,
  classesHero: "https://newmissionyoga.com/wp-content/uploads/2025/10/events-home.jpg",
  powerBeats: "https://newmissionyoga.com/wp-content/uploads/2025/02/yoga-studio-1024x664.jpg",
  events: "https://newmissionyoga.com/wp-content/uploads/2023/01/events_wide.png",
  about: "https://newmissionyoga.com/wp-content/uploads/2023/01/dierdresArt.jpg",
  pricing: "https://newmissionyoga.com/wp-content/uploads/2023/01/steve-poses-merge.png",
  teacherTraining: "https://newmissionyoga.com/wp-content/uploads/2025/10/teachers-home.jpg",
  candlelitPower: null,
  teachers: {},
};


// ═══════════════════════════════════════════════════════════════
//  THEME SYSTEM
// ═══════════════════════════════════════════════════════════════
const hsl = (c, a) => a !== undefined ? `hsla(${c.h},${c.s}%,${c.l}%,${a})` : `hsl(${c.h},${c.s}%,${c.l}%)`;
const hslShift = (c, lShift) => `hsl(${c.h},${c.s}%,${Math.max(0, Math.min(100, c.l + lShift))}%)`;

const T = {
  accent: hsl(STUDIO_CONFIG.theme.accent),
  accentDark: hslShift(STUDIO_CONFIG.theme.accent, -12),
  accentLight: hslShift(STUDIO_CONFIG.theme.accent, 30),
  accentGhost: hsl(STUDIO_CONFIG.theme.accent, 0.08),
  accentBorder: hsl(STUDIO_CONFIG.theme.accent, 0.18),
  success: hsl(STUDIO_CONFIG.theme.accentAlt),
  successGhost: hsl(STUDIO_CONFIG.theme.accentAlt, 0.08),
  successBorder: hsl(STUDIO_CONFIG.theme.accentAlt, 0.18),
  warning: hsl(STUDIO_CONFIG.theme.warning),
  warningGhost: hsl(STUDIO_CONFIG.theme.warning, 0.08),
  warningBorder: hsl(STUDIO_CONFIG.theme.warning, 0.2),
  bg: hsl(STUDIO_CONFIG.theme.primary),
  bgCard: hsl(STUDIO_CONFIG.theme.surface),
  bgDim: hsl(STUDIO_CONFIG.theme.surfaceDim),
  text: "#1a1e2e",
  textMuted: "#646880",
  textFaint: "#9a9db0",
  border: "#dfe1ea",
  borderLight: "#ecedf2",
};

// ═══════════════════════════════════════════════════════════════
//  DATE HELPERS
// ═══════════════════════════════════════════════════════════════
const today = new Date().toISOString().split("T")[0];
const offsetDate = (d) => { const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString().split("T")[0]; };
const formatDateShort = (s) => { const d = new Date(s + "T00:00:00"); return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); };
const formatDateLong = (s) => { const d = new Date(s + "T00:00:00"); return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }); };
const fmtTime = (t) => { const [h, m] = t.split(":"); const hr = +h; return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`; };

// ═══════════════════════════════════════════════════════════════
//  MOCK DATA — Mission Yoga content
// ═══════════════════════════════════════════════════════════════
const TEACHERS = [
  { id: "t1", firstName: "Steve23", lastName: "Sanchez", role: "Owner & Lead Teacher", certs: ["E-RYT 200", "Inferno Hot Pilates", "Somatic Breathwork"], specialties: ["Hot Yoga", "Hot Yoga 90", "Breathwork"], yearsTeaching: 19, bio: "Right after his first year at Burning Man in 2001, Steve23 was invited to try his first hot yoga class — which happened to be at Mission Yoga. He fell in love with the heat and the way the yoga made him feel, and has been practicing and teaching ever since. With the help of his community, he's built a beautiful temple where all people can come to heal, celebrate, and commune." },
  { id: "t2", firstName: "Alyssa", lastName: "Quintanar", role: "Senior Teacher", certs: ["RYT-200", "IYSF Certified", "Inferno Hot Pilates"], specialties: ["Hot Yoga 26&2", "Yin", "Restorative", "Hot Pilates"], yearsTeaching: 12, bio: "Alyssa is a California native from the San Fernando Valley who moved to San Francisco in 2009. She completed her 200-hour certification with Cloud Nine Yoga in Hawaii and began teaching Hatha yoga. Her love for Bikram yoga deepened over years of daily practice, and in 2022 she returned to teaching the 26&2 series through IYSF with an enthusiasm nine years in the making." },
  { id: "t3", firstName: "Terrel", lastName: "Harris", role: "Teacher & Coach", certs: ["RYT-200", "Inferno Hot Pilates"], specialties: ["Inferno Hot Pilates", "HIIT", "Hot Yoga"], yearsTeaching: 4, bio: "Terrel 'Coach 22' Harris is a former Track & Field decathlete turned yoga athlete. His passion lies in teaching fun, transformative HIIT workouts that cultivate balance in mind, body, and soul. In 2025 he earned 1st place at the Yoga Sport Berkeley Regional and 2nd at the USA National Championship. His motto: 'It's all about the reps.'" },
  { id: "t4", firstName: "Aurelle", lastName: "K.", role: "Teacher", certs: ["RYT-200", "Inferno Hot Pilates"], specialties: ["Hot Yoga", "Hot Pilates", "Somatic Breathwork"], yearsTeaching: 19, bio: "Aurelle's classes are energetic, focused, thoughtful, and fun — just the way she practices. Outside the studio, she's Partnerships Director at Code for America with a BA from NYU and an MBA from MIT Sloan. She hopes that each time you attend her class, you learn something new and feel something different in your body." },
  { id: "t5", firstName: "Kim", lastName: "R.", role: "Teacher & Yoga Sport Coach", certs: ["E-RYT 500", "Yoga Sport Coach"], specialties: ["Hot Yoga 26&2", "Yoga Sport", "Alignment"], yearsTeaching: 15, bio: "Kim is a dedicated yoga sport coach who guided Terrel to his national championship placement. Her deep knowledge of the 26&2 series and competition-level alignment makes her classes precise, demanding, and deeply rewarding." },
  { id: "t6", firstName: "Juicy", lastName: "M.", role: "Co-Owner & Events", certs: ["Sound Healing", "Ceremony Facilitator"], specialties: ["Sound Bath", "Breathwork", "Ceremonies"], yearsTeaching: 10, bio: "Juicy is the co-owner and spiritual heart of Mission Yoga. Together with Steve23, she has created a space that goes beyond movement — hosting sound baths, breathwork journeys, and indigenous medicine ceremonies that make Mission Yoga San Francisco's premiere Neo-Shamanic Wellness Center." },
];

const TODAYS_FOCUS = {
  id: "focus-today", date: today, name: "Hot Yoga 60", type: "HOT",
  style: "Hot Yoga", temp: "Heated", duration: 60,
  description: "Our signature heated yoga class — 60 minutes of transformational movement in our 1500-square-foot temple with 15-foot ceilings, purple and pink lighting, and hospital-grade air filtration. Come as you are.",
  intention: "Sweat. Connect. Transform. This is your temple.",
  teacherTip: "The mirrors make you feel like an enormous wizard silhouetted by light. Embrace it. You belong here.",
  playlist: "Steve23's Curated Beats",
};

const PAST_PRACTICES = [
  { id: "p-y1", date: offsetDate(-1), name: "Inferno Hot Pilates", type: "PILATES", style: "Hot Pilates", temp: "Heated", duration: 60, description: "A high-intensity, low-impact workout in the heat. Full-body strengthening, core work, and cardio that leaves you drenched and empowered. The Hot Pilates classes are a party and an amazing workout all in one.", intention: "It's all about the reps. Every bit of effort counts.", teacherTip: "Everything is modifiable. Take water breaks. Your body, your rules." },
  { id: "p-y2", date: offsetDate(-2), name: "Yin Yoga", type: "YIN", style: "Yin", temp: "Room Temp", duration: 60, description: "Deep, passive stretching in long-held poses. A meditative counterbalance to the heat and intensity of our signature classes. Pure nervous system reset.", intention: "Stillness is the practice. Surrender to the pose.", teacherTip: "Let gravity do the work. If you're muscling through, you're doing too much." },
  { id: "p-y3", date: offsetDate(-3), name: "Hot Yoga 90", type: "HOT90", style: "Hot Yoga", temp: "Heated", duration: 90, description: "The full 90-minute deep practice. The original format that started it all — more time, more depth, more transformation. Not for the faint of heart.", intention: "Go deeper. Stay longer. Trust the heat." },
];

const UPCOMING_PRACTICE = { id: "p-tmrw", date: offsetDate(1), name: "Sound Bath", type: "SPECIAL", style: "Sound Bath", temp: "Room Temp", duration: 75, description: "Immerse yourself in the healing vibrations of crystal singing bowls, Tibetan bowls, flutes, and gongs. A deeply meditative experience in our temple space — you'll leave feeling lighter and grounded.", intention: "Sound is medicine. Let the vibrations wash through you.", teacherTip: "Bring an extra layer. Lie down. Let go completely." };

const CLASSES_TODAY = [
  { id: "cl1", time: "06:45", type: "Hot Yoga 60", coach: "Steve23 Sanchez", capacity: 35, registered: 28, waitlist: 0 },
  { id: "cl2", time: "08:30", type: "Hot Yoga 90", coach: "Alyssa Quintanar", capacity: 35, registered: 32, waitlist: 0 },
  { id: "cl3", time: "10:00", type: "Inferno Hot Pilates", coach: "Terrel Harris", capacity: 35, registered: 35, waitlist: 6 },
  { id: "cl4", time: "12:00", type: "Hot Yoga 60", coach: "Aurelle K.", capacity: 35, registered: 20, waitlist: 0 },
  { id: "cl5", time: "16:30", type: "Community Yoga (PWYW)", coach: "Steve23 Sanchez", capacity: 35, registered: 24, waitlist: 0 },
  { id: "cl6", time: "18:00", type: "Hot Yoga 60", coach: "Alyssa Quintanar", capacity: 35, registered: 34, waitlist: 0 },
  { id: "cl7", time: "19:30", type: "Yin", coach: "Alyssa Quintanar", capacity: 30, registered: 22, waitlist: 0 },
];

const WEEKLY_SCHEDULE = [
  { day: "Monday", classes: [{ time: "06:45", type: "Hot Yoga 60", coach: "Steve23" }, { time: "08:30", type: "Hot Yoga 90", coach: "Alyssa" }, { time: "10:00", type: "Inferno Hot Pilates", coach: "Terrel" }, { time: "12:00", type: "Hot Yoga 60", coach: "Aurelle" }, { time: "16:30", type: "Community Yoga (PWYW)", coach: "Steve23" }, { time: "18:00", type: "Hot Yoga 60", coach: "Alyssa" }, { time: "19:30", type: "Yin", coach: "Alyssa" }] },
  { day: "Tuesday", classes: [{ time: "08:30", type: "Hot Yoga 60", coach: "Steve23" }, { time: "10:00", type: "Buti MVMT", coach: "Aurelle" }, { time: "12:00", type: "Hot Yoga 60", coach: "Alyssa" }, { time: "16:30", type: "Inferno Hot Pilates", coach: "Terrel" }, { time: "18:00", type: "Hot Yoga 60", coach: "Steve23" }] },
  { day: "Wednesday", classes: [{ time: "06:45", type: "Hot Yoga 60", coach: "Alyssa" }, { time: "08:30", type: "Hot Yoga 90", coach: "Steve23" }, { time: "10:00", type: "Inferno Hot Pilates", coach: "Terrel" }, { time: "12:00", type: "Hot Yoga 60", coach: "Aurelle" }, { time: "16:30", type: "Hot Yoga 60", coach: "Kim" }, { time: "18:00", type: "Hot Yoga 60", coach: "Alyssa" }, { time: "19:30", type: "Somatic Breathwork", coach: "Steve23" }] },
  { day: "Thursday", classes: [{ time: "08:30", type: "Hot Yoga 60", coach: "Alyssa" }, { time: "10:00", type: "Buti MVMT", coach: "Aurelle" }, { time: "12:00", type: "Hot Yoga 60", coach: "Steve23" }, { time: "16:30", type: "Inferno Hot Pilates", coach: "Terrel" }, { time: "18:00", type: "Hot Yoga 26&2", coach: "Kim" }] },
  { day: "Friday", classes: [{ time: "06:45", type: "Hot Yoga 60", coach: "Steve23" }, { time: "08:30", type: "Hot Yoga 90", coach: "Alyssa" }, { time: "10:00", type: "Inferno Hot Pilates", coach: "Terrel" }, { time: "12:00", type: "Hot Yoga 60", coach: "Aurelle" }, { time: "16:30", type: "Hot Yoga 60", coach: "Steve23" }, { time: "19:30", type: "Sound Bath", coach: "Juicy" }] },
  { day: "Saturday", classes: [{ time: "08:30", type: "Hot Yoga 90", coach: "Steve23" }, { time: "10:30", type: "Inferno Hot Pilates", coach: "Terrel" }, { time: "12:00", type: "Hot Yoga 60", coach: "Alyssa" }, { time: "14:00", type: "Yin", coach: "Alyssa" }] },
  { day: "Sunday", classes: [{ time: "08:30", type: "Hot Yoga 60", coach: "Alyssa" }, { time: "10:00", type: "Hot Yoga 60", coach: "Steve23" }, { time: "12:00", type: "Buti MVMT", coach: "Aurelle" }, { time: "16:00", type: "Restorative", coach: "Alyssa" }] },
];

const COMMUNITY_FEED = [
  { id: "cf1", user: "Lily P.", milestone: "100 Classes", message: "This studio is the kind of third place I had dreamed existed, more than I even realized. The space is beautiful, the classes are transformative, and the community is healing.", date: today, celebrations: 48 },
  { id: "cf2", user: "Marcus T.", milestone: "30-Day Challenge", message: "I took my own 30 day challenge — 30 classes in 30 days — and didn't quit. Steve23 and the crew made it possible. I'm a different person now.", date: today, celebrations: 36 },
  { id: "cf3", user: "Sofia R.", milestone: "First Hot Pilates!", message: "Terrel's Hot Pilates class is KILLER. I've never worked that hard or smiled that much in a workout. Already booked for tomorrow!", date: offsetDate(-1), celebrations: 52 },
  { id: "cf4", user: "Bryce S.", milestone: "1 Year Member", message: "The pricing is affordable and everything about this place makes me feel welcome. The vibe, the teachers, the lighting, the music — Mission Yoga is home.", date: offsetDate(-1), celebrations: 44 },
];

const MILESTONE_BADGES = {
  "First Class": { icon: Leaf, color: T.accent },
  "10 Classes": { icon: Wind, color: T.accent },
  "50 Classes": { icon: Mountain, color: T.accent },
  "100 Classes": { icon: Sun, color: T.success },
  "7-Day Streak": { icon: Flame, color: T.warning },
  "30-Day Challenge": { icon: Sparkles, color: T.warning },
  "First Hot Pilates": { icon: Zap, color: "#3b82f6" },
  "First Sound Bath": { icon: Music, color: "#8b5cf6" },
  "1 Year Member": { icon: Award, color: T.success },
};

const EVENTS = [
  { id: "ev1", name: "Sound Healing Workshop", date: "2026-05-02", startTime: "19:30", type: "Workshop", description: "An immersive evening with crystal singing bowls, Tibetan bowls, flutes, gongs, and more. Learn to create your own sound healing session in this interactive, hands-on experience led by Juicy.", fee: 45, maxParticipants: 30, registered: 22, status: "Registration Open" },
  { id: "ev2", name: "Somatic Breathwork Journey", date: "2026-04-23", startTime: "19:30", type: "Special Event", description: "A guided breathwork experience with Steve23 to safely release pent-up stress. Participants describe leaving feeling lighter, more grounded, and profoundly at peace.", fee: 35, maxParticipants: 25, registered: 18, status: "Registration Open" },
  { id: "ev3", name: "30-Day Hot Yoga Challenge", date: "2026-05-01", startTime: "06:45", type: "Challenge", description: "30 classes in 30 days. The challenge that transforms bodies and minds. Prizes, community support, and a personal transformation you'll carry for life.", fee: 0, maxParticipants: 50, registered: 28, status: "Registration Open" },
  { id: "ev4", name: "Community Yoga — Pay What You Want", date: offsetDate(1), startTime: "16:30", type: "Community Event", description: "Every Monday at 4:30 PM. Experience the power of hot yoga at whatever price feels right. No judgment, no minimum. All are welcome.", fee: 0, maxParticipants: 35, registered: 20, status: "Open" },
];

const MEMBERSHIP_TIERS = [
  { id: "m1", name: "Drop-In", type: "drop-in", price: 35, period: "per class", features: ["Single class access", "Mat & towel rental available ($3 each)", "All class types"], popular: false },
  { id: "m2", name: "5 Class Pack", type: "pack", price: 150, period: "5 classes", features: ["5 class credits", "All class types", "Use at your own pace"], popular: false },
  { id: "m3", name: "Monthly Unlimited", type: "unlimited", price: 123, period: "/month", features: ["Unlimited classes", "All class types", "1 free guest pass per month", "Member-only discounts on workshops"], popular: false },
  { id: "m4", name: "Monthly Unlimited Plus", type: "unlimited", price: 149, period: "/month", features: ["Unlimited classes", "Free mat & towel every visit", "1 free guest pass per month", "Member-only workshop discounts", "Welcome tote valued at $400+"], popular: true },
  { id: "m5", name: "Community Yoga", type: "community", price: 0, period: "pay what you want", features: ["Monday 4:30 PM hot yoga", "All experience levels", "No minimum donation", "Experience the Mission Yoga vibe"], popular: false },
];

const ANNOUNCEMENTS = [
  { id: "a1", title: "New Student Deal: $99 for 30 Days!", message: "Unlimited classes for your first month — Hot Yoga, Hot Pilates, Buti, Yin, and more. Plus a FREE welcome tote worth $400+. SF residents only.", type: "celebration", pinned: true },
  { id: "a2", title: "Hot Box Yoga & Hot Yoga+ Now Available", message: "New specialty class formats for community and music lovers. Check the schedule for upcoming sessions!", type: "info", pinned: false },
];

const MEMBERS_DATA = [
  { id: "mem1", name: "Lily Page", email: "lily@email.com", membership: "Unlimited Plus", status: "active", joined: "2022-06-01", checkIns: 486, lastVisit: today },
  { id: "mem2", name: "Marcus Torres", email: "marcus@email.com", membership: "Unlimited Plus", status: "active", joined: "2023-01-15", checkIns: 392, lastVisit: offsetDate(-1) },
  { id: "mem3", name: "Sofia Rodriguez", email: "sofia@email.com", membership: "Unlimited", status: "active", joined: "2025-08-01", checkIns: 64, lastVisit: offsetDate(-2) },
  { id: "mem4", name: "Bryce Schaefer", email: "bryce@email.com", membership: "Unlimited Plus", status: "active", joined: "2025-03-24", checkIns: 182, lastVisit: today },
  { id: "mem5", name: "Jordan Lee", email: "jordan@email.com", membership: "Unlimited", status: "frozen", joined: "2024-04-01", checkIns: 118, lastVisit: offsetDate(-30) },
  { id: "mem6", name: "Gem Untal", email: "gem@email.com", membership: "5 Class Pack", status: "active", joined: "2026-02-01", checkIns: 3, lastVisit: offsetDate(-4) },
  { id: "mem7", name: "Nina Chen", email: "nina@email.com", membership: "Unlimited Plus", status: "active", joined: "2023-09-01", checkIns: 298, lastVisit: today },
  { id: "mem8", name: "Alex Rivera", email: "alex@email.com", membership: "Unlimited", status: "active", joined: "2025-11-10", checkIns: 22, lastVisit: offsetDate(-3) },
];

const ADMIN_METRICS = {
  activeMembers: 268, memberChange: 22,
  todayCheckIns: 98, weekCheckIns: 586,
  monthlyRevenue: 32900, revenueChange: 12.8,
  workshopRevenue: 4200,
};

const ADMIN_CHARTS = {
  attendance: [
    { day: "Mon", total: 102, avg: 15 }, { day: "Tue", total: 78, avg: 16 },
    { day: "Wed", total: 96, avg: 14 }, { day: "Thu", total: 74, avg: 15 },
    { day: "Fri", total: 94, avg: 16 }, { day: "Sat", total: 68, avg: 17 },
    { day: "Sun", total: 62, avg: 16 },
  ],
  revenue: [
    { month: "Sep", revenue: 26200 }, { month: "Oct", revenue: 27800 },
    { month: "Nov", revenue: 28400 }, { month: "Dec", revenue: 27200 },
    { month: "Jan", revenue: 30600 }, { month: "Feb", revenue: 31800 },
    { month: "Mar", revenue: 32900 },
  ],
  classPopularity: [
    { name: "6:45 AM", pct: 80 }, { name: "8:30 AM", pct: 92 },
    { name: "10:00 AM", pct: 100 }, { name: "12:00 PM", pct: 58 },
    { name: "4:30 PM", pct: 70 }, { name: "6:00 PM", pct: 98 },
    { name: "7:30 PM", pct: 74 },
  ],
  membershipBreakdown: [
    { name: "Unlimited Plus", value: 112, color: T.accent },
    { name: "Unlimited", value: 78, color: T.success },
    { name: "5 Class Pack", value: 42, color: T.warning },
    { name: "Drop-In", value: 24, color: T.textMuted },
    { name: "Community", value: 12, color: "#94a3b8" },
  ],
};

// ═══════════════════════════════════════════════════════════════
//  APP CONTEXT
// ═══════════════════════════════════════════════════════════════
const AppContext = createContext(null);

// ═══════════════════════════════════════════════════════════════
//  CONSUMER PAGES
// ═══════════════════════════════════════════════════════════════

function HomePage() {
  const { classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed } = useContext(AppContext);
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  const upcoming = CLASSES_TODAY.filter(c => c.time >= currentTime).slice(0, 4);

  return (
    <div className="pb-6">
      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", color: "#fff", padding: "32px 22px", minHeight: 240 }}>
        <div style={{ position: "absolute", inset: 0, background: STUDIO_IMAGES.heroYouBelongHere ? `url(${STUDIO_IMAGES.heroYouBelongHere}) center/cover` : `linear-gradient(135deg, ${T.bg}, hsl(340,15%,14%), hsl(270,15%,12%))`, filter: STUDIO_IMAGES.heroYouBelongHere ? "brightness(0.7)" : "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.45) 100%)" }} />
        <div style={{ position: "absolute", top: 16, right: 20, fontSize: 80, opacity: 0.1, lineHeight: 1, zIndex: 1 }}>M</div>
        <div style={{ position: "relative", zIndex: 2 }}>
          <p style={{ color: T.accent, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 8 }}>
            {formatDateLong(today)}
          </p>
          <h1 style={{ fontFamily: "'Syne', Georgia, serif", fontSize: 52, lineHeight: 0.95, letterSpacing: "-0.02em", margin: 0, fontWeight: 400 }}>
            {STUDIO_CONFIG.heroLine1}<br/>
            <span style={{ color: T.accent, fontStyle: "italic" }}>{STUDIO_CONFIG.heroLine2}</span>
          </h1>
          <p style={{ color: "#a8b0c0", fontSize: 13, maxWidth: 280, marginTop: 10, lineHeight: 1.5 }}>{STUDIO_CONFIG.description}</p>
        </div>
      </section>

      {/* Quick Actions */}
      <section style={{ padding: "0 16px", marginTop: -16, position: "relative", zIndex: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {[
            { icon: Calendar, label: "Reserve", page: "schedule", color: T.accent },
            { icon: Flame, label: "Practice", page: "practice", color: T.success },
            { icon: Heart, label: "Community", page: "community", color: T.warning },
            { icon: Users, label: "Teachers", page: "teachers", color: T.textMuted },
          ].map(a => (
            <QuickAction key={a.label} {...a} />
          ))}
        </div>
      </section>

      {/* Today's Practice Focus */}
      <section style={{ padding: "0 16px", marginTop: 24 }}>
        <SectionHeader title="Today's Practice" linkText="All Classes" linkPage="classes" />
        <PracticeCardFull practice={TODAYS_FOCUS} variant="featured" />
      </section>

      {/* Upcoming Classes */}
      <section style={{ padding: "0 16px", marginTop: 28 }}>
        <SectionHeader title="Upcoming Classes" linkText="Full Schedule" linkPage="schedule" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {upcoming.length > 0 ? upcoming.map(c => {
            const regs = (classRegistrations[c.id] || 0);
            const totalReg = c.registered + regs;
            const isFull = totalReg >= c.capacity;
            return (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ textAlign: "center", minWidth: 44 }}>
                  <span style={{ fontFamily: "'Syne', serif", fontSize: 24, color: T.text, fontWeight: 600 }}>{fmtTime(c.time).split(":")[0]}</span>
                  <span style={{ display: "block", fontSize: 11, color: T.textMuted }}>{fmtTime(c.time).slice(-5)}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: T.text, fontSize: 14, margin: 0 }}>{c.type}</p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{c.coach.split(" ")[0]}</p>
                </div>
                <div style={{ textAlign: "right", marginRight: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: isFull ? T.warning : totalReg >= c.capacity * 0.8 ? T.success : T.accent }}>{totalReg}/{c.capacity}</span>
                  {c.waitlist > 0 && <span style={{ display: "block", fontSize: 11, color: T.textFaint }}>+{c.waitlist} waitlist</span>}
                </div>
                <button onClick={() => openReservation({ ...c, date: today })} style={{ padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: isFull ? T.bgDim : T.accent, color: isFull ? T.textMuted : "#fff", transition: "all 0.15s" }}>
                  {isFull ? "Waitlist" : "Reserve"}
                </button>
              </div>
            );
          }) : (
            <EmptyState icon={Moon} message="No more classes today" sub="See tomorrow's schedule" />
          )}
        </div>
      </section>

      {/* Community Feed */}
      {STUDIO_CONFIG.features.communityFeed && (
        <section style={{ padding: "0 16px", marginTop: 28 }}>
          <SectionHeader title="Community" linkText="View All" linkPage="community" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {COMMUNITY_FEED.slice(0, 3).map(item => {
              const myC = feedCelebrations[item.id] || 0;
              return (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: `linear-gradient(135deg, ${T.successGhost}, transparent)`, border: `1px solid ${T.successBorder}`, borderRadius: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.success, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Sparkles size={18} color="#fff" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>
                      {item.user} <span style={{ color: T.success }}>{item.milestone}</span>
                    </p>
                    <p style={{ fontSize: 12, color: "#5a5e70", margin: "2px 0 0", lineHeight: 1.4 }}>
                      {item.message.length > 60 ? item.message.slice(0, 60) + "…" : item.message}
                    </p>
                  </div>
                  <button onClick={() => celebrateFeed(item.id)} style={{ padding: 8, borderRadius: 8, border: "none", background: myC > 0 ? T.successGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, transition: "all 0.15s" }}>
                    <Heart size={18} color={T.success} fill={myC > 0 ? T.success : "none"} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.success }}>{item.celebrations + myC}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Announcements */}
      {ANNOUNCEMENTS.length > 0 && (
        <section style={{ padding: "0 16px", marginTop: 28 }}>
          <SectionHeader title="Announcements" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ANNOUNCEMENTS.map(a => (
              <div key={a.id} style={{ padding: "14px 16px", borderRadius: 12, borderLeft: `4px solid ${a.type === "celebration" ? T.accent : a.type === "alert" ? T.warning : T.textMuted}`, background: a.type === "celebration" ? T.accentGhost : a.type === "alert" ? T.warningGhost : T.bgDim }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, margin: 0 }}>{a.title}</h3>
                    <p style={{ fontSize: 13, color: "#5a5e70", margin: "4px 0 0" }}>{a.message}</p>
                  </div>
                  {a.pinned && <span style={{ fontSize: 11, fontWeight: 600, color: T.accent, background: T.accentGhost, padding: "2px 8px", borderRadius: 99 }}>Pinned</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding: "0 16px", marginTop: 28 }}>
        <CTACard />
      </section>
    </div>
  );
}

// ——— CLASSES PAGE ———
function ClassesPage() {
  const [expandedPractice, setExpandedPractice] = useState(null);
  const allPractices = [TODAYS_FOCUS, ...PAST_PRACTICES, UPCOMING_PRACTICE].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div style={{ padding: "0 16px" }}>
      <PageHero title="Classes" subtitle="Past, present, and upcoming practice" image={STUDIO_IMAGES.classesHero} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {allPractices.map(p => (
          <PracticeCardFull key={p.id} practice={p} expanded={expandedPractice === p.id} onToggle={() => setExpandedPractice(expandedPractice === p.id ? null : p.id)} />
        ))}
      </div>
    </div>
  );
}

// ——— SCHEDULE PAGE ———
function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const { classRegistrations, registerForClass, openReservation } = useContext(AppContext);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div style={{ padding: "0 16px" }}>
      <PageHero title="Schedule" subtitle="Reserve your spot — classes fill up fast" image={STUDIO_IMAGES.powerBeats} />
      <div style={{ display: "flex", gap: 4, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {days.map((d, i) => (
          <button key={d} onClick={() => setSelectedDay(i)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", background: selectedDay === i ? T.accent : T.bgDim, color: selectedDay === i ? "#fff" : T.textMuted, transition: "all 0.15s" }}>
            {d}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {WEEKLY_SCHEDULE[selectedDay]?.classes.map((cls, i) => {
          const isSpecial = cls.type.includes("Yin") || cls.type.includes("Sound") || cls.type.includes("Restorative") || cls.type.includes("Somatic");
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
              <div style={{ textAlign: "center", minWidth: 56 }}>
                <span style={{ fontFamily: "'Syne', serif", fontSize: 18, color: T.text, fontWeight: 600 }}>{fmtTime(cls.time)}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>{cls.type}</p>
                  {isSpecial && <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "1px 6px", borderRadius: 4, background: T.warningGhost, color: T.warning }}>Special</span>}
                </div>
                {cls.coach && <p style={{ fontSize: 12, color: T.textMuted, margin: "3px 0 0" }}>{cls.coach}</p>}
              </div>
              <button onClick={() => openReservation({ id: `sched-${selectedDay}-${i}`, time: cls.time, type: cls.type, coach: cls.coach || "TBD", capacity: isSpecial ? STUDIO_CONFIG.specialtyCapacity : STUDIO_CONFIG.classCapacity, registered: Math.floor(Math.random() * 10) + 15, waitlist: 0, dayLabel: dayNames[selectedDay] })} style={{ padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: T.accent, color: "#fff" }}>
                Reserve
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ——— PRACTICE TRACKING PAGE ———
function PracticePage() {
  const [activeTab, setActiveTab] = useState("log");
  const [reflection, setReflection] = useState({ energy: 4, focus: 4, notes: "" });
  const [saved, setSaved] = useState(null);

  const handleSave = () => {
    setSaved("log");
    setTimeout(() => setSaved(null), 2000);
    setReflection({ energy: 4, focus: 4, notes: "" });
  };

  const streakDays = 16;
  const totalClasses = 104;

  return (
    <div style={{ padding: "0 16px" }}>
      <PageHero title="My Practice" subtitle="Track your journey and celebrate growth" image={STUDIO_IMAGES.candlelitPower} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
        <div style={{ background: T.accentGhost, border: `1px solid ${T.accentBorder}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
          <Flame size={20} color={T.accent} style={{ margin: "0 auto 4px" }} />
          <div style={{ fontFamily: "'Syne', serif", fontSize: 28, fontWeight: 700, color: T.text }}>{streakDays}</div>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Day Streak</div>
        </div>
        <div style={{ background: T.successGhost, border: `1px solid ${T.successBorder}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
          <Star size={20} color={T.success} style={{ margin: "0 auto 4px" }} />
          <div style={{ fontFamily: "'Syne', serif", fontSize: 28, fontWeight: 700, color: T.text }}>{totalClasses}</div>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Classes</div>
        </div>
        <div style={{ background: T.warningGhost, border: `1px solid ${T.warningBorder}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
          <Mountain size={20} color={T.warning} style={{ margin: "0 auto 4px" }} />
          <div style={{ fontFamily: "'Syne', serif", fontSize: 28, fontWeight: 700, color: T.text }}>8</div>
          <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Milestones</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: T.bgDim, borderRadius: 10, padding: 4 }}>
        {[{ id: "log", label: "Reflection" }, { id: "milestones", label: "Milestones" }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: activeTab === tab.id ? T.bgCard : "transparent", color: activeTab === tab.id ? T.text : T.textMuted, boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,.06)" : "none", transition: "all 0.15s" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "log" && (
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Leaf size={18} color={T.accent} />
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Post-Practice Reflection</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Energy Level</label>
              <div style={{ display: "flex", gap: 6 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setReflection({...reflection, energy: n})} style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${reflection.energy >= n ? T.accent : T.border}`, background: reflection.energy >= n ? T.accentGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {n <= 2 ? <Moon size={18} color={reflection.energy >= n ? T.accent : T.textFaint} /> : n <= 4 ? <Sun size={18} color={reflection.energy >= n ? T.accent : T.textFaint} /> : <Sparkles size={18} color={reflection.energy >= n ? T.accent : T.textFaint} />}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Focus & Presence</label>
              <div style={{ display: "flex", gap: 6 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setReflection({...reflection, focus: n})} style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${reflection.focus >= n ? T.success : T.border}`, background: reflection.focus >= n ? T.successGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {n <= 2 ? <Wind size={18} color={reflection.focus >= n ? T.success : T.textFaint} /> : n <= 4 ? <Heart size={18} color={reflection.focus >= n ? T.success : T.textFaint} /> : <Sparkles size={18} color={reflection.focus >= n ? T.success : T.textFaint} />}
                  </button>
                ))}
              </div>
            </div>
            <InputField label="Notes / Gratitude" value={reflection.notes} onChange={v => setReflection({...reflection, notes: v})} placeholder="What came up for you on the mat today?" multiline />
            <button onClick={handleSave} style={{ padding: "12px 0", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", background: T.accent, color: "#fff", fontFamily: "'Syne', serif", letterSpacing: "0.03em", fontSize: 17 }}>
              {saved === "log" ? <><Check size={16} style={{ display: "inline", verticalAlign: "middle" }} /> Saved</> : "Save Reflection"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "milestones" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {Object.entries(MILESTONE_BADGES).map(([name, badge]) => {
            const earned = ["First Class", "10 Classes", "50 Classes", "100 Classes", "7-Day Streak", "30-Day Challenge", "First Hot Pilates", "First Sound Bath", "1 Year Member"].includes(name);
            const BadgeIcon = badge.icon;
            return (
              <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "18px 12px", background: earned ? T.bgCard : T.bgDim, border: `1px solid ${earned ? badge.color + "30" : T.border}`, borderRadius: 14, opacity: earned ? 1 : 0.45 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: earned ? `${badge.color}15` : T.bgDim, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BadgeIcon size={24} color={earned ? badge.color : T.textFaint} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: earned ? T.text : T.textFaint, textAlign: "center" }}>{name}</span>
                {earned && <CircleCheck size={14} color={badge.color} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ——— COMMUNITY PAGE ———
function CommunityPage() {
  const { feedCelebrations, celebrateFeed } = useContext(AppContext);

  return (
    <div style={{ padding: "0 16px" }}>
      <PageHero title="Community" subtitle="Celebrate each other's wins at Mission Yoga" image={STUDIO_IMAGES.about} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {COMMUNITY_FEED.map(item => {
          const myC = feedCelebrations[item.id] || 0;
          return (
            <div key={item.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', serif", fontSize: 16, color: "#fff", fontWeight: 700, flexShrink: 0 }}>
                  {item.user[0]}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, margin: 0, color: T.text }}>{item.user}</p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "1px 0 0" }}>{formatDateShort(item.date)}</p>
                </div>
                <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: T.successGhost, color: T.success }}>{item.milestone}</span>
              </div>
              <p style={{ fontSize: 14, color: "#484c5e", lineHeight: 1.5, margin: "0 0 12px" }}>{item.message}</p>
              <button onClick={() => celebrateFeed(item.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: `1px solid ${myC > 0 ? T.successBorder : T.border}`, background: myC > 0 ? T.successGhost : "transparent", cursor: "pointer" }}>
                <Heart size={16} color={T.success} fill={myC > 0 ? T.success : "none"} />
                <span style={{ fontSize: 13, fontWeight: 600, color: T.success }}>{item.celebrations + myC}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ——— TEACHERS PAGE ———
function TeachersPage() {
  const [expandedTeacher, setExpandedTeacher] = useState(null);

  return (
    <div style={{ padding: "0 16px" }}>
      <PageHero title="Teachers" subtitle="Meet the Mission Yoga teaching team" image={STUDIO_IMAGES.teacherTraining} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {TEACHERS.map(teacher => {
          const expanded = expandedTeacher === teacher.id;
          return (
            <div key={teacher.id} onClick={() => setExpandedTeacher(expanded ? null : teacher.id)} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
                {teacher.photo ? (
                  <img src={teacher.photo} alt={teacher.firstName} onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} style={{ width: 56, height: 56, borderRadius: 14, objectFit: "cover", flexShrink: 0 }} />
                ) : null}
                <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: teacher.photo ? "none" : "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', serif", fontSize: 22, color: "#fff", flexShrink: 0, fontWeight: 600 }}>
                  {teacher.firstName[0]}{teacher.lastName[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: T.text }}>
                    {teacher.firstName} {teacher.lastName}
                  </h3>
                  <p style={{ fontSize: 13, color: T.accent, fontWeight: 600, margin: "2px 0 0" }}>{teacher.role}</p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{teacher.yearsTeaching} years teaching</p>
                </div>
                <ChevronDown size={18} color={T.textFaint} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </div>
              {expanded && (
                <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${T.borderLight}`, paddingTop: 14 }}>
                  <p style={{ fontSize: 13, color: "#4a4e60", lineHeight: 1.6, margin: "0 0 12px" }}>{teacher.bio}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                    {teacher.specialties.map(s => (
                      <span key={s} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.accentGhost, color: T.accent }}>{s}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {teacher.certs.map(c => (
                      <span key={c} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.bgDim, color: T.textMuted }}>{c}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ——— MEMBERSHIP PAGE ———
function MembershipPage() {
  return (
    <div style={{ padding: "0 16px" }}>
      <PageHero title="Membership" subtitle="Leave your heart, not your wallet, in San Francisco" image={STUDIO_IMAGES.pricing} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {MEMBERSHIP_TIERS.map(tier => (
          <div key={tier.id} style={{ background: T.bgCard, border: `1px solid ${tier.popular ? T.accent : T.border}`, borderRadius: 14, padding: "20px 18px", position: "relative", overflow: "hidden" }}>
            {tier.popular && (
              <div style={{ position: "absolute", top: 12, right: -28, background: T.accent, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 32px", transform: "rotate(45deg)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Best Value
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20 }}>{tier.name === "Unlimited Plus" ? <Flame size={20} color={T.accent} /> : tier.name === "Unlimited" ? <Zap size={20} color={T.success} /> : tier.name === "5 Class Pack" ? <Leaf size={20} color={T.warning} /> : <Moon size={20} color={T.textMuted} />}</span>
              <h3 style={{ fontFamily: "'Syne', serif", fontSize: 22, margin: 0, color: T.text }}>{tier.name}</h3>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
              <span style={{ fontFamily: "'Syne', serif", fontSize: 38, color: T.accent, fontWeight: 700 }}>${tier.price}</span>
              <span style={{ fontSize: 13, color: T.textMuted }}>{tier.period}</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px" }}>
              {tier.features.map((f, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 13, color: "#4a4e60" }}>
                  <CircleCheck size={14} color={T.accent} style={{ flexShrink: 0 }} />
                  {f}
                </li>
              ))}
            </ul>
            <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne', serif", letterSpacing: "0.03em", background: tier.popular ? T.accent : T.bg, color: "#fff" }}>
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ——— EVENTS PAGE ———
function EventsPage() {
  return (
    <div style={{ padding: "0 16px" }}>
      <PageHero title="Events" subtitle="Sound baths, breathwork, and community events" image={STUDIO_IMAGES.events} />
      {EVENTS.map(ev => (
        <div key={ev.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ background: `linear-gradient(135deg, ${T.bg}, hsl(222,25%,14%))`, padding: "20px 18px", color: "#fff" }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.accent }}>{ev.type}</span>
            <h3 style={{ fontFamily: "'Syne', serif", fontSize: 22, margin: "6px 0 4px", fontWeight: 600 }}>{ev.name}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "#a8b0c0" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={14} /> {formatDateShort(ev.date)}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={14} /> {fmtTime(ev.startTime)}</span>
            </div>
          </div>
          <div style={{ padding: "16px 18px" }}>
            <p style={{ fontSize: 13, color: "#4a4e60", lineHeight: 1.6, margin: "0 0 14px" }}>{ev.description}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              <StatBox label="Price" value={ev.fee === 0 ? "Free" : `$${ev.fee}`} />
              <StatBox label="Spots" value={`${ev.registered}/${ev.maxParticipants}`} />
            </div>
            <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne', serif", letterSpacing: "0.03em", background: T.accent, color: "#fff" }}>
              {ev.status === "Active Now" ? "View Challenge" : "Register Now"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  GUEST PASS PAGE
// ═══════════════════════════════════════════════════════════════
function GuestPassPage() {
  const [sent, setSent] = useState(false);
  const passesRemaining = 2;
  const passesUsed = 1;

  return (
    <div style={{ padding: "0 16px" }}>
      <PageHero title="Guest Passes" subtitle="Bring a friend to Mission" image={STUDIO_IMAGES.welcomeEntrance} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        <div style={{ background: T.accentGhost, border: `1px solid ${T.accentBorder}`, borderRadius: 12, padding: "16px 14px", textAlign: "center" }}>
          <Gift size={20} color={T.accent} style={{ margin: "0 auto 6px" }} />
          <div style={{ fontFamily: "'Syne', serif", fontSize: 32, fontWeight: 700, color: T.text }}>{passesRemaining}</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase" }}>Available</div>
        </div>
        <div style={{ background: T.successGhost, border: `1px solid ${T.successBorder}`, borderRadius: 12, padding: "16px 14px", textAlign: "center" }}>
          <UserPlus size={20} color={T.success} style={{ margin: "0 auto 6px" }} />
          <div style={{ fontFamily: "'Syne', serif", fontSize: 32, fontWeight: 700, color: T.text }}>{passesUsed}</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase" }}>Shared</div>
        </div>
      </div>
      <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: 20 }}>
        <h3 style={{ fontFamily: "'Syne', serif", fontSize: 20, margin: "0 0 14px" }}>Send a Guest Pass</h3>
        <InputField label="Friend's Name" placeholder="Their name" />
        <InputField label="Their Email" placeholder="friend@email.com" />
        <button onClick={() => { setSent(true); setTimeout(() => setSent(false), 2500); }} style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", background: T.accent, color: "#fff", fontFamily: "'Syne', serif", fontSize: 17, marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          {sent ? <><Check size={16} /> Sent!</> : <><Send size={16} /> Send Pass</>}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ADMIN PAGES
// ═══════════════════════════════════════════════════════════════

function AdminDashboard() {
  const metrics = [
    { label: "Active Members", value: ADMIN_METRICS.activeMembers, change: `+${ADMIN_METRICS.memberChange}`, positive: true, icon: Users, color: T.accent },
    { label: "Today's Check-ins", value: ADMIN_METRICS.todayCheckIns, change: `${ADMIN_METRICS.weekCheckIns} this week`, positive: true, icon: Calendar, color: T.success },
    { label: "Monthly Revenue", value: `$${ADMIN_METRICS.monthlyRevenue.toLocaleString()}`, change: `+${ADMIN_METRICS.revenueChange}%`, positive: true, icon: DollarSign, color: T.warning },
    { label: "Workshop Revenue", value: `$${ADMIN_METRICS.workshopRevenue.toLocaleString()}`, change: "+18 registrations", positive: true, icon: Award, color: "#8b5cf6" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ fontFamily: "'Syne', serif", fontSize: 28, color: "#1a1e2e", margin: 0 }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: "#6b7280", margin: "4px 0 0" }}>Welcome back. Here's what's happening at {STUDIO_CONFIG.name}.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${m.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <m.icon size={18} color={m.color} />
              </div>
            </div>
            <div style={{ fontFamily: "'Syne', serif", fontSize: 30, color: "#1a1e2e", fontWeight: 700 }}>{m.value}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <span style={{ display: "flex", alignItems: "center", fontSize: 12, fontWeight: 600, color: m.positive ? "#16a34a" : "#dc2626" }}>
                {m.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {m.change}
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "6px 0 0" }}>{m.label}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
        <AdminCard title="Weekly Attendance">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_CHARTS.attendance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, color: "#1a1e2e" }} />
                <Bar dataKey="total" fill={T.accent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
        <AdminCard title="Revenue Trend">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ADMIN_CHARTS.revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, color: "#1a1e2e" }} formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]} />
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.accent} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={T.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="revenue" stroke={T.accent} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        <AdminCard title="Membership Breakdown">
          <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ADMIN_CHARTS.membershipBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                  {ADMIN_CHARTS.membershipBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, color: "#1a1e2e" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {ADMIN_CHARTS.membershipBreakdown.map((entry, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: entry.color }} />
                <span style={{ fontSize: 11, color: "#9ca3af" }}>{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </AdminCard>
        <AdminCard title="Class Popularity (% Capacity)">
          <div style={{ height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_CHARTS.classPopularity} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#9ca3af" fontSize={12} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={11} width={60} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, color: "#1a1e2e" }} formatter={v => [`${v}%`, "Fill Rate"]} />
                <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                  {ADMIN_CHARTS.classPopularity.map((entry, i) => (
                    <Cell key={i} fill={entry.pct >= 90 ? T.warning : entry.pct >= 70 ? T.accent : T.success} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

function AdminMembersPage() {
  const [search, setSearch] = useState("");
  const filtered = MEMBERS_DATA.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.membership.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Syne', serif", fontSize: 28, color: "#1a1e2e", margin: 0 }}>Members</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8 }}>
          <Search size={16} color="#9ca3af" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..." style={{ background: "transparent", border: "none", color: "#1a1e2e", fontSize: 13, outline: "none", width: 140 }} />
        </div>
      </div>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
              {["Member", "Plan", "Status", "Check-ins", "Last Visit"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#6b7280", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", fontWeight: 700 }}>{m.name.split(" ").map(n => n[0]).join("")}</div>
                    <div>
                      <p style={{ color: "#1a1e2e", fontWeight: 600, margin: 0 }}>{m.name}</p>
                      <p style={{ color: "#6b7280", fontSize: 11, margin: "1px 0 0" }}>{m.email}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px 16px", color: "#374151" }}>{m.membership}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: m.status === "active" ? `${T.accent}20` : `${T.warning}20`, color: m.status === "active" ? T.accent : T.warning, textTransform: "capitalize" }}>{m.status}</span>
                </td>
                <td style={{ padding: "12px 16px", color: "#374151", fontFamily: "monospace" }}>{m.checkIns}</td>
                <td style={{ padding: "12px 16px", color: "#6b7280" }}>{formatDateShort(m.lastVisit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminSchedulePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontFamily: "'Syne', serif", fontSize: 28, color: "#1a1e2e", margin: 0 }}>Schedule Management</h1>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
              {["Time", "Class", "Teacher", "Capacity", "Registered", "Status"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#6b7280", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CLASSES_TODAY.map(c => (
              <tr key={c.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "12px 16px", color: "#1a1e2e", fontFamily: "monospace" }}>{fmtTime(c.time)}</td>
                <td style={{ padding: "12px 16px", color: "#374151", fontWeight: 600 }}>{c.type}</td>
                <td style={{ padding: "12px 16px", color: "#374151" }}>{c.coach}</td>
                <td style={{ padding: "12px 16px", color: "#6b7280" }}>{c.capacity}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontFamily: "monospace", fontWeight: 600, color: c.registered >= c.capacity ? T.warning : T.accent }}>{c.registered}/{c.capacity}</span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: c.registered >= c.capacity ? `${T.warning}20` : `${T.accent}20`, color: c.registered >= c.capacity ? T.warning : T.accent }}>
                    {c.registered >= c.capacity ? "Full" : "Open"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminTeachersPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Syne', serif", fontSize: 28, color: "#1a1e2e", margin: 0 }}>Teachers</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <UserPlus size={16} /> Add Teacher
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {TEACHERS.map(teacher => (
          <div key={teacher.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', serif", fontSize: 20, color: "#fff", fontWeight: 600 }}>
                {teacher.firstName[0]}{teacher.lastName[0]}
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1e2e", margin: 0 }}>{teacher.firstName} {teacher.lastName}</h3>
                <p style={{ fontSize: 12, color: T.accent, fontWeight: 600, margin: "2px 0 0" }}>{teacher.role}</p>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
              {teacher.certs.map(c => (
                <span key={c} style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: "#f3f4f6", color: "#6b7280" }}>{c}</span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #e5e7eb", background: "transparent", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit</button>
              <button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: "1px solid #e5e7eb", background: "transparent", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Schedule</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminEventsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Syne', serif", fontSize: 28, color: "#1a1e2e", margin: 0 }}>Events & Workshops</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <Plus size={16} /> New Event
        </button>
      </div>
      {EVENTS.map(ev => (
        <div key={ev.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: `${T.accent}15`, color: T.accent }}>{ev.status}</span>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1a1e2e", margin: "8px 0 4px" }}>{ev.name}</h3>
              <p style={{ fontSize: 13, color: "#6b7280" }}>{formatDateShort(ev.date)} · {ev.type} · {ev.fee === 0 ? "Free" : `$${ev.fee}`}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Syne', serif", fontSize: 28, color: T.accent, fontWeight: 700 }}>{ev.registered}</div>
              <p style={{ fontSize: 11, color: "#6b7280" }}>of {ev.maxParticipants} spots</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminPricingPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontFamily: "'Syne', serif", fontSize: 28, color: "#1a1e2e", margin: 0 }}>Pricing & Memberships</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
        {MEMBERSHIP_TIERS.map(tier => (
          <div key={tier.id} style={{ background: "#fff", border: `1px solid ${tier.popular ? T.accent : "#e5e7eb"}`, borderRadius: 12, padding: 18 }}>
            {tier.popular && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: T.accentGhost, color: T.accent, marginBottom: 8, display: "inline-block" }}>BEST VALUE</span>}
            <h3 style={{ fontFamily: "'Syne', serif", fontSize: 22, color: "#1a1e2e", margin: "0 0 4px" }}>{tier.name}</h3>
            <div style={{ fontFamily: "'Syne', serif", fontSize: 34, color: T.accent, fontWeight: 700 }}>${tier.price}<span style={{ fontSize: 14, color: "#6b7280", fontWeight: 400 }}> {tier.period}</span></div>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "8px 0" }}>{tier.features.length} features</p>
            <button style={{ width: "100%", padding: "8px 0", borderRadius: 6, border: "1px solid #e5e7eb", background: "transparent", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit Tier</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminBroadcastPage() {
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontFamily: "'Syne', serif", fontSize: 28, color: "#1a1e2e", margin: 0 }}>Broadcast & Notifications</h1>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
        <h3 style={{ color: "#1a1e2e", fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>New Broadcast</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input placeholder="Title" style={{ padding: "10px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, color: "#1a1e2e", fontSize: 13, outline: "none" }} />
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message..." rows={4} style={{ padding: "10px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, color: "#1a1e2e", fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit" }} />
          <div style={{ display: "flex", gap: 6 }}>
            {["all", "members", "class passes", "teachers"].map(a => (
              <button key={a} onClick={() => setAudience(a)} style={{ padding: "6px 12px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", background: audience === a ? T.accent : "#f3f4f6", color: audience === a ? "#fff" : "#6b7280" }}>{a}</button>
            ))}
          </div>
          <button style={{ padding: "10px 0", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Send size={16} /> Send Broadcast
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminSettingsPage() {
  const [studioName, setStudioName] = useState(STUDIO_CONFIG.name);
  const [studioEmail, setStudioEmail] = useState(STUDIO_CONFIG.email);
  const [studioPhone, setStudioPhone] = useState(STUDIO_CONFIG.phone);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontFamily: "'Syne', serif", fontSize: 28, color: "#1a1e2e", margin: 0 }}>Settings</h1>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
        <h3 style={{ color: "#1a1e2e", fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>Studio Information</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Studio Name</label>
            <input value={studioName} onChange={e => setStudioName(e.target.value)} style={{ width: "100%", padding: "10px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, color: "#1a1e2e", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</label>
            <input value={studioEmail} onChange={e => setStudioEmail(e.target.value)} style={{ width: "100%", padding: "10px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, color: "#1a1e2e", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Phone</label>
            <input value={studioPhone} onChange={e => setStudioPhone(e.target.value)} style={{ width: "100%", padding: "10px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, color: "#1a1e2e", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Address</label>
            <input value={`${STUDIO_CONFIG.address.street}, ${STUDIO_CONFIG.address.city}, ${STUDIO_CONFIG.address.state} ${STUDIO_CONFIG.address.zip}`} readOnly style={{ width: "100%", padding: "10px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, color: "#6b7280", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>
        </div>
      </div>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
        <h3 style={{ color: "#1a1e2e", fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>Business Hours</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[{ day: "Mon-Fri", hours: "6:45 AM - 9:00 PM" }, { day: "Saturday", hours: "8:30 AM - 4:00 PM" }, { day: "Sunday", hours: "8:30 AM - 5:00 PM" }].map(h => (
            <div key={h.day} style={{ padding: "10px 12px", background: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb" }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", margin: 0 }}>{h.day}</p>
              <p style={{ fontSize: 14, color: "#1a1e2e", fontWeight: 600, margin: "2px 0 0" }}>{h.hours}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
        <h3 style={{ color: "#1a1e2e", fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>Integrations</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {["Payment Processing", "Email Marketing", "Class Booking API"].map(item => (
            <div key={item} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb" }}>
              <span style={{ fontSize: 14, color: "#1a1e2e" }}>{item}</span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: `${T.accent}15`, color: T.accent }}>Connected</span>
            </div>
          ))}
        </div>
      </div>
      <button style={{ padding: "12px 0", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
        Save Changes
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════

function SectionHeader({ title, linkText, linkPage }) {
  const { setPage } = useContext(AppContext);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <h2 style={{ fontFamily: "'Syne', Georgia, serif", fontSize: 24, margin: 0 }}>{title}</h2>
      {linkText && (
        <button onClick={() => setPage(linkPage)} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: T.accent, background: "none", border: "none", cursor: "pointer" }}>
          {linkText} <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}

function PageTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h1 style={{ fontFamily: "'Syne', Georgia, serif", fontSize: 34, margin: 0 }}>{title}</h1>
      {subtitle && <p style={{ fontSize: 13, color: T.textMuted, margin: "4px 0 0" }}>{subtitle}</p>}
    </div>
  );
}


function PageHero({ title, subtitle, image }) {
  return (
    <div style={{ position: "relative", overflow: "hidden", padding: "28px 20px 20px", minHeight: 220, marginBottom: 16, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div style={{ position: "absolute", inset: 0, background: image ? `url(${image}) center/cover` : `linear-gradient(135deg, ${T.bg}, hsl(340,20%,16%))`, filter: image ? "brightness(0.7)" : "none" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.45) 100%)" }} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <h1 style={{ fontFamily: "'Syne', Georgia, serif", fontSize: 34, margin: 0, color: "#fff" }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13, color: "rgba(255,255,255,.75)", margin: "4px 0 0" }}>{subtitle}</p>}
      </div>
    </div>
  );
}
function QuickAction({ icon: Icon, label, page, color }) {
  const { setPage } = useContext(AppContext);
  return (
    <button onClick={() => setPage(page)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px", background: T.bgCard, borderRadius: 12, border: "none", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={20} color="#fff" />
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: T.text }}>{label}</span>
    </button>
  );
}

function PracticeCardFull({ practice, variant, expanded, onToggle }) {
  const isFeatured = variant === "featured";
  const isExpanded = expanded !== undefined ? expanded : isFeatured;

  const typeColors = {
    POWER: T.accent, CANDLELIT: T.success, YIN: "#8b5cf6", HEATED: T.success, SPECIAL: T.success,
  };

  return (
    <div onClick={onToggle} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderLeft: `4px solid ${typeColors[practice.type] || T.accent}`, borderRadius: 12, padding: isFeatured ? "18px 18px" : "14px 16px", cursor: onToggle ? "pointer" : "default", transition: "all 0.2s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: isExpanded ? 10 : 0 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            {practice.date === today ? (
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: T.accentGhost, color: T.accent }}>TODAY</span>
            ) : (
              <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>{formatDateShort(practice.date)}</span>
            )}
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: `${typeColors[practice.type] || T.accent}12`, color: typeColors[practice.type] || T.accent }}>{practice.style}</span>
            {practice.duration && <span style={{ fontSize: 11, color: T.textFaint }}>{practice.duration} min</span>}
          </div>
          <h3 style={{ fontFamily: "'Syne', serif", fontSize: isFeatured ? 26 : 20, margin: 0, color: T.text }}>{practice.name}</h3>
        </div>
        {onToggle && <ChevronDown size={18} color={T.textFaint} style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />}
      </div>
      {isExpanded && (
        <div>
          {practice.temp && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
              <Flame size={14} color={T.warning} />
              <span style={{ fontSize: 12, fontWeight: 600, color: T.warning }}>{practice.temp}</span>
            </div>
          )}
          <p style={{ fontSize: 14, color: "#4a4e60", lineHeight: 1.6, margin: "0 0 12px" }}>{practice.description}</p>
          {practice.intention && (
            <div style={{ padding: "10px 12px", background: T.accentGhost, borderRadius: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.accent, textTransform: "uppercase", letterSpacing: "0.05em" }}>Intention</span>
              <p style={{ fontSize: 13, color: "#4a4e60", margin: "4px 0 0", lineHeight: 1.5, fontStyle: "italic" }}>{practice.intention}</p>
            </div>
          )}
          {practice.teacherTip && (
            <div style={{ padding: "10px 12px", background: T.successGhost, borderRadius: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.success, textTransform: "uppercase", letterSpacing: "0.05em" }}>Teacher's Note</span>
              <p style={{ fontSize: 13, color: "#4a4e60", margin: "4px 0 0", lineHeight: 1.5 }}>{practice.teacherTip}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div style={{ background: T.bgDim, borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
      <div style={{ fontFamily: "'Syne', serif", fontSize: 22, fontWeight: 700, color: T.text }}>{value}</div>
      <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>{label}</div>
    </div>
  );
}

function EmptyState({ icon: Icon, message, sub }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "28px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
      <Icon size={28} color={T.textFaint} />
      <p style={{ fontWeight: 600, color: T.textMuted, margin: 0 }}>{message}</p>
      {sub && <p style={{ fontSize: 12, color: T.textFaint, margin: 0 }}>{sub}</p>}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, multiline }) {
  const style = { width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 14, color: T.text, outline: "none", fontFamily: "inherit", background: T.bgDim, boxSizing: "border-box", marginTop: 4 };
  return (
    <div style={{ marginBottom: 8 }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>}
      {multiline ? (
        <textarea value={value} onChange={e => onChange?.(e.target.value)} placeholder={placeholder} rows={3} style={{ ...style, resize: "vertical" }} />
      ) : (
        <input value={value} onChange={e => onChange?.(e.target.value)} placeholder={placeholder} style={style} />
      )}
    </div>
  );
}

function CTACard() {
  const { setPage } = useContext(AppContext);
  return (
    <div style={{ borderRadius: 14, padding: "22px 20px", color: "#fff", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: STUDIO_IMAGES.welcomeEntrance ? `url(${STUDIO_IMAGES.welcomeEntrance}) center/cover` : `linear-gradient(135deg, ${T.bg}, hsl(340,20%,14%))`, backgroundSize: "cover", backgroundPosition: "center", filter: STUDIO_IMAGES.welcomeEntrance ? "brightness(0.7)" : "none" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.45) 100%)" }} />
      <div style={{ position: "absolute", top: -20, right: -10, fontSize: 100, opacity: 0.08, lineHeight: 1, zIndex: 1 }}>M</div>
      <h3 style={{ fontFamily: "'Syne', serif", fontSize: 24, margin: "0 0 6px", fontWeight: 600, position: "relative", zIndex: 2 }}>New Student Deal</h3>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,.75)", margin: "0 0 14px", maxWidth: 260, position: "relative", zIndex: 2 }}>30 days of unlimited classes for just $99 — plus a FREE welcome tote worth $400+. New SF residents only. Come as you are.</p>
      <button onClick={() => setPage("membership")} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Syne', serif", letterSpacing: "0.03em", position: "relative", zIndex: 2 }}>
        Get Started
      </button>
    </div>
  );
}

function AdminCard({ title, children }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
      <h3 style={{ color: "#1a1e2e", fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>{title}</h3>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SETTINGS MODAL
// ═══════════════════════════════════════════════════════════════
function SettingsModal({ onClose }) {
  const [notifClass, setNotifClass] = useState(true);
  const [notifCommunity, setNotifCommunity] = useState(true);
  const [notifEvents, setNotifEvents] = useState(true);
  const [notifReminders, setNotifReminders] = useState(false);

  const ToggleButton = ({ active, onClick }) => (
    <button onClick={onClick} style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: active ? T.accent : T.border, position: "relative", transition: "background 0.2s" }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: active ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,.15)" }} />
    </button>
  );

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgCard, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 390, maxHeight: "85vh", overflow: "auto", padding: "20px 20px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Syne', serif", fontSize: 26, margin: 0 }}>Settings</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} /></button>
        </div>
        <div style={{ padding: "14px 0", borderBottom: `1px solid ${T.borderLight}` }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.textMuted, margin: "0 0 10px" }}>Profile</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', serif", fontSize: 20, color: "#fff", fontWeight: 700 }}>AP</div>
            <div>
              <p style={{ fontWeight: 700, margin: 0, fontSize: 15 }}>Ashley Park</p>
              <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>Unlimited Plus Member · Since Mar 2023</p>
            </div>
          </div>
        </div>
        <div style={{ padding: "14px 0", borderBottom: `1px solid ${T.borderLight}` }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.textMuted, margin: "0 0 10px" }}>Notifications</h3>
          {[
            { label: "Class Reminders", active: notifClass, toggle: () => setNotifClass(!notifClass) },
            { label: "Community Milestones", active: notifCommunity, toggle: () => setNotifCommunity(!notifCommunity) },
            { label: "Events & Challenges", active: notifEvents, toggle: () => setNotifEvents(!notifEvents) },
            { label: "Streak Reminders", active: notifReminders, toggle: () => setNotifReminders(!notifReminders) },
          ].map(n => (
            <div key={n.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
              <span style={{ fontSize: 14, color: T.text }}>{n.label}</span>
              <ToggleButton active={n.active} onClick={n.toggle} />
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 0" }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.textMuted, margin: "0 0 10px" }}>About</h3>
          <p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>{STUDIO_CONFIG.name} {STUDIO_CONFIG.subtitle} App v1.0</p>
          <p style={{ fontSize: 12, color: T.textFaint, margin: "4px 0 0" }}>Mission District, San Francisco · SF's Premiere Neo-Shamanic Wellness Center Since 2001</p>
        </div>
        <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", color: T.accent, fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 8 }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  NOTIFICATIONS MODAL
// ═══════════════════════════════════════════════════════════════
function NotificationsModal({ onClose }) {
  const notifications = [
    { id: "n1", title: "Class Reminder", message: "Hot Yoga 60 with Steve23 starts in 1 hour", time: "55 min ago", read: false },
    { id: "n2", title: "30-Day Challenge Update", message: "You're on Day 16! Keep the momentum going.", time: "2 hrs ago", read: false },
    { id: "n3", title: "Community", message: "Lily P. just reached 100 classes! Celebrate with her.", time: "4 hrs ago", read: true },
    { id: "n4", title: "New Class Added", message: "Sound Bath is now on the schedule — Fridays at 7:30 PM", time: "Yesterday", read: true },
  ];

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgCard, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 390, maxHeight: "80vh", overflow: "auto", padding: "20px 20px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Syne', serif", fontSize: 26, margin: 0 }}>Notifications</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} /></button>
        </div>
        {notifications.map(n => (
          <div key={n.id} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: `1px solid ${T.borderLight}` }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.read ? "transparent" : T.accent, marginTop: 6, flexShrink: 0 }} />
            <div>
              <p style={{ fontWeight: n.read ? 500 : 700, fontSize: 14, color: T.text, margin: 0 }}>{n.title}</p>
              <p style={{ fontSize: 13, color: T.textMuted, margin: "2px 0 0" }}>{n.message}</p>
              <p style={{ fontSize: 11, color: T.textFaint, margin: "4px 0 0" }}>{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  RESERVATION MODAL
// ═══════════════════════════════════════════════════════════════
function ReservationModal({ classData, onConfirm, onClose }) {
  const [confirmed, setConfirmed] = useState(false);

  const totalReg = classData.registered + (classData.waitlist || 0);
  const isFull = totalReg >= classData.capacity;
  const spotsLeft = classData.capacity - classData.registered;
  const dateLabel = classData.date ? formatDateShort(classData.date) : classData.dayLabel || "This week";

  const handleConfirm = () => {
    setConfirmed(true);
    onConfirm(classData.id);
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgCard, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 390, padding: "24px 20px 36px" }}>
        {!confirmed ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Syne', serif", fontSize: 24, margin: 0, color: T.text }}>Confirm Reservation</h2>
              <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} color={T.textMuted} /></button>
            </div>
            <div style={{ background: T.bgDim, borderRadius: 14, padding: "18px 16px", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Calendar size={24} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: T.text, margin: "0 0 3px" }}>{classData.type}</h3>
                  <p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>{classData.coach}</p>
                </div>
              </div>
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Clock size={16} color={T.textMuted} />
                  <span style={{ fontSize: 14, color: T.text }}>{fmtTime(classData.time)}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <CalendarDays size={16} color={T.textMuted} />
                  <span style={{ fontSize: 14, color: T.text }}>{dateLabel}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Users size={16} color={T.textMuted} />
                  <span style={{ fontSize: 14, color: isFull ? T.warning : spotsLeft <= 5 ? T.success : T.text }}>
                    {isFull ? `Full — you'll be added to the waitlist` : `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} remaining`}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <MapPin size={16} color={T.textMuted} />
                  <span style={{ fontSize: 14, color: T.text }}>Mission Yoga · Mission District</span>
                </div>
              </div>
            </div>
            <button onClick={handleConfirm} style={{ width: "100%", padding: "14px 0", borderRadius: 10, border: "none", fontWeight: 700, cursor: "pointer", background: isFull ? T.warning : T.accent, color: "#fff", fontFamily: "'Syne', serif", fontSize: 18, letterSpacing: "0.03em" }}>
              {isFull ? "Join Waitlist" : "Confirm Reservation"}
            </button>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.accentGhost, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Check size={32} color={T.accent} />
            </div>
            <h2 style={{ fontFamily: "'Syne', serif", fontSize: 26, margin: "0 0 6px", color: T.text }}>You're In!</h2>
            <p style={{ fontSize: 14, color: T.textMuted, margin: "0 0 20px" }}>
              {classData.type} · {fmtTime(classData.time)}<br/>See you in the temple!
            </p>
            <button onClick={onClose} style={{ padding: "12px 32px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App({ onAdminChange }) {
  const [page, setPage] = useState("home");
  const [isAdmin, _setIsAdmin] = useState(false);
  const setIsAdmin = useCallback((val) => { _setIsAdmin(val); if (onAdminChange) onAdminChange(val); }, [onAdminChange]);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [reservationClass, setReservationClass] = useState(null);
  const [classRegistrations, setClassRegistrations] = useState({});
  const [feedCelebrations, setFeedCelebrations] = useState({});
  const contentRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (contentRef.current) contentRef.current.scrollTo(0, 0);
  }, [page]);

  const registerForClass = useCallback((classId) => {
    setClassRegistrations(prev => ({ ...prev, [classId]: (prev[classId] || 0) + 1 }));
  }, []);

  const openReservation = useCallback((cls) => {
    setReservationClass(cls);
  }, []);

  const celebrateFeed = useCallback((feedId) => {
    setFeedCelebrations(prev => ({ ...prev, [feedId]: (prev[feedId] || 0) + 1 }));
  }, []);

  const handleLogoClick = () => {
    if (isAdmin) { setIsAdmin(false); }
    setPage("home");
  };

  const unreadCount = 2;

  const mainTabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "practice", label: "Practice", icon: Flame },
    { id: "community", label: "Community", icon: Heart },
    { id: "more", label: "More", icon: Menu },
  ];

  const moreItems = [
    { id: "classes", label: "Classes", icon: CalendarDays },
    { id: "teachers", label: "Teachers", icon: Users },
    { id: "membership", label: "Membership", icon: CreditCard },
    { id: "events", label: "Events", icon: Star },
    { id: "guest-passes", label: "Guest Passes", icon: Gift },
  ];

  const isMoreActive = moreItems.some(m => m.id === page);

  const adminTabs = [
    { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "admin-members", label: "Members", icon: Users },
    { id: "admin-schedule", label: "Schedule", icon: Calendar },
    { id: "admin-teachers", label: "Teachers", icon: UserCheck },
    { id: "admin-events", label: "Events", icon: CalendarDays },
    { id: "admin-pricing", label: "Pricing", icon: DollarSign },
    { id: "admin-broadcast", label: "Broadcast", icon: Megaphone },
    { id: "admin-settings", label: "Settings", icon: Settings },
  ];

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage />;
      case "classes": return <ClassesPage />;
      case "schedule": return <SchedulePage />;
      case "practice": return <PracticePage />;
      case "community": return <CommunityPage />;
      case "teachers": return <TeachersPage />;
      case "membership": return <MembershipPage />;
      case "events": return <EventsPage />;
      case "guest-passes": return <GuestPassPage />;
      case "admin-dashboard": return <AdminDashboard />;
      case "admin-members": return <AdminMembersPage />;
      case "admin-schedule": return <AdminSchedulePage />;
      case "admin-teachers": return <AdminTeachersPage />;
      case "admin-events": return <AdminEventsPage />;
      case "admin-pricing": return <AdminPricingPage />;
      case "admin-broadcast": return <AdminBroadcastPage />;
      case "admin-settings": return <AdminSettingsPage />;
      default: return <HomePage />;
    }
  };

  // ——— ADMIN LAYOUT ———
  if (isAdmin) {
    return (
      <AppContext.Provider value={{ page, setPage, classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", background: "#f3f4f6", color: "#1a1e2e" }}>
          <aside style={{ width: 240, background: "#ffffff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", position: "fixed", height: "100vh", zIndex: 20 }}>
            <div style={{ padding: 16, borderBottom: "1px solid #e5e7eb" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff" }}>M</div>
                <div>
                  <span style={{ fontFamily: "'Syne', serif", fontSize: 18, color: "#1a1e2e", fontWeight: 600, display: "block", lineHeight: 1 }}>MISSION</span>
                  <span style={{ fontSize: 9, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.15em" }}>Admin Panel</span>
                </div>
              </div>
            </div>
            <nav style={{ flex: 1, padding: "12px 8px", overflow: "auto" }}>
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#9ca3af", padding: "0 10px", margin: "0 0 8px" }}>Management</p>
              {adminTabs.map(tab => {
                const active = page === tab.id;
                return (
                  <button key={tab.id} onClick={() => setPage(tab.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: active ? `${T.accent}12` : "transparent", color: active ? T.accent : "#6b7280", fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer", marginBottom: 2, textAlign: "left" }}>
                    <tab.icon size={18} />
                    <span>{tab.label}</span>
                    {active && <ChevronRight size={14} style={{ marginLeft: "auto", opacity: 0.6 }} />}
                  </button>
                );
              })}
            </nav>
            <div style={{ borderTop: "1px solid #e5e7eb", padding: "10px 8px" }}>
              <button onClick={() => { setIsAdmin(false); setPage("home"); }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: "transparent", color: "#6b7280", fontSize: 13, cursor: "pointer", textAlign: "left" }}>
                <LogOut size={18} />
                <span>Exit Admin</span>
              </button>
            </div>
          </aside>
          <main style={{ flex: 1, marginLeft: 240, padding: 24, overflow: "auto" }}>
            {renderPage()}
          </main>
        </div>
      </AppContext.Provider>
    );
  }

  // ——— CONSUMER LAYOUT ———
  return (
    <AppContext.Provider value={{ page, setPage, classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: T.bgDim, fontFamily: "'DM Sans', system-ui, sans-serif", position: "relative" }}>

        {/* Header */}
        <header style={{ position: "sticky", top: 0, zIndex: 30, background: T.bg, color: "#fff", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={handleLogoClick} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff" }}>M</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "'Syne', serif", fontSize: 20, lineHeight: 1, letterSpacing: "0.02em" }}>{STUDIO_CONFIG.name}</span>
              <span style={{ fontSize: 9, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.15em" }}>{STUDIO_CONFIG.subtitle}</span>
            </div>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <button onClick={() => { setIsAdmin(true); setPage("admin-dashboard"); }} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: T.accent }}>
              <Shield size={20} />
            </button>
            <button onClick={() => setShowNotifications(true)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff", position: "relative" }}>
              <Bell size={20} />
              {unreadCount > 0 && <span style={{ position: "absolute", top: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: T.accent, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>{unreadCount}</span>}
            </button>
            <button onClick={() => setShowSettings(true)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff" }}>
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main ref={contentRef} style={{ paddingBottom: 80 }}>
          {renderPage()}
        </main>

        {/* More Menu */}
        {showMore && (
          <div onClick={() => setShowMore(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 40 }}>
            <div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 68, left: 16, right: 16, maxWidth: 358, margin: "0 auto", background: T.bgCard, borderRadius: 16, padding: "14px 12px", boxShadow: "0 8px 32px rgba(0,0,0,.15)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 6px 8px" }}>
                <span style={{ fontFamily: "'Syne', serif", fontSize: 20 }}>More</span>
                <button onClick={() => setShowMore(false)} style={{ padding: 4, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer" }}><X size={18} color={T.textMuted} /></button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {moreItems.map(item => {
                  const active = page === item.id;
                  return (
                    <button key={item.id} onClick={() => { setPage(item.id); setShowMore(false); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px", borderRadius: 10, border: "none", cursor: "pointer", background: active ? T.accentGhost : T.bgDim, color: active ? T.accent : T.textMuted }}>
                      <item.icon size={22} />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Nav */}
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 30, background: T.bgCard, borderTop: `1px solid ${T.border}`, maxWidth: 390, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-around", padding: "6px 4px 10px" }}>
            {mainTabs.map(tab => {
              const active = tab.id === "more" ? (isMoreActive || showMore) : page === tab.id;
              if (tab.id === "more") {
                return (
                  <button key={tab.id} onClick={() => setShowMore(true)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: active ? T.accent : T.textFaint }}>
                    <tab.icon size={20} strokeWidth={active ? 2.5 : 2} />
                    <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{tab.label}</span>
                  </button>
                );
              }
              return (
                <button key={tab.id} onClick={() => setPage(tab.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: active ? T.accent : T.textFaint }}>
                  <tab.icon size={20} strokeWidth={active ? 2.5 : 2} />
                  <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Modals */}
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}
        {reservationClass && <ReservationModal classData={reservationClass} onConfirm={registerForClass} onClose={() => setReservationClass(null)} />}
      </div>
    </AppContext.Provider>
  );
}
