export interface DemoUser {
  id: string;
  name: string;
}

export interface PlatformContextValue {
  user: DemoUser;
  locale: string;
  navigate(to: string): void;
}
