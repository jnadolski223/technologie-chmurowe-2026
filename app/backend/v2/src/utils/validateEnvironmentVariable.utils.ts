export const validateEnvironmentVariable = <T extends string | number | boolean>(
  variableName: string,
  variableType: 'string' | 'number' | 'boolean'
): T => {
  const value: string | undefined = process.env[variableName];

  if (!value) throw new Error(`Missing environment variable: "${variableName}"`);

  if (variableType === 'number') {
    const parsedNumber: number = parseInt(value, 10);

    if (!isNaN(parsedNumber)) return parsedNumber as T;

    throw new Error(`Environment variable "${variableName}" should be a number"`);
  }

  if (variableType === 'boolean') {
    const truthyValues: string[] = ['true', '1', 'yes'];
    const falsyValues: string[] = ['false', '0', 'no'];

    if (truthyValues.includes(value.toLowerCase())) return true as T;
    if (falsyValues.includes(value.toLowerCase())) return false as T;

    throw new Error(`Environment variable "${variableName}" should be a boolean`);
  }

  return value as T;
}
