/**
 * 사진 자리표시자.
 *
 * 실제 사진은 추후 제이랩테크에서 제공받아 넣는다.
 * 임의의 Stock Photo 나 AI 생성 이미지를 넣지 않는다.
 * 16:9 비율을 고정해 두었으므로 나중에 이미지를 넣어도 레이아웃이 흔들리지 않는다.
 */

import { ImageIcon, type LucideIcon } from "lucide-react";

interface Props {
  label: string;
  caption: string;
  icon?: LucideIcon;
}

export function PhotoPlaceholder({ label, caption, icon: Icon = ImageIcon }: Props) {
  return (
    <figure className="min-w-0">
      <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-dashed border-line bg-ivory-100/70">
        <div className="px-4 text-center">
          <span className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-ivory-200 text-inkmuted">
            <Icon size={19} strokeWidth={1.7} />
          </span>
          <p className="text-[0.8em] font-semibold text-inkbody">{label}</p>
          <p className="mt-0.5 text-[0.7em] text-inkmuted">이미지 삽입 예정</p>
        </div>
      </div>
      <figcaption className="mt-2 text-[0.75em] leading-relaxed text-inkmuted">
        {caption}
      </figcaption>
    </figure>
  );
}
