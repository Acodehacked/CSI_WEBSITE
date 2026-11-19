import type { StaticImageData } from "next/image";
import events1 from "@/public/events1.png";
import events2 from "@/public/events2.png";
import events3 from "@/public/events3.png";
import missionIcon from "@/public/missionicon.png";
import visionIcon from "@/public/visionicon.png";

/**
 * Landing page copy. Everything the branch is likely to want to edit lives
 * here, so the section components stay purely presentational.
 */

export const sections = [
  { id: "top", label: "Index" },
  { id: "manifesto", label: "Manifesto" },
  { id: "vision", label: "Vision" },
  { id: "about", label: "About" },
  { id: "tracks", label: "Tracks" },
  { id: "programmes", label: "Programmes" },
  { id: "events", label: "Events" },
  { id: "join", label: "Join" },
] as const;

/** Site-wide links. Home sections use "/#id" so they work from any page. */
export const nav = [
  { href: "/about", label: "About" },
  { href: "/#programmes", label: "Programmes" },
  { href: "/#events", label: "Events" },
  { href: "/team", label: "Team" },
  { href: "/#join", label: "Join" },
];

export const vision =
  "We turn curiosity into craft - giving every student at SJCET the tools, the mentors and the stage to build software that matters.";

export const facts = [
  { value: 1965, label: "Computer Society of India founded" },
  { value: 2002, label: "SJCET Palai established" },
  { value: 6, label: "Tracks of practice", pad: 2 },
  { value: 52, label: "Weeks of building, every year" },
];

export const tracks = [
  {
    title: "Software Engineering",
    body: "From first commit to production. Version control, testing, clean architecture and shipping real products as a team.",
    tags: ["Web", "Mobile", "Systems"],
    lit: [0],
  },
  {
    title: "AI & Data",
    body: "Machine learning from the fundamentals up - data wrangling, model building and the ethics of putting models in the world.",
    tags: ["ML", "Analytics", "LLMs"],
    lit: [1, 3],
  },
  {
    title: "Cybersecurity",
    body: "Think like an attacker, build like a defender. Capture-the-flag practice, secure coding and network fundamentals.",
    tags: ["CTF", "Networks", "Crypto"],
    lit: [2],
  },
  {
    title: "Competitive Programming",
    body: "Algorithms and data structures under the clock. Weekly problem sets that sharpen reasoning for contests and interviews.",
    tags: ["DSA", "Contests", "Interviews"],
    lit: [0, 2],
  },
  {
    title: "Open Source",
    body: "Read big codebases, land your first pull request and learn how global communities build software in the open.",
    tags: ["Git", "Community", "Docs"],
    lit: [3],
  },
  {
    title: "Design & Product",
    body: "Interfaces people enjoy using. Research, prototyping and the product thinking that turns code into something useful.",
    tags: ["UI/UX", "Research", "Prototyping"],
    lit: [0, 1, 2, 3],
  },
];

export const programmes = [
  {
    name: "Workshops",
    body: "Hands-on sessions where you leave with something running on your own machine.",
    cadence: "Monthly",
  },
  {
    name: "Hackathons",
    body: "Overnight builds with mentors on the floor and problems worth solving.",
    cadence: "Each semester",
  },
  {
    name: "Expert Talks",
    body: "Engineers and researchers from industry on what the work is really like.",
    cadence: "Recurring",
  },
  {
    name: "Coding Contests",
    body: "Timed rounds that reward clear thinking more than fast typing.",
    cadence: "Fortnightly",
  },
  {
    name: "Industry Visits",
    body: "Step inside the teams and studios building the software you use.",
    cadence: "Annual",
  },
  {
    name: "Project Showcase",
    body: "A stage for the things members build - demos, feedback and a room that cheers.",
    cadence: "Year end",
  },
];

/** One step per triangle of the CSI mark, which assembles as you scroll. */
export const steps = [
  {
    title: "Register",
    body: "Sign up as a CSI student member through the branch. Membership opens the national network of chapters, events and resources.",
  },
  {
    title: "Find your track",
    body: "Pick a track that pulls at you. Switch any time - most members end up wandering across two or three.",
  },
  {
    title: "Build & ship",
    body: "Show up to sessions, team up on a project and put it in front of people. That is the whole curriculum.",
  },
  {
    title: "Launch",
    body: "Four pieces, one mark. You're part of the branch now — the next session has a seat with your name on it.",
  },
];

