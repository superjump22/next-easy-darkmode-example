import { ExamplesCard } from '@/components/ExamplesCard'
import { ToggleButton } from '@/components/ToggleButton'

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center relative">
      <ExamplesCard />
      <div className="absolute top-4 right-4">
        <ToggleButton />
      </div>
    </main>
  )
}
