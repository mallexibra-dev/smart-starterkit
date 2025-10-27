export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

export interface TableOfContentsProps {
  items: TableOfContentsItem[];
  className?: string;
}

