/** Django REST Framework routes (trailing slashes match DRF's default router). */
export const endpoints = {
  auth: {
    requestOtp: "/auth/otp/request/",
    verifyOtp: "/auth/otp/verify/",
    google: "/auth/google/",
    refresh: "/auth/token/refresh/",
    logout: "/auth/logout/",
  },
  feed: {
    home: "/feed/home/",
  },
  content: {
    list: "/content/",
    detail: (id: string) => `/content/${id}/`,
    reviews: (id: string) => `/content/${id}/reviews/`,
    like: (id: string) => `/content/${id}/like/`,
    save: (id: string) => `/content/${id}/save/`,
    report: (id: string) => `/content/${id}/report/`,
  },
  users: {
    me: "/users/me/",
    detail: (id: string) => `/users/${id}/`,
    content: (id: string) => `/users/${id}/content/`,
    reviews: (id: string) => `/users/${id}/reviews/`,
    follow: (id: string) => `/users/${id}/follow/`,
  },
  library: {
    saved: "/me/saved/",
  },
  search: {
    keyword: "/search/",
    semantic: "/search/semantic/",
    suggestions: "/search/suggestions/",
  },
  uploads: {
    presign: "/uploads/presign/",
  },
} as const;
