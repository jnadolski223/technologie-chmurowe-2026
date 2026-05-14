export function validateEnvironmentVariable<T extends string | number | boolean>(
  variableName: string,
  variableType: 'string' | 'number' | 'boolean' = 'string'
): T {
  const value: string | undefined = process.env[variableName];

  if (!value) {
    throw new Error(`[CONFIGURATION ERROR] Missing environment variable "${variableName}"`);
  }

  if (variableType === 'number') {
    const parsedNumber: number = parseInt(value, 10);
    if (isNaN(parsedNumber)) {
      throw new Error(`[CONFIGURATION ERROR] Variable "${variableName}" should be a number, but got "${value}"`);
    }
    return parsedNumber as T;
  }

  if (variableType === 'boolean') {
    const truthyValues: string[] = ['true', '1', 'yes'];
    const falsyValues: string[] = ['false', '0', 'no'];

    if (truthyValues.includes(value.toLowerCase())) return true as T;
    if (falsyValues.includes(value.toLowerCase())) return false as T;

    throw new Error(`[CONFIGURATION ERROR]: Variable "${variableName}" should be a boolean, but got "${value}"`);
  }

  return value as T;
}
