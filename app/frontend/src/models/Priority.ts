export const ALLOWED_PRIORITIES = ['low', 'medium', 'high'] as const;

export type Priority = typeof ALLOWED_PRIORITIES[number];
