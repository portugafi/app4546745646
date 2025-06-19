"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "./auth-provider"

export function UserProfile() {
  const { user, logout, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    return null
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Perfil do Usuário</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium">Endereço da Carteira:</p>
          <p className="text-sm text-muted-foreground font-mono">{user.walletAddress}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Autenticado em:</p>
          <p className="text-sm text-muted-foreground">{new Date(user.authTime).toLocaleString()}</p>
        </div>
        <Button onClick={handleLogout} variant="outline" className="w-full">
          Desconectar
        </Button>
      </CardContent>
    </Card>
  )
}
