import { MapPin, Pen } from "lucide-react"
import Image from "next/image"

const ProfileDetails = () => {
  return (
    <div className="border-border bg-surface mt-7 flex gap-4 rounded-lg border p-4">
      <div>
        <Image
          className="bg-surface rounded-full border"
          src="/image/MyProfile.png"
          alt="profile"
          width={100}
          height={100}
        />
      </div>

      <div className="w-full">
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">Sabin VV</h1>
            <span className="text-text-secondary">Full stack developer</span>
            <span className="flex items-center gap-1">
              <MapPin size={12} /> India
            </span>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-text-secondary">
            Full stack developer focused on building scalable web applications
            and continuously expanding my developer knowledge.
          </p>
          <div className="mt-4 flex gap-4">
            <span className="border-border text-primary bg-primary/10 rounded-md border px-4 py-1 text-sm">
              React
            </span>
            <span className="border-border text-primary bg-primary/10 rounded-md border px-4 py-1 text-sm">
              Typescript
            </span>
            <span className="border-border text-primary bg-primary/10 rounded-md border px-4 py-1 text-sm">
              Node.js
            </span>
            <span className="border-border text-primary bg-primary/10 rounded-md border px-4 py-1 text-sm">
              MongoDB
            </span>
          </div>
        </div>
      </div>
      <div>
        <button className="btn bg-primary flex items-center gap-2 rounded-md px-4 py-2">
          <Pen size={16} />
          Edit
        </button>
      </div>
    </div>
  )
}
export default ProfileDetails
