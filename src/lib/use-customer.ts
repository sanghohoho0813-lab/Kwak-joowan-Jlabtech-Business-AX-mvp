"use client";

/**
 * 고객 플랫폼에서 "지금 로그인한 것으로 보는" 고객사.
 *
 * 실제 서비스에서는 인증 세션에서 온다. 지금은 설정에 저장된 고객사 id 로
 * 데모 계정 중 하나를 고른다. 화면 코드는 이 훅만 쓰므로, 인증이 붙어도
 * 이 파일의 구현부만 바꾸면 된다.
 */

import { useSettings } from "@/lib/settings-context";
import { demoCustomers } from "@/data/mock/customer-portal";
import type { CustomerAccount } from "@/data/types";

export function useCustomer(): CustomerAccount & {
  all: CustomerAccount[];
  switchTo: (id: string) => void;
} {
  const { customer, setCustomer } = useSettings();
  const account = demoCustomers.find((c) => c.id === customer) ?? demoCustomers[0];
  return { ...account, all: demoCustomers, switchTo: setCustomer };
}
