const PATHS: Record<string, string> = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>',
  box: '<path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/>',
  pin: '<path d="M12 22s7-7.58 7-12a7 7 0 10-14 0c0 4.42 7 12 7 12z"/><circle cx="12" cy="10" r="2.6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>',
  x: '<path d="M18 6L6 18M6 6l12 12"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  alert: '<path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"/><path d="M12 9v4"/><circle cx="12" cy="16.5" r="0.5" fill="currentColor"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 11-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 015.4-5.4z"/>',
  history: '<path d="M3 12a9 9 0 109-9 9 9 0 00-8 5"/><path d="M3 4v5h5"/><path d="M12 7v5l3.5 2"/>',
  filter: '<path d="M22 3H2l8 9.5V19l4 2v-8.5L22 3z"/>',
  eye: '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/>',
  layers: '<path d="M12 2l9 5-9 5-9-5 9-5z"/><path d="M3 12l9 5 9-5"/><path d="M3 17l9 5 9-5"/>',
  logout: '<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
};

export function Icon({
  name,
  size = 18,
  className,
}: {
  name: keyof typeof PATHS;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      style={{ width: size, height: size, flexShrink: 0 }}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: PATHS[name] || "" }}
    />
  );
}

export function actionIcon(action: string): keyof typeof PATHS {
  if (action === "Added") return "plus";
  if (action === "Removed") return "trash";
  if (action === "Status changed") return "alert";
  return "pencil";
}