// TODO(branch): point this at the real membership / registration form.
export const joinHref = "/team";

export const address = [
  "St. Joseph's College of Engineering and Technology",
  "Choondacherry, Palai",
  "Kottayam, Kerala 686579",
];

// TODO(branch): titles and captions below are placeholders written from what
// each photo shows. Replace them with the real event names, dates and notes.
export const events: {
  title: string;
  tag: string;
  body: string;
  image: StaticImageData;
  alt: string;
}[] = [
  {
    alt: "Students of the CSI SJCET branch gathered in a classroom for a group photo",
    body: "Members and coordinators of the branch together after a session.",
    image: events1,
    tag: "Community",
    title: "Members' Meet",
  },
  {
    alt: "A large group of students outdoors holding a Slash Key banner",
    body: "The branch out in force behind the Slash Key banner.",
    image: events2,
    tag: "Event",
    title: "Slash Key",
  },
  {
    alt: "Students seated at desks during a classroom session",
    body: "A hands-on classroom session run by the branch.",
    image: events3,
    tag: "Session",
    title: "Technical Session",
  },
];

/* ------------------------------------------------------------------ */
/* About page                                                          */
/* ------------------------------------------------------------------ */

// TODO(branch): the story, mission and vision below are drafts. Replace them
// with the branch's official wording.
export const aboutStory = [
  "The CSI student branch at St. Joseph's College of Engineering and Technology is where students who like making things with computers find each other. What started as a handful of sessions has grown into a year-round programme of workshops, contests, talks and builds.",
  "We are part of the Computer Society of India, which links our members to chapters, events and professionals across the country — but most of what we do happens right here on campus, in labs and classrooms, late into the evening.",
];

export const pillars = [
  {
    body: "To build a community where every student learns computing by doing — through sessions, projects and mentorship that connect the classroom to real work.",
    icon: missionIcon,
    label: "Mission",
  },
  {
    body: "A campus where students graduate as confident builders, ready to lead teams and contribute to India's technology community.",
    icon: visionIcon,
    label: "Vision",
  },
];

export const values = [
  {
    body: "Ask why, then go find out. Every good project starts as a question.",
    title: "Curiosity",
  },
  {
    body: "Care about the details. Ship work you would be proud to show.",
    title: "Craft",
  },
  {
    body: "Learn in the open, teach what you know, and lift the people beside you.",
    title: "Community",
  },
  {
    body: "Build things that are useful to someone beyond the grade.",
    title: "Contribution",
  },
];

/* ------------------------------------------------------------------ */
/* Team page                                                           */
/* ------------------------------------------------------------------ */

export type TeamGroup = "Faculty" | "Execom" | "Leads";

export interface TeamMember {
  name: string;
  role: string;
  group: TeamGroup;
  /** Optional portrait; cards fall back to the CSI mark without one. */
  photo?: StaticImageData;
  /** Optional profile link, e.g. LinkedIn or GitHub. */
  href?: string;
}

// TODO(branch): every name below is a placeholder. Fill in real names, add
// portraits (import them like the event photos) and profile links.
const PLACEHOLDER = "Name to be added";

export const team: TeamMember[] = [
  { group: "Faculty", name: PLACEHOLDER, role: "Branch Counsellor" },
  { group: "Faculty", name: PLACEHOLDER, role: "Faculty Coordinator" },
  { group: "Execom", name: PLACEHOLDER, role: "Chairperson" },
  { group: "Execom", name: PLACEHOLDER, role: "Vice Chairperson" },
  { group: "Execom", name: PLACEHOLDER, role: "Secretary" },
  { group: "Execom", name: PLACEHOLDER, role: "Joint Secretary" },
  { group: "Execom", name: PLACEHOLDER, role: "Treasurer" },
  { group: "Execom", name: PLACEHOLDER, role: "Programme Coordinator" },
  { group: "Leads", name: PLACEHOLDER, role: "Technical Lead" },
  { group: "Leads", name: PLACEHOLDER, role: "Design Lead" },
  { group: "Leads", name: PLACEHOLDER, role: "Media Lead" },
  { group: "Leads", name: PLACEHOLDER, role: "Content Lead" },
  { group: "Leads", name: PLACEHOLDER, role: "Outreach Lead" },
  { group: "Leads", name: PLACEHOLDER, role: "Web Lead" },
];
