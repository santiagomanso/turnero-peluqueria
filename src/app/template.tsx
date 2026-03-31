export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ animation: "page-enter 0.55s cubic-bezier(0.16,1,0.3,1) forwards" }}>
      {children}
    </div>
  );
}
