export function isAdminEnabled(): boolean {
  return process.env.ADMIN_ENABLED === 'true';
}
