import { IoLogoGithub } from "react-icons/io"
import Button from "../ui/Button"

interface SigninWithGithubProps {
  className?: string
}

const SigninWithGithub = ({ className }: SigninWithGithubProps) => {
  return (
    <Button variant="outline" className={`${className} gap-2`}>
      <IoLogoGithub size={20} /> Continue with GitHub
    </Button>
  )
}
export default SigninWithGithub
