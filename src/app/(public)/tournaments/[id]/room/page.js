"use client";

import React, { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { FiLock, FiCopy, FiChevronLeft, FiVideo } from "react-icons/fi";

function copy(text) {
  if (!text) return Promise.resolve(false);
  return navigator.clipboard.writeText(String(text)).then(() => true).catch(() => false);
}

export default function RoomPage({ params }) {
  const { id } = React.use(params);
  const router = useRouter();

  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);

  const roomId = data?.roomId || "";
  const roomPassword = data?.roomPassword || "";

  const roomReady = Boolean(roomId) && Boolean(roomPassword);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const res = await api.room(id);
        if (!mounted) return;
        setData(res.data);
        setErr(null);
      } catch (e) {
        if (!mounted) return;

        // Backend returns 401 if not logged in
        if (e?.status === 401) {
          router.push(`/login?next=/tournaments/${id}/room`);
          return;
        }

        // 403 if logged in but not paid
        setErr(e?.message || "Failed to load room details");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id, router]);

  const title = useMemo(() => data?.title || "Room Details", [data]);

  return (
    <div className="space-y-6">
      <Card hover={false} className="p-0 overflow-hidden">
        <div className="p-6 bg-gradient-to-br from-slate-50 via-white to-purple-50 border-b border-slate-200">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <FiVideo className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-800 truncate">{title}</h1>
                  <p className="mt-1 text-sm text-slate-600">
                    Visible only to registered & paid participants (or admin).
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.back()}
              className="text-sm font-semibold text-slate-700 hover:text-purple-700 inline-flex items-center gap-2"
            >
              <FiChevronLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading && (
            <div className="space-y-3">
              <div className="h-20 rounded-xl skeleton"></div>
              <div className="h-20 rounded-xl skeleton"></div>
            </div>
          )}

          {!loading && err && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <div className="font-bold mb-1 flex items-center gap-2">
                <FiLock className="w-4 h-4" />
                Access Restricted
              </div>
              <div>{err}</div>
              <div className="mt-3 text-xs text-red-600">
                Note: Room details are visible only after payment success.
              </div>
            </div>
          )}

          {!loading && !err && data && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Room ID</div>
                <div className="mt-2 text-lg font-extrabold text-slate-900 break-all">
                  {roomId || "Not announced yet"}
                </div>

                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!roomId}
                    onClick={async () => {
                      await copy(roomId);
                    }}
                    className="inline-flex items-center gap-2"
                  >
                    <FiCopy className="w-4 h-4" />
                    Copy
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Room Password</div>
                <div className="mt-2 text-lg font-extrabold text-slate-900 break-all">
                  {roomPassword || "Not announced yet"}
                </div>

                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!roomPassword}
                    onClick={async () => {
                      await copy(roomPassword);
                    }}
                    className="inline-flex items-center gap-2"
                  >
                    <FiCopy className="w-4 h-4" />
                    Copy
                  </Button>
                </div>
              </div>

              {!roomReady && (
                <div className="md:col-span-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  Room details have not been announced yet. Please check again closer to match time.
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}