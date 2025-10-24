import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  buttonText?: string
  onButtonClick?: () => void
  variant?: "default" | "outline"
}

export function FeatureCard({ icon, title, description, buttonText, onButtonClick, variant = "outline" }: FeatureCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="p-2 bg-orange-50 rounded-lg w-fit">
            {icon}
          </div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
          {buttonText && (
            <Button variant={variant} size="sm" onClick={onButtonClick}>
              {buttonText}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}