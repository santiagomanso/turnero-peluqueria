import Link from "next/link";
import { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  path: string;
  icon: LucideIcon;
  type?: "external-link" | "internal-link" | "subtle";
};

const linkStyles =
  "w-full py-4 px-5 flex items-center justify-between rounded-xl bg-white border border-border-subtle shadow-md transition-all active:scale-[0.98] group";

const subtleStyles =
  "w-full py-3 px-5 flex items-center justify-between rounded-xl bg-transparent border border-border-subtle/50 transition-all active:scale-[0.98] group";

function LinkContent({
  label,
  Icon,
  subtle,
}: {
  label: string;
  Icon: LucideIcon;
  subtle?: boolean;
}) {
  return (
    <>
      <span
        className={`text-sm font-medium transition-colors ${
          subtle ? "text-content-tertiary" : "text-content"
        }`}
      >
        {label}
      </span>
      <Icon
        className={`w-4 h-4 ${subtle ? "text-content-quaternary" : "text-gold"}`}
      />
    </>
  );
}

export default function HomeLink({
  label,
  path,
  icon: Icon,
  type = "internal-link",
}: Props) {
  if (type === "subtle") {
    return (
      <Link href={path} className={subtleStyles}>
        <LinkContent label={label} Icon={Icon} subtle />
      </Link>
    );
  }

  return type === "internal-link" ? (
    <Link href={path} className={linkStyles}>
      <LinkContent label={label} Icon={Icon} />
    </Link>
  ) : (
    <a
      target="_blank"
      rel="noreferrer"
      href={"https://wa.me/+5493794619887"}
      className={linkStyles}
    >
      <LinkContent label={label} Icon={Icon} />
    </a>
  );
}
