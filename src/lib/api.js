const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function request(path, { method = "GET", body, headers } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {})
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store"
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = data?.message || "Request failed";
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  // Auth
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => request("/auth/me"),

  // Tournaments
  listTournaments: (qs = "") => request(`/tournaments${qs}`),
  getTournament: (id) => request(`/tournaments/${id}`),
  leaderboard: (id) => request(`/tournaments/${id}/leaderboard`),
  matchResults: (id) => request(`/tournaments/${id}/match-results`),
  room: (id) => request(`/tournaments/${id}/room`),

  registerSoloDuo: (id, payload) => request(`/tournaments/${id}/register`, { method: "POST", body: payload }),
  registerSquad: (id, payload) => request(`/tournaments/${id}/register-squad`, { method: "POST", body: payload }),

  // Coupons
  validateCoupon: (payload) => request("/coupons/validate", { method: "POST", body: payload }),

  // Payments
  createOrder: (paymentId) => request("/payments/create-order", { method: "POST", body: { paymentId } }),
  verifyPayment: (payload) => request("/payments/verify", { method: "POST", body: payload }),
  myPayments: () => request("/payments/my-payments"),

  // Wallet
  wallet: () => request("/wallet"),
  walletAddMoneyOrder: (amount) => request("/wallet/add-money", { method: "POST", body: { amount } }),
  walletVerifyAdd: (payload) => request("/wallet/verify-payment", { method: "POST", body: payload }),
  walletPayTournament: (payload) => request("/wallet/pay-tournament", { method: "POST", body: payload }),
  walletWithdraw: (payload) => request("/wallet/withdraw", { method: "POST", body: payload }),
  walletWithdrawals: () => request("/wallet/withdrawals"),
  walletWithdrawalInfo: (payload) => request("/wallet/withdrawal-info", { method: "PUT", body: payload }),

  // Winners
  winnersRecent: (limit = 10) => request(`/winners/recent?limit=${limit}`),
  winnersFeatured: () => request("/winners/featured"),

  // Admin
  adminDashboard: () => request("/admin/dashboard"),
  adminUsers: (qs = "") => request(`/admin/users${qs}`),
  adminBanUser: (id, reason) => request(`/admin/users/${id}/ban`, { method: "PUT", body: { reason } }),
  adminUnbanUser: (id) => request(`/admin/users/${id}/unban`, { method: "PUT" }),

  adminCreateTournament: (payload) => request("/admin/tournaments", { method: "POST", body: payload }),
  adminUpdateTournament: (id, payload) => request(`/admin/tournaments/${id}`, { method: "PUT", body: payload }),
  adminDeleteTournament: (id) => request(`/admin/tournaments/${id}`, { method: "DELETE" }),
  adminParticipants: (id) => request(`/admin/tournaments/${id}/participants`),

  adminSubmitResults: (id, payload) => request(`/admin/tournaments/${id}/results`, { method: "POST", body: payload }),
  adminDeclareWinners: (id, payload) => request(`/admin/tournaments/${id}/winners`, { method: "POST", body: payload }),

  adminCoupons: (qs="") => request(`/coupons${qs}`),
  adminCreateCoupon: (payload) => request("/coupons", { method: "POST", body: payload }),
  adminUpdateCoupon: (id, payload) => request(`/coupons/${id}`, { method: "PUT", body: payload }),
  adminDeleteCoupon: (id) => request(`/coupons/${id}`, { method: "DELETE" }),

  adminWithdrawals: (qs="") => request(`/admin/withdrawals${qs}`),
  adminProcessWithdrawal: (walletId, withdrawalId, payload) =>
    request(`/admin/withdrawals/${walletId}/${withdrawalId}`, { method: "PUT", body: payload }),
  adminWalletStats: () => request("/admin/wallet-stats")
};

export { API_BASE };