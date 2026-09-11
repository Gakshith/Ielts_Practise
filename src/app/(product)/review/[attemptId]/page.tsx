import { ReviewView } from "./ReviewView";

export default async function Page({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params;
  return <ReviewView attemptId={attemptId} />;
}
