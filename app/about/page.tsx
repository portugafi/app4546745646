"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Crown, BookOpen, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-red-800 to-yellow-600 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          onClick={() => router.back()}
          variant="outline"
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center">
          <div className="w-8 h-8 relative mr-2">
            <Image src="/portugalfi-logo.png" alt="PortugalFi Logo" fill className="object-contain" />
          </div>
          <span className="text-white font-semibold">PortugalFi</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <Image src="/portugalfi-logo.png" alt="PortugalFi Logo" fill className="object-contain" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">About PortugalFi</h1>
          <p className="text-xl text-yellow-200 max-w-2xl mx-auto">
            Dedicated to Portuguese heritage, culture, and building a stable progressive economy
          </p>
        </div>

        {/* Information Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <Crown className="w-8 h-8 text-yellow-400 mb-2" />
              <CardTitle className="text-white">Heritage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-200">Celebrating Portuguese history, culture and achievements</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <TrendingUp className="w-8 h-8 text-green-400 mb-2" />
              <CardTitle className="text-white">Economy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-200">Building a stable and progressive long-term economic future</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <BookOpen className="w-8 h-8 text-red-400 mb-2" />
              <CardTitle className="text-white">Partnership</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-200">Working together with TPulseFi for sustainable growth</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Our Mission</h2>
            <div className="space-y-4 text-yellow-200">
              <p>
                PortugalFi is dedicated to the Portuguese status and its rich history, vibrant culture, and remarkable
                achievements. We stand as guardians of Portuguese heritage while embracing the future of decentralized
                finance.
              </p>
              <p>
                In partnership with TPulseFi, we defend and promote a stable and progressive economy for the long term.
                Our vision extends beyond traditional finance, incorporating the values and traditions that make
                Portugal unique.
              </p>
              <p>
                Through innovative blockchain technology and deep respect for Portuguese culture, we're building a
                financial ecosystem that honors our past while securing our future. Join us in this journey of cultural
                preservation and economic innovation.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Partnership Section */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Partnership with TPulseFi</h2>
            <div className="space-y-4 text-yellow-200">
              <p>
                Our strategic alliance with TPulseFi represents a commitment to building sustainable economic solutions
                that benefit the Portuguese community and beyond.
              </p>
              <p>
                Together, we're creating innovative financial instruments that respect traditional values while
                embracing cutting-edge technology for long-term stability and growth.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
