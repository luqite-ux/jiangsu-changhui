export function ServiceExpiredPage({ locale = 'en' }: { locale?: string }) {
  const zh = locale.toLowerCase().startsWith('zh')
  return <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
    <section className="w-full max-w-xl rounded-2xl border border-white/15 bg-white/5 p-8 text-center shadow-2xl">
      <p className="text-sm uppercase tracking-[0.25em] text-sky-300">Service Notice</p>
      <h1 className="mt-4 text-3xl font-semibold">{zh ? '您的网站服务已到期' : 'Website Service Has Expired'}</h1>
      <p className="mt-4 text-slate-300">{zh ? '如需恢复访问，请联系客服人员办理续费。' : 'Please contact your service representative to renew and restore access.'}</p>
      <a className="mt-8 inline-flex rounded-lg border border-white/20 px-5 py-2.5 text-sm hover:bg-white/10" href="/admin/login">{zh ? '管理员登录' : 'Administrator Login'}</a>
    </section>
  </main>
}
