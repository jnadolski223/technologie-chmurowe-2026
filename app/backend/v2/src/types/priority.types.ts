export const ALLOWED_PRIORITIES = ['low', 'medium', 'high'] as const;

export type Priority = typeof ALLOWED_PRIORITIES[number];

export const isPriority = (value: any): value is Priority => {
  return ALLOWED_PRIORITIES.includes(value);
};
