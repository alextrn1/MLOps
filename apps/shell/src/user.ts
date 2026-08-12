export interface ShellUser {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatar?: string;
}

export const currentUser: ShellUser = {
  id: "anna-smirnova",
  name: "Анна Смирнова",
  role: "Lead Data Scientist",
  initials: "AS"
};
