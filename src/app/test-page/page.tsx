import { AthleteHeaderMeta } from "@/ui/core/athletes/AthleteHeaderMeta";
import { AthletePageShell } from "@/ui/core/athletes/AthletePageShell";
import { AthleteQuickActions } from "@/ui/core/athletes/AthleteQuickActions";
import { AthleteStatusBadges } from "@/ui/core/athletes/AthleteStatusBadge";
import { AthleteTabsController } from "@/ui/core/athletes/AthleteTabsController";
import { TabContentShell } from "@/ui/core/athletes/TabContentShell";

export default function TestPage() {
  return (
    <AthletePageShell>
      <AthleteHeaderMeta
        name="John Doe"
        age={16}
        handedness="R/R"
        roles="OF / RHP"
      />
      <AthleteStatusBadges statuses={["Active"]} />
      <AthleteQuickActions canEdit />

      <AthleteTabsController />

      <TabContentShell>Test Page Content</TabContentShell>
    </AthletePageShell>
  );
}
