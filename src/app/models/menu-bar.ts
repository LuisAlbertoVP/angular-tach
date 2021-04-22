export interface FilterEvent {
  (url: string): void;
}

export interface MenuBar {
  title: string;
  filterEvent?: FilterEvent;
}