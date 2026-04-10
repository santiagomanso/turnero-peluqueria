"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { logoutAdminAction } from "../_actions/verify-admin-password";

const MobileSheet = dynamic(() => import("./admin-mobile-sheet"), {
  ssr: false,
});

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: number;
  /** Controls rendered to the right of the title — desktop only */
  desktopControls?: React.ReactNode;
  /** When true, desktopControls container stretches to fill remaining header width */
  desktopControlsExpand?: boolean;
  /** Dropdown or button rendered on the right side of the mobile topbar */
  mobileControls?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  subtitle,
  badge,
  desktopControls,
  desktopControlsExpand = false,
  mobileControls,
}: AdminPageHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAdminAction();
    router.push("/admin/login");
  };

  return (
    <>
      {/* ── Mobile topbar ── */}
      <div className="hidden max-lg:flex fixed top-0 left-0 right-0 z-30 bg-white dark:bg-zinc-900 border-b border-border-subtle dark:border-zinc-800 h-14 items-center justify-between px-4">
        <MobileSheet onLogout={handleLogout} />

        <div className="relative flex items-center">
          <p className="font-heebo text-sm font-semibold tracking-wide text-content dark:text-zinc-100">
            {title}
          </p>
          {badge != null && badge > 0 && (
            <span className="absolute -top-1 -right-4.5 min-w-4 h-4 flex items-center justify-center text-[0.6rem] font-bold text-white bg-gold rounded-full px-1 leading-none">
              {badge}
            </span>
          )}
        </div>

        {mobileControls ?? <div className="w-9" />}
      </div>

      {/* ── Desktop header ── */}
      <div className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-border-subtle dark:border-zinc-800 px-7 h-19 flex items-center max-lg:hidden">
        <div className="relative">
          <div className="relative inline-block">
            <h1 className="font-heebo text-xl font-semibold text-content dark:text-zinc-100">
              {title}
            </h1>
            {badge != null && badge > 0 && (
              <span className="absolute -top-1 -right-4.5 min-w-4 h-4 flex items-center justify-center text-[0.6rem] font-bold text-white bg-gold rounded-full px-1 leading-none">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-content-tertiary dark:text-zinc-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {desktopControls && (
          <div
            className={
              desktopControlsExpand
                ? "flex-1 ml-4 flex items-center gap-2"
                : "ml-auto flex items-center gap-2"
            }
          >
            {desktopControls}
          </div>
        )}
      </div>
    </>
  );
}
