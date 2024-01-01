interface ConfigProps {
  port: number;
  apiUrl: string;
}
export const config = (): ConfigProps => ({
  port: parseInt(process.env.PORT) || 3000,
  apiUrl: process.env.API_URL,
});
