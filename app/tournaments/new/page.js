import { redirect } from 'next/navigation';

export default function NewTournamentRedirect() {
  redirect('/admin/tournaments/new');
}
