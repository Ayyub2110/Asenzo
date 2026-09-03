import { redirect } from 'next/navigation';

export default function RedirectToUnifiedAnalytics() {
  redirect('/acquisition/analytics');
}
