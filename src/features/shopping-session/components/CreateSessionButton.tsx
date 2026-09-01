import { Button } from "@/shared/components/Button/Button";

interface CreateSessionButtonProps {
  isCreating: boolean;
  onCreate(): void;
}

export function CreateSessionButton({
  isCreating,
  onCreate,
}: CreateSessionButtonProps) {
  return (
    <Button disabled={isCreating} aria-busy={isCreating} onClick={onCreate}>
      {isCreating ? "Criando…" : "Nova sessão"}
    </Button>
  );
}
