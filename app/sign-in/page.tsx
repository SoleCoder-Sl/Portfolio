import AuthForm from '@/components/AuthForm'

export const dynamic = 'force-dynamic'

export default function SignInPage() {
  return (
    <section className="flex min-h-screen w-full items-center justify-center p-4">
      <AuthForm />
    </section>
  )
}

