import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import FacebookCommunityPopup from '@/components/layout/facebook-community-popup'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FacebookCommunityPopup />
    </div>
  )
}
