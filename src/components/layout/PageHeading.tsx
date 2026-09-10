interface PageHeadingProps {
  title: string
  description: string
}

const PageHeading = ({ title, description }: PageHeadingProps) => {
  return (
    <div>
      <h1 className="text-4xl">{title}</h1>
      <h4 className="text-text-secondary">{description}</h4>
    </div>
  )
}

export default PageHeading
