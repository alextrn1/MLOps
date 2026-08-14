import { demoUsers } from "@mlops/contracts";

export const projectOwnerOptions = demoUsers.map((user) => ({
  value: user.id,
  label: `${user.name} (${user.title})`
}));
