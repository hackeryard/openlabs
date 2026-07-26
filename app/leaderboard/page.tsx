import { Metadata } from "next";
import LeaderboardClient from "./LeaderboardClient";

export const metadata: Metadata = {
  title: "Leaderboard | OpenLabs",
  description: "Global leaderboard for OpenLabs scientists.",
};

export default function LeaderboardPage() {
  return <LeaderboardClient />;
}
