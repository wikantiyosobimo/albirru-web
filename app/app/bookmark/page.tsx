import { getPortalProfile } from "@/lib/portal/session";
import { PortalTopbar } from "@/components/portal/topbar";
import { BookmarkList } from "@/components/portal/bookmark-list";

export const metadata = { title: "Bookmark — Albirru" };

export default async function BookmarkPage() {
  const { profile } = await getPortalProfile();
  return (
    <>
      <PortalTopbar title="Bookmark" subtitle="Soal dan materi yang kamu simpan." nama={profile?.nama ?? "Farhan"} />
      <div className="p-5 lg:p-7">
        <BookmarkList />
      </div>
    </>
  );
}
