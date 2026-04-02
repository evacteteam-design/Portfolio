import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-8 sm:py-12 px-4 sm:px-6 md:px-14" style={{ background: 'linear-gradient(to bottom, var(--surface), var(--white))' }}>
      <div className="max-w-[var(--max-w)] mx-auto">
        {/* Main footer content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 sm:gap-8 mb-8 sm:mb-10">
          <div>
            <p className="text-[15px] font-semibold text-[var(--ink)]">
              Akhil Vanga
            </p>
            <p className="text-[13px] text-[var(--ink3)] mt-1">
              AI-First Product Designer
            </p>
          </div>

          <div className="flex gap-6">
            {["LinkedIn", "Email"].map((label) => (
              <Link
                key={label}
                href={
                  label === "LinkedIn"
                    ? "https://www.linkedin.com/in/akvanga/"
                    : "mailto:akhil.vang@gmail.com"
                }
                target={label === "LinkedIn" ? "_blank" : undefined}
                rel={label === "LinkedIn" ? "noopener noreferrer" : undefined}
                className="text-[13px] text-[var(--ink3)] hover:text-[var(--ink)] transition-colors relative group"
              >
                {label}
                <span className="absolute left-0 -bottom-0.5 w-full h-px bg-[var(--ink)] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            ))}
          </div>

          <div className="text-[13px] text-[var(--ink3)] md:text-right leading-relaxed">
            <a
              href="mailto:akhil.vang@gmail.com"
              className="text-[var(--accent)] hover:underline"
            >
              akhil.vang@gmail.com
            </a>
            <br />
            +1 (341) 345-7337
          </div>
        </div>

        {/* Copyright bar */}
        <div className="pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[12px] text-[var(--ink3)]">
            © Copyright {new Date().getFullYear()}. All Rights Reserved by Akhil
          </p>
          <p className="text-[12px] text-[var(--ink3)]">
            Created by <span className="font-medium text-[var(--ink2)]">Akhil Vanga</span>
          </p>
        </div>
      </div>
    </footer>
  );
}


