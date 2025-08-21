interface IconProps {
  className?: string;
}

export function ChevronDownIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-label="Chevron Down"
    >
      <title>Chevron Down</title>
      <path
        fillRule="evenodd"
        d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
      />
    </svg>
  );
}

export function ExternalLinkIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-label="External Link"
    >
      <title>External Link</title>
      <path
        fillRule="evenodd"
        d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5Z"
      />
      <path
        fillRule="evenodd"
        d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5Z"
      />
    </svg>
  );
}

export function SearchIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-label="Search"
    >
      <title>Search</title>
      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
    </svg>
  );
}

export function StarIcon({
  className = "w-4 h-4",
  filled = false,
}: IconProps & { filled?: boolean }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1"
      aria-label="Star"
    >
      <title>Star</title>
      <path d="M8 1.5L9.5 5.5L14 6L11 9L11.5 13.5L8 11.5L4.5 13.5L5 9L2 6L6.5 5.5L8 1.5Z" />
    </svg>
  );
}

export function FilterIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-label="Filter"
    >
      <title>Filter</title>
      <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
    </svg>
  );
}

export function GridIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-label="Grid"
    >
      <title>Grid</title>
      <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
    </svg>
  );
}

export function ListIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-label="List"
    >
      <title>List</title>
      <path
        fillRule="evenodd"
        d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
      />
    </svg>
  );
}

export function TrendingUpIcon({ className = "w-4 h-4" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-label="Trending Up"
    >
      <title>Trending Up</title>
      <path
        fillRule="evenodd"
        d="M1 11.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 0-1h-3.025l3.536-3.536a.5.5 0 0 1 .708 0L10 10.75l3.146-3.147a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0L6.5 8.664 3.464 11.7l-.036.036H5.5a.5.5 0 0 0 0-1h-4a.5.5 0 0 0-.5.5z"
      />
    </svg>
  );
}
