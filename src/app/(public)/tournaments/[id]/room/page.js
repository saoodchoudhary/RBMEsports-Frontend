"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RoomPage({ params }) {
    const { id } = React.use(params);
  const router = useRouter();
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.room(id);
        setData(res.data);
      } catch (e) {
        // ✅ only redirect if truly unauthorized (not just Redux not ready)
        if (e.status === 401) {
          router.push(`/login?next=/tournaments/${id}/room`);
          return;
        }
        setErr(e.message);
      }
    })();
  }, [id, router]);

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <h1 className="text-xl font-extrabold">Room Details</h1>
        <p className="mt-1 text-sm text-slate-600">
          Visible only to registered & paid participants (or admin).
        </p>
      </div>

      {err && <div className="card p-4 text-sm text-red-600">{err}</div>}

      {data && (
        <div className="card p-4">
          <div className="text-sm font-bold">Room ID</div>
          <div className="mt-1 text-sm">{data.roomId || "Not announced yet"}</div>

          <div className="mt-4 text-sm font-bold">Room Password</div>
          <div className="mt-1 text-sm">{data.roomPassword || "Not announced yet"}</div>
        </div>
      )}

      {!data && !err && (
        <div className="text-sm text-slate-600">Loading...</div>
      )}
    </div>
  );
}