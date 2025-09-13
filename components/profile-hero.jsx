import { Button } from "@/components/ui/button"
import { Users, UserPlus } from "lucide-react"

export function ProfileHero({ profile }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-6 h-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 rounded-xl" />
      <div className="relative z-10">
        <div className="flex items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-primary to-accent p-1">
              <img 
                src={profile.avatarUrl || "/professional-profile.png"} 
                alt={profile.user.username} 
                className="w-full h-full rounded-xl object-cover" 
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full border-2 border-card flex items-center justify-center">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse" />
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">{profile.user.username}</h1>
            <Button className="bg-primary hover:bg-primary/90 text-sm sm:text-base px-4 sm:px-6 py-2">
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="text-sm sm:text-base text-muted-foreground mb-6">
          <p>{profile.bio || "No bio available"}</p>
        </div>

        {/* Stats Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-foreground">Stats</h3>
          <div className="flex gap-6">
            {/* Followers */}
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <div className="text-xl font-bold text-foreground">{profile.followersCount}</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
            </div>
            
            {/* Following */}
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              <div>
                <div className="text-xl font-bold text-foreground">{profile.followingCount}</div>
                <div className="text-sm text-muted-foreground">Following</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
