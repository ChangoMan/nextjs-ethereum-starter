type ButtonProps = {
  children: React.ReactNode
  className?: string
  onClick: () => void
}

function Button({
  children,
  className = '',
  onClick,
}: ButtonProps): JSX.Element {
  return (
    <button
      type="button"
      className={`${className} inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
