import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot, getDocFromServer } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Admin credentials from user
export const ADMIN_USERNAME = "asxramzonfire09";
export const ADMIN_PASSWORD = "rehanabegum123";

// Initial site config to seed
export const INITIAL_SITE_CONFIG = {
  hero: {
    title: "Starwing Empire",
    subtitle: "Welcome to Starwing Empire",
    logoUrl: "", // Empty for default placeholder
    logoScale: 1,
    logoVisible: true
  },
  about: {
    title: "About Us",
    content: "Starwing Empire is a premier gaming organization dedicated to excellence in competitive play. Founded on the principles of discipline, strategy, and unity, we have risen through the ranks to become a dominant force in the esports landscape. Our mission is to foster a community where talent is nurtured and champions are forged.",
    visible: true,
    scale: 1
  },
  roster: {
    title: "Team Roster",
    visible: true,
    posterUrl: "https://picsum.photos/seed/roster/1200/800",
    scale: 1,
    players: [
      { id: 1, name: "Phoenix", role: "Duelist", description: "The fiery entry fragger.", photoUrl: "https://picsum.photos/seed/phoenix/400/600", visible: true, scale: 1, socials: { twitter: "#", instagram: "#", youtube: "#" } },
      { id: 2, name: "Viper", role: "Controller", description: "Toxic screen specialist.", photoUrl: "https://picsum.photos/seed/viper/400/600", visible: true, scale: 1, socials: { twitter: "#", instagram: "#", youtube: "#" } },
      { id: 3, name: "Sage", role: "Sentinel", description: "The ultimate support healer.", photoUrl: "https://picsum.photos/seed/sage/400/600", visible: true, scale: 1, socials: { twitter: "#", instagram: "#", youtube: "#" } },
      { id: 4, name: "Jett", role: "Duelist", description: "Agile sniper and entry.", photoUrl: "https://picsum.photos/seed/jett/400/600", visible: true, scale: 1, socials: { twitter: "#", instagram: "#", youtube: "#" } },
      { id: 5, name: "Sova", role: "Initiator", description: "Master of reconnaissance.", photoUrl: "https://picsum.photos/seed/sova/400/600", visible: true, scale: 1, socials: { twitter: "#", instagram: "#", youtube: "#" } }
    ]
  },
  lineups1: {
    title: "Strategic Lineup I",
    visible: true,
    scale: 1,
    players: [
      { id: "l1-1", name: "Phoenix", role: "Entry", description: "Aggressive space creator.", photoUrl: "https://picsum.photos/seed/phoenix/400/600", visible: true, scale: 1, socials: { twitter: "#", instagram: "#", youtube: "#" } },
      { id: "l1-2", name: "Viper", role: "Support", description: "Strategic area denial.", photoUrl: "https://picsum.photos/seed/viper/400/600", visible: true, scale: 1, socials: { twitter: "#", instagram: "#", youtube: "#" } },
      { id: "l1-3", name: "Sage", role: "Healer", description: "Reliable team anchor.", photoUrl: "https://picsum.photos/seed/sage/400/600", visible: true, scale: 1, socials: { twitter: "#", instagram: "#", youtube: "#" } },
      { id: "l1-4", name: "Jett", role: "Sniper", description: "High-mobility precision.", photoUrl: "https://picsum.photos/seed/jett/400/600", visible: true, scale: 1, socials: { twitter: "#", instagram: "#", youtube: "#" } },
      { id: "l1-5", name: "Sova", role: "Recon", description: "Information gatherer.", photoUrl: "https://picsum.photos/seed/sova/400/600", visible: true, scale: 1, socials: { twitter: "#", instagram: "#", youtube: "#" } }
    ]
  },
  lineups2: {
    title: "Strategic Lineup II",
    visible: true,
    scale: 1,
    players: [
      { id: "l2-1", name: "Omen", role: "Controller", description: "Shadowy flanker.", photoUrl: "https://picsum.photos/seed/omen/400/600", visible: true, scale: 1, socials: { twitter: "#", instagram: "#", youtube: "#" } },
      { id: "l2-2", name: "Reyna", role: "Duelist", description: "Self-sustaining frag machine.", photoUrl: "https://picsum.photos/seed/reyna/400/600", visible: true, scale: 1, socials: { twitter: "#", instagram: "#", youtube: "#" } },
      { id: "l2-3", name: "Killjoy", role: "Sentinel", description: "Tech-based site lockdown.", photoUrl: "https://picsum.photos/seed/killjoy/400/600", visible: true, scale: 1, socials: { twitter: "#", instagram: "#", youtube: "#" } },
      { id: "l2-4", name: "Breach", role: "Initiator", description: "Seismic disruption expert.", photoUrl: "https://picsum.photos/seed/breach/400/600", visible: true, scale: 1, socials: { twitter: "#", instagram: "#", youtube: "#" } },
      { id: "l2-5", name: "Cypher", role: "Sentinel", description: "The eye in the sky.", photoUrl: "https://picsum.photos/seed/cypher/400/600", visible: true, scale: 1, socials: { twitter: "#", instagram: "#", youtube: "#" } }
    ]
  },
  achievements: {
    title: "Our Achievements",
    visible: true,
    scale: 1,
    items: [
      { id: "ach-1", title: "Regional Champions 2025", date: "June 2025", description: "Secured 1st place in the Continental Pro League.", visible: true, photoUrl: "https://picsum.photos/seed/achieve0/800/450" },
      { id: "ach-2", title: "Global Finals Finalist", date: "December 2025", description: "Reached the top 4 in the World Championship Series.", visible: true, photoUrl: "https://picsum.photos/seed/achieve1/800/450" },
      { id: "ach-3", title: "Most Improved Team", date: "March 2025", description: "Recognized for our rapid ascent in the competitive rankings.", visible: true, photoUrl: "https://picsum.photos/seed/achieve2/800/450" }
    ]
  },
  socials: {
    title: "Our Socials",
    visible: true,
    items: [
      { label: "YouTube", url: "#", visible: true },
      { label: "Instagram", url: "#", visible: true },
      { label: "Discord", url: "#", visible: true },
      { label: "LinkedIn", url: "#", visible: true },
      { label: "Twitter", url: "#", visible: true }
    ]
  },
  footer: {
    quote: "Victory is not a destination, it is a relentless pursuit of excellence.",
    visible: true
  }
};

// Seed function to initialize the site config if it doesn't exist
export async function seedSiteConfig() {
  const configDoc = doc(db, "config", "site");
  const snap = await getDoc(configDoc);
  if (!snap.exists()) {
    await setDoc(configDoc, INITIAL_SITE_CONFIG);
    console.log("Site config seeded successfully.");
  } else {
    // Check if new fields exist, if not, update them
    const data = snap.data();
    const updates: any = {};
    let needsUpdate = false;

    if (!data.lineups1 || (data.lineups1.players && data.lineups1.players.length < 5)) {
      updates.lineups1 = INITIAL_SITE_CONFIG.lineups1;
      needsUpdate = true;
    }
    if (!data.lineups2 || (data.lineups2.players && data.lineups2.players.length < 5)) {
      updates.lineups2 = INITIAL_SITE_CONFIG.lineups2;
      needsUpdate = true;
    }

    if (needsUpdate) {
      await updateDoc(configDoc, updates);
      console.log("Site config updated with new fields.");
    }
  }
}

// Test connection function
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
