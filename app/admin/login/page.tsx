type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string
    reason?: string
  }>
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const { error, reason } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-300 bg-white p-8 shadow-xl">
        <div className="mb-7 text-center">
          <p className="text-sm font-semibold tracking-[0.18em] text-blue-800">CHANG HUI ELECTRIC</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950">网站管理后台</h1>
          <p className="mt-2 text-sm text-slate-600">请使用客户管理员账号登录</p>
        </div>

        {reason === 'unauthorized' ? (
          <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            请先登录后再访问管理后台。
          </p>
        ) : null}

        {error ? (
          <p role="alert" className="mb-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        ) : null}

        <form action="/api/auth/login" method="post" className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-slate-800">
              邮箱
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-slate-400 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-slate-800">
              密码
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-slate-400 bg-white px-3 py-2.5 text-slate-950 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-800 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
          >
            登录
          </button>
        </form>
      </div>
    </div>
  )
}
