"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { InvitationsAPI, InvitationPreflight } from "@/lib/api/invitations";

/**
 * Полноценная страница акцепта приглашения.
 * Особенности:
 * - Защита от некорректного token (array / undefined)
 * - Явные лоадер/ошибка/успех состояния
 * - Блокировка кнопок, если инвайт не валиден/просрочен
 * - После успешного акцепта — редирект на организацию, если возможно
 */
export default function InvitationAcceptPage() {
  const params = useParams<{ token?: string | string[] }>();
  const router = useRouter();

  const token = useMemo(() => {
    const t = params?.token;
    if (Array.isArray(t)) return t[0] ?? "";
    return t ?? "";
  }, [params]);

  const [data, setData] = useState<InvitationPreflight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const isExpired = useMemo(() => {
    if (!data?.expires_at) return false;
    try {
      return new Date(data.expires_at).getTime() < Date.now();
    } catch {
      return false;
    }
  }, [data?.expires_at]);

  const canRespond = !!data && !isExpired && !accepted && !loading && !error;

  const preflight = useCallback(async () => {
    if (!token) {
      setError("Некорректная ссылка приглашения");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await InvitationsAPI.preflight(token);
      setData(res);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Приглашение не найдено или истекло");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    preflight();
  }, [preflight]);

  const handleAccept = useCallback(async () => {
    if (!canRespond) return;
    setSubmitting(true);
    try {
      const acceptedInv = await InvitationsAPI.accept(token);
      setAccepted(true);
      // Пытаемся уйти на страницу организации
      const orgId = acceptedInv?.org_id || data?.org_id;
      if (orgId) {
        router.replace(`/organization/${orgId}`);
      } else {
        router.replace("/");
      }
    } catch (e: any) {
      alert(e?.response?.data?.detail || "Не удалось принять приглашение");
    } finally {
      setSubmitting(false);
    }
  }, [canRespond, token, data?.org_id, router]);

  const handleReject = useCallback(async () => {
    if (!canRespond) return;
    setSubmitting(true);
    try {
      await InvitationsAPI.reject(token);
      router.replace("/login");
    } catch (e: any) {
      alert(e?.response?.data?.detail || "Не удалось отклонить приглашение");
    } finally {
      setSubmitting(false);
    }
  }, [canRespond, token, router]);

  // UI состония
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">
        Проверяем приглашение…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <div className="text-sm text-red-700">{error || "Ошибка загрузки приглашения"}</div>
        </div>
        <div className="mt-4">
          <button
            onClick={() => router.replace("/")}
            className="px-4 py-2 rounded border"
          >
            На главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 space-y-5">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Приглашение в организацию</h1>
        <p className="text-sm text-muted-foreground">
          Вы получили приглашение присоединиться к организации.
        </p>
      </div>

      <div className="rounded-lg border p-4 space-y-2">
        <div>
          <span className="text-sm text-muted-foreground">Организация:&nbsp;</span>
          <b>{data.organization_name || data.org_id}</b>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Email:&nbsp;</span>
          <b>{data.invited_email}</b>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Роль:&nbsp;</span>
          <b>{data.role}</b>
        </div>
        {data.department_id && (
          <div>
            <span className="text-sm text-muted-foreground">Департамент:&nbsp;</span>
            <b>{data.department_id}</b>
          </div>
        )}
        {data.expires_at && (
          <div>
            <span className="text-sm text-muted-foreground">Действительно до:&nbsp;</span>
            {new Date(data.expires_at).toLocaleString()}
          </div>
        )}
        {isExpired && (
          <div className="mt-2 rounded-md border border-yellow-200 bg-yellow-50 p-2 text-xs text-yellow-800">
            Срок действия приглашения истёк.
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleAccept}
          disabled={!canRespond || submitting}
          className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
        >
          {submitting ? "Обрабатываем…" : "Принять"}
        </button>
        <button
          onClick={handleReject}
          disabled={!canRespond || submitting}
          className="px-4 py-2 rounded border"
        >
          Отклонить
        </button>
        <button
          onClick={preflight}
          disabled={submitting}
          className="ml-auto px-3 py-2 text-sm rounded border"
          title="Повторно проверить статус приглашения"
        >
          Обновить
        </button>
      </div>

      {accepted && (
        <div className="text-sm text-green-700">Приглашение принято. Перенаправляем…</div>
      )}
    </div>
  );
}