"use client";

/**
 * 고객 요청 작성 모달.
 * 여기서 만든 요청은 store 에 저장되고, 그 즉시 Business AX 의 "고객 요청"
 * 화면에 나타난다. (Customer → Business AX 방향의 Closed Loop 시작점)
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, Wrench, Package, RefreshCcw, Ruler, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store-context";
import { useToast } from "@/components/ui/toast";
import { demoCustomer } from "@/data/mock/customer-portal";
import { cn } from "@/lib/utils";
import type { RequestType, InstalledEquipment } from "@/data/types";

export const REQUEST_TYPES: { type: RequestType; icon: typeof Wrench; hint: string }[] = [
  { type: "교정 요청", icon: Wrench, hint: "정기 교정 일정을 잡고 싶을 때" },
  { type: "소모품 요청", icon: Package, hint: "프로브·시약·키트 등 교체분이 필요할 때" },
  { type: "재구매 요청", icon: RefreshCcw, hint: "같은 장비를 추가로 도입할 때" },
  { type: "추가 계측 상담", icon: Ruler, hint: "측정 포인트를 늘리거나 새로 설계할 때" },
  { type: "장비 문의", icon: MessageSquare, hint: "사용 중 궁금한 점이 있을 때" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  /** 미리 선택된 요청 유형 */
  initialType?: RequestType;
  /** 특정 장비에서 진입한 경우 */
  equipment?: InstalledEquipment | null;
  /** 고객이 보유한 장비 목록 (선택 가능하게) */
  equipmentOptions?: InstalledEquipment[];
}

export function RequestDialog({
  open,
  onClose,
  initialType = "교정 요청",
  equipment = null,
  equipmentOptions = [],
}: Props) {
  const { createRequest } = useStore();
  const toast = useToast();

  const [type, setType] = useState<RequestType>(initialType);
  const [equipId, setEquipId] = useState<string>(equipment?.id ?? "");
  const [detail, setDetail] = useState("");

  useEffect(() => {
    if (open) {
      setType(initialType);
      setEquipId(equipment?.id ?? "");
      setDetail("");
    }
  }, [open, initialType, equipment]);

  if (!open) return null;

  const selectedEquip =
    equipmentOptions.find((e) => e.id === equipId) ?? equipment ?? null;

  const submit = () => {
    const equipLabel = selectedEquip
      ? `${selectedEquip.itemName} ${selectedEquip.model}`
      : undefined;
    createRequest({
      customerId: demoCustomer.id,
      customerName: demoCustomer.company,
      requestType: type,
      equipmentId: selectedEquip?.id,
      equipmentName: equipLabel,
      title: equipLabel ? `${equipLabel} ${type}` : type,
      detail:
        detail.trim() ||
        (equipLabel
          ? `${equipLabel}에 대한 ${type}입니다. 담당자 연락 부탁드립니다.`
          : `${type}입니다. 담당자 연락 부탁드립니다.`),
    });
    toast("요청이 접수되었습니다", `${type} · 제이랩테크 담당자가 확인합니다`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[70] flex items-end justify-center bg-pine-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={onClose}
      >
        <motion.div
          className="max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl bg-ivory-50 shadow-card-hover sm:max-w-lg sm:rounded-2xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 flex items-center justify-between gap-3 border-b border-line bg-ivory-50 px-5 py-4">
            <div className="min-w-0">
              <p className="text-lg font-bold text-pine-900 md:text-xl">요청 보내기</p>
              <p className="clamp-1 text-sm text-inkmuted">
                {demoCustomer.company} · 담당자 {demoCustomer.contactName}님
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-lg p-1.5 text-inkmuted transition-colors duration-fast hover:bg-ivory-200 hover:text-pine-700"
              aria-label="닫기"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-5 px-5 py-5">
            {/* 요청 유형 */}
            <div>
              <p className="mb-3 text-base font-bold text-pine-900 md:text-lg">무엇을 도와드릴까요?</p>
              <div className="grid grid-cols-1 gap-2">
                {REQUEST_TYPES.map((r) => {
                  const Icon = r.icon;
                  const active = type === r.type;
                  return (
                    <button
                      key={r.type}
                      type="button"
                      onClick={() => setType(r.type)}
                      className={cn(
                        "flex items-center gap-3.5 rounded-2xl border p-4 text-left transition-colors duration-fast",
                        active
                          ? "border-pine-700 bg-pine-50"
                          : "border-line bg-ivory-100/60 hover:border-pine-100",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                          active ? "bg-pine-700 text-white" : "bg-ivory-200 text-inkmuted",
                        )}
                      >
                        <Icon size={21} strokeWidth={1.9} />
                      </span>
                      <span className="min-w-0">
                        <span
                          className={cn(
                            "block text-base font-bold md:text-lg",
                            active ? "text-pine-900" : "text-inkbody",
                          )}
                        >
                          {r.type}
                        </span>
                        <span className="clamp-2 block text-sm leading-snug text-inkmuted">{r.hint}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 대상 장비 */}
            {equipmentOptions.length > 0 ? (
              <div>
                <p className="mb-3 text-base font-bold text-pine-900 md:text-lg">
                  대상 장비 <span className="text-sm font-normal text-inkmuted">(선택)</span>
                </p>
                <select
                  value={equipId}
                  onChange={(e) => setEquipId(e.target.value)}
                  className="h-14 w-full rounded-2xl border border-line bg-ivory-100 px-4 text-base text-inkbody focus:border-pine-600/50 focus:outline-none focus:ring-2 focus:ring-pine-600/15"
                >
                  <option value="">장비를 선택하지 않음</option>
                  {equipmentOptions.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.itemName} {e.model} · {e.site}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {/* 상세 */}
            <div>
              <p className="mb-3 text-base font-bold text-pine-900 md:text-lg">
                내용 <span className="text-sm font-normal text-inkmuted">(선택)</span>
              </p>
              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                rows={3}
                placeholder="희망 일정이나 수량 등 알려주실 내용이 있으면 적어 주세요."
                className="w-full resize-none rounded-2xl border border-line bg-ivory-100 p-4 text-base leading-relaxed text-inkbody placeholder:text-inkmuted/70 focus:border-pine-600/50 focus:outline-none focus:ring-2 focus:ring-pine-600/15"
              />
            </div>
          </div>

          <div className="sticky bottom-0 flex gap-2 border-t border-line bg-ivory-50 px-5 py-4">
            <Button variant="outline" size="xl" className="flex-1" onClick={onClose}>
              취소
            </Button>
            <Button size="xl" className="flex-[2]" onClick={submit}>
              <Send size={18} />
              요청 보내기
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
