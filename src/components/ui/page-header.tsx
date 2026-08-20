import { Reveal } from "./motion";

interface PageHeaderProps {
  title: string;
  description: string;
  badge?: string;
}

export function PageHeader({ title, description, badge }: PageHeaderProps) {
  return (
    <Reveal className="mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold tracking-tight text-pine-900 md:text-2xl">
          {title}
        </h1>
        {badge ? (
          <span className="inline-flex h-6 items-center rounded-full bg-pine-50 px-2.5 text-2xs font-semibold text-pine-700">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="clamp-2 mt-1.5 max-w-2xl text-sm text-inkmuted">{description}</p>
    </Reveal>
  );
}
