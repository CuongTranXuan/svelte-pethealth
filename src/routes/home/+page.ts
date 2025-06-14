import { redirect } from '@sveltejs/kit';
import { browser } from '$app/environment';

export const load = async () => {
  // This will be handled by the component's reactive statements
  // since Firebase auth state is async
  return {};
};