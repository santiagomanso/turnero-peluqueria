import Link from "next/link";
import { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  path: string;
  icon: LucideIcon;
  type?: "external-link" | "internal-link";
};

const linkStyles =
  "w-full py-4 px-5 flex items-center justify-between rounded-xl bg-white border border-border-subtle shadow-md transition-all active:scale-[0.98] group";

function LinkContent({ label, Icon }: { label: string; Icon: LucideIcon }) {
  return (
    <>
      <span className="text-sm font-medium text-content transition-colors">
        {label}
      </span>
      <Icon className="w-4 h-4 text-gold" />
    </>
  );
}

export default function HomeLink({
  label,
  path,
  icon: Icon,
  type = "internal-link",
}: Props) {
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
