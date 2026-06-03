export const validateEnvironmentVariable = <T extends string | number>(
  variableName: string,
  variableType: 'string' | 'number'
): T => {
  const value: string | undefined = process.env[variableName];
  if (!value) throw new Error(`Missing environment variable: "${variableName}"`);

  if (variableType === 'number') {
    const parsedNumber: number = parseInt(value, 10);
    if (!isNaN(parsedNumber)) return parsedNumber as T;
    throw new Error(`Environment variable "${variableName}" should be a number"`);
  }

  return value as T;
}
