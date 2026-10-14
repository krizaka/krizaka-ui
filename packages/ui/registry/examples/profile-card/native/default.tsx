import { Avatar, Button, ProfileCard } from "@krizaka/ui/native";

// A creator at a glance on mobile: the headline gauge, two stats in words, one action.
export default function NativeProfileCardDefault() {
  return (
    <ProfileCard
      visual={<Avatar src="https://krizaka-assets.b-cdn.net/site/people/ui/noor-256.c340c41421.webp" alt="Noor Haddad" fallback="NH" size="xl" />}
      name="Noor Haddad"
      statLabel="Profile complete"
      value={80}
      stats={[
        { label: "Challenges met", value: 12, max: 15, valueText: "12 of 15" },
        { label: "Replies within a day", value: 94 },
      ]}
      caption="Dance and street fashion · Montréal"
      animated={false}
      style={{ width: 300 }}
    >
      <Button variant="primary" size="sm" label="Follow" />
    </ProfileCard>
  );
}
