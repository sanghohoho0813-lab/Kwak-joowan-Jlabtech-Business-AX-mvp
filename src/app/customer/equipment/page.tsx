"use client";

import { useMemo, useState } from "react";
import { Wrench, MapPin, ShieldCheck, CalendarCheck, Package, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { RequestDialog } from "@/components/customer/request-dialog";
import { repo } from "@/data/repository";
import { demoCustomer } from "@/data/mock/customer-portal";
import { formatDate, dday, daysLeft } from "@/lib/utils";
import type { EquipmentStatus, InstalledEquipment, RequestType } from "@/data/types";

const equipmentTone: Record<EquipmentStatus, "success" | "warning" | "danger" | "neutral"> = {
  "정상 가동": "success",
  "교정 필요": "warning",
  "점검 요청": "danger",
  "보증 만료": "neutral",
};

export default function CustomerEquipmentPage() {
  const myEquipment = useMemo(
    () => repo.getInstalledEquipment().filter((e) => e.customerId === demoCustomer.id),
    [],
  );

  const [open, setOpen] = useState(false);
  const [type, setType] = useState<RequestType>("교정 요청");
  const [target, setTarget] = useState<InstalledEquipment | null>(null);

  const request = (t: RequestType, e: InstalledEquipment) => {
    setType(t);
    setTarget(e);
    setOpen(true);
  };

  return (
    <div className="space-y-5">
      <Reveal>
        <h1 className="text-xl font-bold tracking-tight text-pine-900 md:text-2xl">내 장비</h1>
        <p className="mt-2 text-sm leading-relaxed text-inkmuted md:text-base">
          제이랩테크를 통해 도입하신 장비입니다. 교정 시점과 보증 상태를 확인하고, 필요한
          요청을 바로 보내실 수 있습니다.
        </p>
      </Reveal>

      <Stagger className="space-y-4">
        {myEquipment.map((e) => {
          const warrantyLeft = daysLeft(e.warrantyEndDate);
          const calLeft = daysLeft(e.nextCalibrationDate);
          return (
            <StaggerItem key={e.id}>
              <Card>
                <CardContent className="p-5 md:p-6">
                  {/* 헤더 */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pine-50 text-pine-700">
                        <Wrench size={21} strokeWidth={1.9} />
                      </span>
                      <div className="min-w-0">
                        <p className="clamp-2 text-base font-bold leading-snug text-pine-900">
                          {e.itemName} <span className="text-inkmuted">{e.model}</span>
                        </p>
                        <p className="clamp-1 mt-1 flex items-center gap-1.5 text-xs text-inkmuted">
                          <MapPin size={12} className="shrink-0" />
                          {e.site}
                        </p>
                      </div>
                    </div>
                    <Badge tone={equipmentTone[e.status]}>{e.status}</Badge>
                  </div>

                  {/* 상세 정보 — 모바일에서는 표 대신 2열 그리드 */}
                  <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl bg-ivory-100/70 p-4 sm:grid-cols-4">
                    {[
                      { label: "설치일", value: formatDate(e.installedDate) },
                      { label: "시리얼", value: e.serial },
                      { label: "마지막 교정", value: formatDate(e.lastCalibrationDate) },
                      {
                        label: "보증",
                        value:
                          warrantyLeft > 0
                            ? `${formatDate(e.warrantyEndDate)}까지`
                            : "보증 종료",
                      },
                    ].map((d) => (
                      <div key={d.label} className="min-w-0">
                        <p className="text-2xs text-inkmuted">{d.label}</p>
                        <p className="num clamp-1 mt-0.5 text-xs font-semibold text-inkbody">
                          {d.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* 다음 교정 */}
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-sand-400/40 bg-sand-100/40 p-3.5">
                    <CalendarCheck size={17} className="shrink-0 text-sand-600" />
                    <p className="num min-w-0 flex-1 text-xs font-semibold text-inkbody">
                      다음 교정 예정 {formatDate(e.nextCalibrationDate)}
                      <span className="ml-2 font-bold text-sand-600">
                        {dday(e.nextCalibrationDate)}
                      </span>
                    </p>
                    {calLeft >= 0 && calLeft <= 30 ? (
                      <Badge tone="warning">일정 조율 필요</Badge>
                    ) : null}
                  </div>

                  {e.consumable ? (
                    <p className="mt-2 flex items-center gap-2 text-2xs text-inkmuted">
                      <Package size={13} className="shrink-0 text-pine-600" />
                      정기 교체 소모품 · {e.consumable}
                    </p>
                  ) : null}

                  {/* 행동 */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="md" onClick={() => request("교정 요청", e)}>
                      <CalendarCheck size={15} />
                      교정 요청
                    </Button>
                    <Button
                      size="md"
                      variant="secondary"
                      onClick={() => request("소모품 요청", e)}
                    >
                      <Package size={15} />
                      소모품 요청
                    </Button>
                    <Button
                      size="md"
                      variant="outline"
                      onClick={() => request("장비 문의", e)}
                    >
                      <MessageSquare size={15} />
                      장비 문의
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          );
        })}
      </Stagger>

      <Reveal delay={0.1}>
        <p className="flex items-start gap-2 rounded-xl bg-ivory-200/60 p-4 text-2xs leading-relaxed text-inkmuted">
          <ShieldCheck size={14} className="mt-0.5 shrink-0 text-pine-600" />
          장비 정보는 제이랩테크 설치 대장과 연동되어 있습니다. 실제 운영 시에는 납품·설치
          완료 시점에 자동으로 등록됩니다.
        </p>
      </Reveal>

      <RequestDialog
        open={open}
        onClose={() => setOpen(false)}
        initialType={type}
        equipment={target}
        equipmentOptions={myEquipment}
      />
    </div>
  );
}
