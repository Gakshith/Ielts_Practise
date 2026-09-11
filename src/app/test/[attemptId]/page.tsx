import { TestRoute } from "./TestRoute";

export default async function Page({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params;
  return <TestRoute attemptId={attemptId} />;
}
