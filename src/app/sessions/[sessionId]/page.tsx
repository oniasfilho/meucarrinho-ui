import { ShoppingSessionScreen } from "@/features/shopping-session";
import { PageContainer } from "@/shared/components/PageContainer/PageContainer";

type SessionPageProps = {
  params: Promise<{ sessionId: string }>;
};

export default async function SessionPage({ params }: SessionPageProps) {
  const { sessionId } = await params;

  return (
    <PageContainer>
      <ShoppingSessionScreen sessionId={sessionId} />
    </PageContainer>
  );
}
