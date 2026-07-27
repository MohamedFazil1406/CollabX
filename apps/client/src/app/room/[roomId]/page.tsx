interface Props {
  params: Promise<{
    roomId: string;
  }>;
}

export default async function RoomPage({ params }: Props) {
  const { roomId } = await params;

  return (
    <main className="flex h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">Room: {roomId}</h1>
    </main>
  );
}
